import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, runTransaction, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

// Helper function to handle both Firestore Timestamps and ISO strings
function parseDate(val: any): Date {
  if (!val) return new Date(0);
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val.toDate === 'function') return val.toDate();
  if (typeof val === 'string') return new Date(val);
  return new Date(0);
}

export async function POST(req: NextRequest) {
  try {
    const apiKeyFromHeader = req.headers.get('x-api-key');
    if (!apiKeyFromHeader) {
      return NextResponse.json({ status: false, message: 'Missing API Key' }, { status: 401 });
    }

    const { db } = initializeFirebase();

    // 1. Validate API Key in 'stores' collection
    const storesRef = collection(db, 'stores');
    const q = query(storesRef, where('apiKey', '==', apiKeyFromHeader), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ status: false, message: 'Invalid API Key' }, { status: 401 });
    }

    const storeDoc = querySnapshot.docs[0].data();
    const userIdFromStore = storeDoc.userId;

    // 2. Validate Body
    const { sessionId, trxId: rawTrxId, method } = await req.json();

    if (!sessionId || !rawTrxId || !method) {
      return NextResponse.json({ status: false, message: 'Missing parameters' }, { status: 400 });
    }

    const trxId = rawTrxId.trim().toUpperCase();

    // 3. Start Atomic Transaction
    const result = await runTransaction(db, async (transaction) => {
      const sessionRef = doc(db, 'payment_sessions', sessionId);
      const trxRef = doc(db, 'transactions', trxId);

      const sessionSnap = await transaction.get(sessionRef);
      const trxSnap = await transaction.get(trxRef);

      // Session checks
      if (!sessionSnap.exists()) throw new Error('Invalid session');
      const sessionData = sessionSnap.data();
      if (sessionData.isUsed === true || sessionData.status !== 'pending') throw new Error('Already used');
      
      const expiresAt = parseDate(sessionData.expiresAt);
      if (new Date() > expiresAt) throw new Error('Session expired');
      
      if (sessionData.userId !== userIdFromStore) throw new Error('User mismatch');

      // Transaction checks
      if (!trxSnap.exists()) throw new Error('Transaction not found');
      const trxData = trxSnap.data();
      
      if (trxData.status !== 'unused') throw new Error('Already used');
      if (trxData.source?.toLowerCase() !== method?.toLowerCase()) throw new Error('Method mismatch');
      
      const sessionAmount = Number(sessionData.amount);
      const trxAmount = Number(trxData.amount);
      if (Math.abs(trxAmount - sessionAmount) > 0.01) {
        throw new Error('Amount mismatch');
      }
      
      if (trxData.userId !== userIdFromStore) throw new Error('Transaction user mismatch');

      // Execute updates
      transaction.update(trxRef, { status: 'used' });
      transaction.update(sessionRef, {
        status: 'verified',
        isUsed: true,
        method: method,
        trxId: trxId,
        verifiedAt: new Date().toISOString()
      });

      return {
        status: 'verified',
        trxId: trxId,
        amount: sessionAmount
      };
    });

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ 
      status: false, 
      message: error.message || 'Verification failed' 
    }, { status: 400 });
  }
}

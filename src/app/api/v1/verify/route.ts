
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, runTransaction, collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ status: false, message: 'Missing API Key' }, { status: 401 });
    }

    const { db } = initializeFirebase();

    // 1. Validate API Key
    const apiKeysRef = collection(db, 'api_keys');
    const q = query(apiKeysRef, where('key', '==', apiKey), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ status: false, message: 'Invalid API Key' }, { status: 401 });
    }

    const apiKeyDoc = querySnapshot.docs[0].data();
    const userId = apiKeyDoc.userId;

    // 2. Validate Body
    const { sessionId, trxId: rawTrxId, method } = await req.json();

    if (!sessionId || !rawTrxId || !method) {
      return NextResponse.json({ status: false, message: 'Missing parameters' }, { status: 400 });
    }

    // Normalize transaction ID (Trim and Uppercase)
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
      if (sessionData.status !== 'pending') throw new Error('Already used');
      
      const now = new Date();
      if (now > new Date(sessionData.expiresAt)) throw new Error('Session expired');
      if (sessionData.userId !== userId) throw new Error('User mismatch');

      // Transaction checks
      if (!trxSnap.exists()) throw new Error('Transaction not found');
      const trxData = trxSnap.data();
      
      if (trxData.status !== 'unused') throw new Error('Already used');
      if (trxData.source?.toLowerCase() !== method?.toLowerCase()) throw new Error('Method mismatch');
      
      // Strict amount check (handling both float and int)
      if (Math.abs(Number(trxData.amount) - Number(sessionData.amount)) > 0.01) {
        throw new Error('Amount mismatch');
      }
      
      if (trxData.userId !== userId) throw new Error('User mismatch');

      // Execute updates
      transaction.update(trxRef, { status: 'used' });
      transaction.update(sessionRef, {
        status: 'verified',
        method: method,
        trxId: trxId,
        verifiedAt: new Date().toISOString()
      });

      return {
        status: 'verified',
        trxId: trxId,
        amount: sessionData.amount
      };
    });

    return NextResponse.json(result);

  } catch (error: any) {
    // Log error internally if needed, but return generic false status
    return NextResponse.json({ 
      status: false, 
      message: error.message || 'Verification failed' 
    }, { status: 400 });
  }
}

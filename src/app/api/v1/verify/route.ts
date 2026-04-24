
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, runTransaction, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

function parseDate(val: any): Date {
  if (!val) return new Date(0);
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val === 'string') return new Date(val);
  return new Date(0);
}

async function callWebhook(url: string, payload: any) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error('Webhook failed:', e);
  }
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
      // Path: payment_sessions/{userId}/sessions/{sessionId}
      const sessionRef = doc(db, 'payment_sessions', userIdFromStore, 'sessions', sessionId);
      const trxRef = doc(db, 'transactions', trxId);

      const sessionSnap = await transaction.get(sessionRef);
      const trxSnap = await transaction.get(trxRef);

      if (!sessionSnap.exists()) throw new Error('Invalid session');
      const sessionData = sessionSnap.data();
      if (sessionData.isUsed === true || sessionData.status !== 'pending') throw new Error('Already used');
      
      const expiresAt = parseDate(sessionData.expiresAt);
      if (new Date() > expiresAt) throw new Error('Session expired');
      if (sessionData.apiKey !== apiKeyFromHeader) throw new Error('API Key mismatch');

      if (!trxSnap.exists()) throw new Error('Transaction not found');
      const trxData = trxSnap.data();
      if (trxData.status !== 'unused') throw new Error('Already used');
      
      const sessionAmount = Number(sessionData.amount);
      const trxAmount = Number(trxData.amount);
      if (Math.abs(trxAmount - sessionAmount) > 0.01) throw new Error('Amount mismatch');
      if (trxData.userId !== userIdFromStore) throw new Error('User mismatch');

      // Get sender number from transaction document
      const senderNumber = trxData.sender || trxData.source || 'N/A';

      // Execute updates
      transaction.update(trxRef, { status: 'used' });
      transaction.update(sessionRef, {
        status: 'verified',
        isUsed: true,
        method: method,
        trxId: trxId,
        sender: senderNumber, // Adding sender number to the session
        verifiedAt: new Date().toISOString()
      });

      // Prepare Webhook Payload
      if (sessionData.webhook_url) {
        callWebhook(sessionData.webhook_url, {
          status: 'verified',
          trxId: trxId,
          sender: senderNumber,
          amount: sessionAmount,
          sessionId: sessionId,
          val_id: sessionData.val_id
        });
      }

      return { status: 'verified', trxId, amount: sessionAmount, sender: senderNumber };
    });

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ status: false, message: error.message || 'Verification failed' }, { status: 400 });
  }
}

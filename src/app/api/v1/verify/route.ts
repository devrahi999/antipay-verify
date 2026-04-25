import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, runTransaction, getDoc, Timestamp } from 'firebase/firestore';

function parseDate(val: any): Date {
  if (!val) return new Date(0);
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val === 'string') return new Date(val);
  return new Date(0);
}

async function callWebhook(url: string, payload: any) {
  try {
    // Non-blocking fire-and-forget for speed, but awaited here to ensure delivery
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(e => console.error('Webhook fetch error:', e));
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

    // 1. Fast API Key Validation
    const storeSnap = await getDoc(doc(db, 'stores', apiKeyFromHeader));

    if (!storeSnap.exists() || storeSnap.data().status !== 'active') {
      return NextResponse.json({ status: false, message: 'Invalid API Key' }, { status: 401 });
    }

    const userIdFromStore = storeSnap.data().userId;

    // 2. Validate Body
    const { sessionId, trxId: rawTrxId, method } = await req.json();

    if (!sessionId || !rawTrxId || !method) {
      return NextResponse.json({ status: false, message: 'Missing parameters' }, { status: 400 });
    }

    const trxId = rawTrxId.trim().toUpperCase();

    // 3. Start Atomic Transaction (Optimized: No external calls inside)
    let webhookInfo: any = null;

    const result = await runTransaction(db, async (transaction) => {
      const sessionRef = doc(db, 'payment_sessions', userIdFromStore, 'sessions', sessionId);
      const trxRef = doc(db, 'transactions', trxId);

      const sessionSnap = await transaction.get(sessionRef);
      const trxSnap = await transaction.get(trxRef);

      if (!sessionSnap.exists()) throw new Error('Invalid session');
      const sessionData = sessionSnap.data();
      
      if (sessionData.isUsed === true) throw new Error('Already used');
      if (new Date() > parseDate(sessionData.expiresAt)) throw new Error('Session expired');
      if (sessionData.apiKey !== apiKeyFromHeader) throw new Error('API Key mismatch');

      if (!trxSnap.exists()) throw new Error('Transaction not found');
      const trxData = trxSnap.data();
      if (trxData.status !== 'unused') throw new Error('Already used');
      
      const sessionAmount = Number(sessionData.amount);
      const trxAmount = Number(trxData.amount);
      if (Math.abs(trxAmount - sessionAmount) > 0.01) throw new Error('Amount mismatch');
      if (trxData.userId !== userIdFromStore) throw new Error('User mismatch');

      transaction.update(trxRef, { status: 'used' });
      transaction.update(sessionRef, {
        status: 'verified',
        isUsed: true,
        method: method,
        trxId: trxId,
        sender: trxData.sender || trxData.source || 'N/A',
        verifiedAt: new Date().toISOString()
      });

      // Collect webhook info to call after transaction
      if (sessionData.webhook_url) {
        webhookInfo = {
          url: sessionData.webhook_url,
          payload: {
            status: 'verified',
            trxId: trxId,
            amount: sessionAmount,
            sessionId: sessionId,
            val_id: sessionData.val_id
          }
        };
      }

      return { status: 'verified', trxId, amount: sessionAmount };
    });

    // 4. Call Webhook asynchronously after success (Does not block main response)
    if (webhookInfo) {
      callWebhook(webhookInfo.url, webhookInfo.payload);
    }

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ status: false, message: error.message || 'Verification failed' }, { status: 400 });
  }
}

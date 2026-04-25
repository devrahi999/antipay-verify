import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ status: false, message: 'Missing API Key' }, { status: 401 });
    }

    const { db } = initializeFirebase();

    // 1. Optimized API Key Validation (Direct Doc Lookup is faster than query)
    const storeSnap = await getDoc(doc(db, 'stores', apiKey));

    if (!storeSnap.exists() || storeSnap.data().status !== 'active') {
      return NextResponse.json({ status: false, message: 'Invalid or inactive API Key' }, { status: 401 });
    }

    const storeData = storeSnap.data();
    const userId = storeData.userId;

    // 2. Validate Body
    const body = await req.json();
    const amount = Number(body.amount);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ status: false, message: 'Invalid amount' }, { status: 400 });
    }

    // 3. Generate Smart Session ID (Encodes userId to keep URL clean)
    const randomPart = Math.random().toString(36).substring(2, 10);
    const sessionId = `${userId}_${randomPart}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const sessionData = {
      sessionId,
      apiKey,
      userId,
      amount,
      status: 'pending',
      isUsed: false,
      createdAt: new Date().toISOString(),
      expiresAt,
      method: null,
      trxId: null,
      val_id: body.val_id || null,
      webhook_url: body.webhook_url || null,
    };

    // Path: payment_sessions/{userId}/sessions/{sessionId}
    await setDoc(doc(db, 'payment_sessions', userId, 'sessions', sessionId), sessionData);

    // 4. Return
    const host = req.headers.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const payment_url = `${protocol}://${host}/s/${sessionId}`;

    return NextResponse.json({
      status: true,
      sessionId,
      payment_url
    });

  } catch (error: any) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}

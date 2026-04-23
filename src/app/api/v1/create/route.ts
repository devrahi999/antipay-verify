
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ status: false, message: 'Missing API Key' }, { status: 401 });
    }

    const { db } = initializeFirebase();

    // 1. Validate API Key in 'stores' collection (Field is 'apiKey')
    const storesRef = collection(db, 'stores');
    const q = query(storesRef, where('apiKey', '==', apiKey), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ status: false, message: 'Invalid or inactive API Key' }, { status: 401 });
    }

    const storeDoc = querySnapshot.docs[0].data();
    const userId = storeDoc.userId;

    // 2. Validate Body
    const body = await req.json();
    const amount = Number(body.amount);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ status: false, message: 'Invalid amount' }, { status: 400 });
    }

    // 3. Generate Session
    const sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const sessionData = {
      sessionId,
      apiKey,
      userId,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      method: null,
      trxId: null,
      val_id: body.val_id || null,
    };

    await setDoc(doc(db, 'payment_sessions', sessionId), sessionData);

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

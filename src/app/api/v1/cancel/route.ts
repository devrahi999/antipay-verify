import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

async function callWebhook(url: string, payload: any) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error('Cancel Webhook failed:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) return NextResponse.json({ status: false, message: 'Missing sessionId' }, { status: 400 });

    const { db } = initializeFirebase();
    const sessionRef = doc(db, 'payment_sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) return NextResponse.json({ status: false, message: 'Session not found' }, { status: 404 });
    
    const sessionData = sessionSnap.data();
    if (sessionData.isUsed) return NextResponse.json({ status: false, message: 'Session already finished' }, { status: 400 });

    await updateDoc(sessionRef, {
      status: 'cancelled',
      isUsed: true
    });

    if (sessionData.webhook_url) {
      callWebhook(sessionData.webhook_url, {
        status: 'cancelled',
        sessionId: sessionId,
        val_id: sessionData.val_id
      });
    }

    return NextResponse.json({ status: 'cancelled' });

  } catch (error: any) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}

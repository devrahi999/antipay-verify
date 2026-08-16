import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

/**
 * Manual review submission.
 *
 * When automatic verification keeps failing (wrong/unsynced TrxID, SMS never
 * reached the Android app, etc.) the customer can hand the payment over to the
 * merchant. Everything needed to settle the payment later — the session, the
 * webhook target, the store and the customer's claim — is snapshotted into a
 * single `pending_transactions/{sessionId}` document so the merchant console
 * never has to re-assemble it.
 */
export async function POST(req: NextRequest) {
  try {
    const apiKeyFromHeader = req.headers.get('x-api-key');

    if (!apiKeyFromHeader) {
      return NextResponse.json({ status: false, message: 'Missing API Key' }, { status: 401 });
    }

    const { db } = initializeFirebase();

    const storeSnap = await getDoc(doc(db, 'stores', apiKeyFromHeader));

    if (!storeSnap.exists() || storeSnap.data().status !== 'active') {
      return NextResponse.json({ status: false, message: 'Invalid API Key' }, { status: 401 });
    }

    const storeData = storeSnap.data();
    const userId = storeData.userId;

    const body = await req.json();
    const { sessionId, method } = body;
    const rawTrxId = body.trxId;
    const rawSender = body.sender;

    if (!sessionId || !rawTrxId || !rawSender) {
      return NextResponse.json(
        { status: false, message: 'sessionId, trxId and sender are required' },
        { status: 400 }
      );
    }

    const trxId = String(rawTrxId).trim().toUpperCase();
    const sender = String(rawSender).replace(/[\s-]/g, '').trim();

    if (trxId.length < 4) {
      return NextResponse.json({ status: false, message: 'Invalid Transaction ID' }, { status: 400 });
    }
    if (!/^\+?\d{6,20}$/.test(sender)) {
      return NextResponse.json({ status: false, message: 'Invalid sender number' }, { status: 400 });
    }

    const sessionRef = doc(db, 'payment_sessions', userId, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      return NextResponse.json({ status: false, message: 'Invalid session' }, { status: 404 });
    }

    const sessionData = sessionSnap.data();

    if (sessionData.apiKey !== apiKeyFromHeader) {
      return NextResponse.json({ status: false, message: 'API Key mismatch' }, { status: 401 });
    }
    if (sessionData.isUsed === true) {
      return NextResponse.json({ status: false, message: 'This payment is already finished' }, { status: 400 });
    }

    // One review request per session: the session ID doubles as the document ID,
    // so a resubmit updates the same record instead of piling up duplicates.
    const pendingRef = doc(db, 'pending_transactions', sessionId);
    const existing = await getDoc(pendingRef);

    if (existing.exists() && existing.data().status === 'pending') {
      return NextResponse.json(
        { status: false, message: 'Already submitted. Please wait for the merchant to review it.' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const attempts = Number(body.attempts);

    const pendingDoc = {
      // --- identity ---
      id: sessionId,
      status: 'pending' as const, // pending | completed | rejected
      submittedAt: now,
      updatedAt: now,
      source: 'manual_review',

      // --- owner (which merchant this belongs to) ---
      userId,
      apiKey: apiKeyFromHeader,

      // --- what the customer claims to have paid ---
      trxId,
      sender,
      method: method || sessionData.method || null,
      amount: Number(sessionData.amount),

      claim: {
        trxId,
        sender,
        method: method || null,
        submittedAt: now,
        failedAttempts: isFinite(attempts) ? attempts : 0,
        lastError: body.lastError || null,
      },

      // --- why the payment was created (settlement details) ---
      sessionId,
      val_id: sessionData.val_id ?? null,
      webhook_url: sessionData.webhook_url ?? null,

      session: {
        sessionId: sessionData.sessionId ?? sessionId,
        amount: Number(sessionData.amount),
        status: sessionData.status ?? null,
        isUsed: sessionData.isUsed ?? false,
        method: sessionData.method ?? null,
        trxId: sessionData.trxId ?? null,
        val_id: sessionData.val_id ?? null,
        webhook_url: sessionData.webhook_url ?? null,
        createdAt: sessionData.createdAt ?? null,
        expiresAt: sessionData.expiresAt ?? null,
      },

      // --- brand snapshot, so the console needs no extra read ---
      store: {
        id: apiKeyFromHeader,
        name: storeData.name ?? null,
        websiteUrl: storeData.websiteUrl ?? null,
        logoUrl: storeData.logoUrl ?? null,
        supportPhone: storeData.supportPhone ?? null,
        supportEmail: storeData.supportEmail ?? null,
      },

      // --- request fingerprint, useful when judging a suspicious claim ---
      client: {
        userAgent: req.headers.get('user-agent') || null,
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
        referer: req.headers.get('referer') || null,
      },

      // --- settlement outcome, filled in by the merchant console ---
      reviewedAt: null,
      reviewedBy: null,
      webhookDelivered: null,
    };

    await setDoc(pendingRef, pendingDoc);

    // Flag the session as under review without touching `status`/`isUsed`, so the
    // normal verify flow keeps working if the customer finds the correct TrxID.
    await updateDoc(sessionRef, {
      reviewStatus: 'pending',
      reviewSubmittedAt: now,
      reviewId: sessionId,
    });

    return NextResponse.json({ status: 'submitted', reviewId: sessionId });

  } catch (error: any) {
    console.error('❌ REVIEW SUBMIT ERROR:', error);
    return NextResponse.json(
      { status: false, message: error.message || 'Submission failed' },
      { status: 500 }
    );
  }
}

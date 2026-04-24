"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Home, CheckCircle2, User, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFirestore } from "@/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

function SuccessContent() {
  const { sessionId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [session, setSession] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    async function fetchData() {
      if (!sessionId) return;
      try {
        const sid = sessionId as string;
        const userId = sid.substring(0, sid.lastIndexOf('_'));
        
        if (!userId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, "payment_sessions", userId, "sessions", sid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSession(data);
          const q = query(collection(db, "stores"), where("apiKey", "==", data.apiKey));
          const qs = await getDocs(q);
          if (!qs.empty) setStore(qs.docs[0].data());
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchData();
  }, [sessionId, db]);

  const handleRedirect = () => {
    const baseUrl = store?.redirectSuccessUrl || store?.websiteUrl || "/";
    const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
    url.searchParams.append("status", "success");
    url.searchParams.append("trxId", session?.trxId || "");
    url.searchParams.append("amount", (session?.amount || 0).toString());
    url.searchParams.append("sessionId", sessionId as string);
    window.location.href = url.toString();
  };

  useEffect(() => {
    if (loading || !store) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, store]);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#F7F8F9]"><Loader2 className="animate-spin h-8 w-8 text-[#10853D]" /></main>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#eef2f6]">
      <div className="w-full sm:max-w-[420px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-[#10853D] py-4 flex flex-col items-center gap-2">
          <CheckCircle2 className="w-10 h-10 text-white" />
          <h3 className="text-white font-bold text-lg">পেমেন্ট সফল!</h3>
        </div>
        
        <div className="flex flex-col items-center py-6">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-2 bg-gray-50 flex items-center justify-center">
            {store?.logoUrl ? <Image src={store.logoUrl} alt="Store" fill className="object-cover" /> : <User className="w-8 h-8 text-gray-300" />}
          </div>
          <h2 className="text-xs font-black text-gray-700 uppercase tracking-wide">{store?.name || "Merchant Store"}</h2>
        </div>

        <div className="px-5 mb-6">
          <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
            <div className="flex justify-between text-[10px]"><span className="text-gray-400 font-bold uppercase">ইনভয়েস আইডিঃ</span><span className="text-gray-700 font-black">{session?.sessionId?.toUpperCase()}</span></div>
            <div className="flex justify-between text-[10px]"><span className="text-gray-400 font-bold uppercase">টাকার পরিমাণঃ</span><span className="text-[#10853D] font-black">৳{Number(session?.amount).toFixed(2)}</span></div>
            <div className="flex justify-between text-[10px]"><span className="text-gray-400 font-bold uppercase">ট্রানজেকশন আইডিঃ</span><span className="text-blue-600 font-black">{session?.trxId || "N/A"}</span></div>
          </div>
        </div>

        <div className="px-5 pb-8">
          <Button onClick={handleRedirect} className="w-full h-11 bg-[#10853D] hover:bg-[#0d6e32] text-white font-black text-xs rounded-xl uppercase tracking-widest gap-2">
            <Home className="w-4 h-4" /> <span>ওয়েবসাইটে ফিরে যান ({timeLeft}s)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-[#10853D]" /></main>}>
      <SuccessContent />
    </Suspense>
  );
}

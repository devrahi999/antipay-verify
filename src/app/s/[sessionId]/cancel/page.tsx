"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { XCircle, Home, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFirestore } from "@/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function CancelPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const db = useFirestore();
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
          const q = query(collection(db, "stores"), where("apiKey", "==", data.apiKey));
          const qs = await getDocs(q);
          if (!qs.empty) setStore(qs.docs[0].data());
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    fetchData();
  }, [sessionId, db]);

  const handleRedirect = () => {
    const baseUrl = store?.redirectCancelUrl || store?.websiteUrl || "/";
    const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
    url.searchParams.append("status", "cancelled");
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

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#F7F8F9]"><Loader2 className="animate-spin h-8 w-8 text-red-500" /></main>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#eef2f6]">
      <div className="w-full sm:max-w-[420px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-[#D12026] py-4 flex flex-col items-center gap-2">
          <XCircle className="w-10 h-10 text-white" />
          <h3 className="text-white font-bold text-lg">পেমেন্ট বাতিল!</h3>
        </div>

        <div className="flex flex-col items-center py-8">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm mb-2 bg-gray-50 flex items-center justify-center">
            {store?.logoUrl ? <Image src={store.logoUrl} alt="Store" fill className="object-cover" /> : <User className="w-8 h-8 text-gray-300" />}
          </div>
          <h2 className="text-xs font-black text-gray-700 uppercase tracking-wide mb-4">{store?.name || "Merchant Store"}</h2>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">আপনি পেমেন্ট বাতিল করেছেন।</p>
        </div>

        <div className="px-5 pb-8">
          <Button onClick={handleRedirect} className="w-full h-11 bg-white hover:bg-gray-50 text-red-600 font-bold text-xs rounded-xl border border-gray-100 uppercase tracking-widest gap-2">
            <Home className="w-4 h-4" /> <span>ওয়েবসাইটে ফিরে যান ({timeLeft}s)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
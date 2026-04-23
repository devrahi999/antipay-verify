
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, CheckCircle2, User, FileText, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFirestore } from "@/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const db = useFirestore();
  const [session, setSession] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "payment_sessions", sessionId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const sessionData = docSnap.data();
          setSession(sessionData);

          const storesRef = collection(db, "stores");
          const q = query(storesRef, where("apiKey", "==", sessionData.apiKey));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            setStore(querySnapshot.docs[0].data());
          }
        }
      } catch (error) {
        console.error("Error fetching success data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sessionId, db]);

  const handleHome = () => {
    if (store?.websiteUrl) {
      const url = store.websiteUrl.startsWith('http') ? store.websiteUrl : `https://${store.websiteUrl}`;
      window.location.href = url;
    } else {
      router.push('/');
    }
  };

  const bgPattern = {
    backgroundColor: '#eef2f6',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='16' height='16' rx='4' ry='4' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1.2'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8F9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </main>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden"
      style={bgPattern}
    >
      <div className="w-full sm:max-w-[420px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100/50 flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
        
        {/* Success Banner */}
        <div className="px-5 mt-8">
          <div className="bg-white rounded-xl border border-green-100 overflow-hidden shadow-md">
            <div className="bg-[#10853D] py-3 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <h3 className="text-white font-bold text-sm tracking-wide">পেমেন্ট সফল!</h3>
            </div>
            <div className="py-4 text-center">
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">আপনার পেমেন্টটি সফলভাবে সম্পন্ন হয়েছে।</p>
            </div>
          </div>
        </div>

        {/* Merchant Info */}
        <div className="flex flex-col items-center py-6 px-6">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white shadow-sm mb-2 bg-gray-50 flex items-center justify-center">
            {store?.logoUrl ? (
              <Image src={store.logoUrl} alt="Store" fill className="object-cover" />
            ) : (
              <User className="w-8 h-8 text-gray-300" />
            )}
          </div>
          <h2 className="text-xs font-black text-gray-700 uppercase tracking-wide">
            {store?.name || "Merchant Store"}
          </h2>
        </div>

        {/* Transaction Details Box */}
        <div className="px-5 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-gray-50/50 py-2.5 px-4 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#10853D]" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">পেমেন্ট ডিটেইলস</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-400 font-bold uppercase">ইনভয়েস আইডিঃ</span>
                <span className="text-gray-700 font-black">{session?.sessionId?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-400 font-bold uppercase">টাকার পরিমাণঃ</span>
                <span className="text-[#10853D] font-black text-xs">৳{Number(session?.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-400 font-bold uppercase">ট্রানজেকশন আইডিঃ</span>
                <span className="text-blue-600 font-black">{session?.trxId || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Return Button */}
        <div className="px-5 pb-8">
          <Button 
            onClick={handleHome}
            className="w-full h-11 bg-[#10853D] hover:bg-[#0d6e32] text-white font-black text-xs rounded-xl shadow-[0_4px_15px_rgba(16,133,61,0.2)] gap-3 flex items-center justify-center transition-all active:scale-[0.98] uppercase tracking-[0.15em]"
          >
            <Home className="w-5 h-5" />
            <span>হোম পেজে ফিরে যান</span>
          </Button>
        </div>
      </div>

      <div className="mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">
        Secured by AntiPay Gateway
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-[#F7F8F9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}

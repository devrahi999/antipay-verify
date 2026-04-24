"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, X, Copy, Check, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const METHOD_STATIC_CONFIG: Record<string, { name: string, logo: string, color: string, dial: string }> = {
  bkash: { name: "BKASH", logo: "https://i.imgur.com/GeOlI04.png", color: "#E2136E", dial: "*247#" },
  nagad: { name: "NAGAD", logo: "https://i.imgur.com/RZBbEjb.png", color: "#D12026", dial: "*167#" },
  rocket: { name: "ROCKET", logo: "https://i.imgur.com/wolCFJc.png", color: "#8C3494", dial: "*322#" },
  upay: { name: "UPAY", logo: "https://i.imgur.com/iqgxYRk.png", color: "#FFD400", dial: "*268#" },
};

export default function MethodPage() {
  const { userId, sessionId, method } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!userId || !sessionId) return;
      try {
        const docRef = doc(db, "payment_sessions", userId as string, "sessions", sessionId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.isUsed) { setNotFound(true); return; }
          setSession(data);
          const q = query(collection(db, "stores"), where("apiKey", "==", data.apiKey));
          const qs = await getDocs(q);
          if (!qs.empty) { setStore(qs.docs[0].data()); }
        } else { setNotFound(true); }
      } catch (e) { setNotFound(true); } finally { setLoading(false); }
    }
    fetchData();
  }, [userId, sessionId, db]);

  const handleCancel = async () => {
    if (!sessionId || !userId || isCancelling) return;
    setIsCancelling(true);
    try {
      const res = await fetch('/api/v1/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId })
      });
      if (res.ok) router.push(`/s/${userId}/${sessionId}/cancel`);
    } catch (e) { console.error(e); } finally { setIsCancelling(false); }
  };

  const handleVerify = async () => {
    if (!trxId) { toast({ variant: "destructive", title: "ভুল হয়েছে!", description: "ট্রানজেকশন আইডি দিন।" }); return; }
    setIsVerifying(true);
    try {
      const res = await fetch('/api/v1/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': session.apiKey },
        body: JSON.stringify({ sessionId, trxId: trxId.trim(), method })
      });
      const result = await res.json();
      if (res.ok && result.status === 'verified') {
        toast({ variant: "success", title: "সফল!", description: "পেমেন্ট সম্পন্ন হয়েছে।" });
        setTimeout(() => router.push(`/s/${userId}/${sessionId}/success`), 1500);
      } else {
        toast({ variant: "destructive", title: "ভুল হয়েছে!", description: result.message || "ভেরিফিকেশন ব্যর্থ হয়েছে।" });
      }
    } catch (e) { toast({ variant: "destructive", title: "ভুল হয়েছে!", description: "সার্ভার এরর।" }); }
    finally { setIsVerifying(false); }
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#F7F8F9]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></main>;
  if (notFound) return <main className="flex min-h-screen items-center justify-center bg-[#F7F8F9]"><h1 className="text-xl font-medium text-muted-foreground">404 not found</h1></main>;

  const methodDataFromDB = (store?.methods || []).map((m: any) => {
    const id = Object.keys(m)[0];
    return { id, ...m[id] };
  }).find((m: any) => m.id.toLowerCase() === (method as string).toLowerCase());

  const staticConfig = METHOD_STATIC_CONFIG[(method as string).toLowerCase()] || { name: (method as string).toUpperCase(), logo: "https://placehold.co/200x80?text=" + method, color: "#666666", dial: "*XXX#" };
  const config = { 
    ...staticConfig, 
    logo: methodDataFromDB?.logoUrl || staticConfig.logo, 
    number: methodDataFromDB?.number || "01XXXXXXXXX", 
    name: methodDataFromDB?.name || staticConfig.name 
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(config.number);
    setCopied(true);
    toast({ variant: "success", title: "সফল!", description: "নম্বর কপি করা হয়েছে।" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 relative overflow-x-hidden" style={{ backgroundColor: '#eef2f6' }}>
      <div className="w-full h-full sm:h-auto sm:max-w-[420px] bg-transparent sm:bg-white sm:rounded-xl sm:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-0 sm:border border-gray-100/50 flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-screen sm:min-h-0 pb-24 sm:pb-0">
        
        {/* Top Header */}
        <div className="mx-5 mt-4 sm:mx-0 sm:mt-0 h-10 flex items-center justify-between px-4 sm:border-b border-gray-200 bg-white rounded-xl sm:rounded-none shadow-sm sm:shadow-none border border-gray-200 sm:border-0">
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => router.back()}><ChevronLeft className="w-6 h-6" /></Button>
          <Button variant="ghost" size="icon" disabled={isCancelling} className="w-7 h-7" onClick={() => setShowCancelAlert(true)}><X className="w-6 h-6" /></Button>
        </div>

        {/* Method Logo */}
        <div className="flex flex-col items-center justify-center py-5">
          <div className="relative h-12 w-32"><img src={config.logo} alt={config.name} className="h-full w-full object-contain" /></div>
          <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] mt-1 uppercase">Official Payment Partner</span>
        </div>

        {/* Merchant Card */}
        <div className="px-5 mb-5">
          <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-gray-50 flex items-center justify-center overflow-hidden bg-gray-50 relative shrink-0">
                {store?.logoUrl ? <Image src={store.logoUrl} fill alt="store" className="object-cover" /> : <User className="w-5 h-5 text-gray-300" />}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-gray-700 text-[11px]">{store?.name || "Merchant Store"}</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Invoice: <span className="text-gray-500">{sessionId?.toString().slice(0, 12).toUpperCase()}</span></p>
              </div>
            </div>
            <div className="text-right"><span className="text-sm font-black text-gray-800">৳{Number(session?.amount).toFixed(2)}</span></div>
          </div>
        </div>

        {/* Instructions Container */}
        <div className="mx-5 mb-6 rounded-xl overflow-hidden shadow-md border border-black/5 flex flex-col bg-[#10853D]">
          <div className="bg-white/10 py-3 text-center border-b border-white/10">
            <h2 className="text-white text-[13px] font-black uppercase tracking-wider">ট্রানজেকশন আইডি দিন</h2>
          </div>
          
          <div className="p-5 flex flex-col gap-4">
            <Input 
              value={trxId} 
              onChange={(e) => setTrxId(e.target.value)} 
              placeholder="ট্রানজেকশন আইডি দিন" 
              className="bg-white border-transparent text-gray-900 h-11 rounded-lg text-center text-sm font-bold focus-visible:ring-0 shadow-inner" 
            />

            <ul className="space-y-4 text-[11px] text-white font-medium leading-snug list-none p-0">
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>{config.dial} ডায়াল করে আপনার <span className="font-black">{config.name}</span> মোবাইল মেনুতে যান অথবা <span className="font-black">{config.name}</span> অ্যাপে যান।</span>
              </li>
              <div className="h-[1px] bg-white/20 w-full"></div>
              
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>"<span className="text-yellow-300 font-black"> Send Money </span>" -এ ক্লিক করুন।</span>
              </li>
              <div className="h-[1px] bg-white/20 w-full"></div>

              <li className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ <span className="text-yellow-300 font-black text-xs">{config.number}</span></span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={copyNumber}
                  className="w-20 h-7 bg-black/30 hover:bg-black/40 text-white text-[9px] font-black uppercase border-0 rounded-md gap-1.5 ml-4"
                >
                  <Check className="w-3 h-3" /> Copy
                </Button>
              </li>
              <div className="h-[1px] bg-white/20 w-full"></div>

              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>টাকার পরিমাণঃ <span className="text-yellow-300 font-black text-xs">৳{Number(session?.amount).toFixed(2)}</span></span>
              </li>
              <div className="h-[1px] bg-white/20 w-full"></div>

              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>নিশ্চিত করতে এখন আপনার <span className="font-black">{config.name}</span> মোবাইল মেনু পিন লিখুন।</span>
              </li>
              <div className="h-[1px] bg-white/20 w-full"></div>

              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>সবকিছু ঠিক থাকলে, আপনি <span className="font-black">{config.name}</span> থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</span>
              </li>
              <div className="h-[1px] bg-white/20 w-full"></div>

              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>এখন উপরের বক্সে আপনার <span className="text-yellow-300 font-black">Transaction ID</span> দিন এবং নিচের <span className="text-yellow-300 font-black">VERIFY</span> বাটনে ক্লিক করুন।</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Verify Button */}
        <div className="fixed sm:static bottom-0 left-0 right-0 z-50 bg-white sm:bg-transparent px-0 sm:px-5 pb-0 sm:pb-5">
          <Button disabled={isVerifying} onClick={handleVerify} className="w-full h-12 sm:h-11 rounded-t-xl sm:rounded-b-xl rounded-b-none text-white font-black text-sm tracking-[0.2em] bg-[#10853D] hover:bg-[#0d6e32] shadow-md border-0">{isVerifying ? "VERIFYING..." : "VERIFY"}</Button>
        </div>
      </div>

      <div className="hidden sm:block mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">Secured by AntiPay Gateway</div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
        <AlertDialogContent className="max-w-[320px] rounded-2xl border-0 p-6">
          <AlertDialogHeader className="items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <AlertCircle className="w-7 h-7" />
            </div>
            <AlertDialogTitle className="text-lg font-black text-gray-800">নিশ্চিত তো?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 font-bold text-xs">
              আপনি কি পেমেন্টটি বাতিল করতে চান?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 mt-4">
            <AlertDialogCancel className="flex-1 mt-0 h-10 border-gray-100 text-gray-400 font-bold text-xs rounded-xl uppercase tracking-wider">না</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl uppercase tracking-wider">হ্যাঁ, বাতিল</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
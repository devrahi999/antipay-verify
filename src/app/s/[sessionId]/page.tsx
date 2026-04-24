"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Info, HelpCircle, X, Home, PhoneCall, MessageCircle, Mail, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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

const DEFAULT_LOGOS: Record<string, string> = {
  bkash: "https://i.imgur.com/GeOlI04.png",
  nagad: "https://i.imgur.com/RZBbEjb.png",
  rocket: "https://i.imgur.com/wolCFJc.png",
  upay: "https://i.imgur.com/iqgxYRk.png",
};

export default function MethodSelect() {
  const { sessionId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [view, setView] = useState<"methods" | "details" | "support">("methods");
  const [session, setSession] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!sessionId) return;
      try {
        // Parse userId from encoded sessionId (format: userId_random)
        const sid = sessionId as string;
        const userId = sid.substring(0, sid.lastIndexOf('_'));
        
        if (!userId) {
            setNotFound(true);
            return;
        }

        // Path: payment_sessions/{userId}/sessions/{sessionId}
        const docRef = doc(db, "payment_sessions", userId, "sessions", sid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const sessionData = docSnap.data();
          if (sessionData.isUsed === true) {
            setNotFound(true);
            return;
          }
          setSession(sessionData);

          const storesRef = collection(db, "stores");
          const q = query(storesRef, where("apiKey", "==", sessionData.apiKey));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            setStore(querySnapshot.docs[0].data());
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sessionId, db]);

  const handleSelect = (methodId: string) => {
    router.push(`/s/${sessionId}/${methodId}`);
  };

  const handleCancel = async () => {
    if (!sessionId || isCancelling || !session?.userId) return;
    setIsCancelling(true);
    try {
      const res = await fetch('/api/v1/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId: session.userId })
      });
      if (res.ok) {
        router.push(`/s/${sessionId}/cancel`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCancelling(false);
    }
  };

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

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#F7F8F9]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></main>;
  if (notFound) return <main className="flex min-h-screen items-center justify-center bg-[#F7F8F9]"><h1 className="text-xl font-medium text-muted-foreground">404 not found</h1></main>;

  const activeMethods = (store?.methods || []).map((m: any) => {
    const id = Object.keys(m)[0];
    const info = m[id];
    return { id, ...info, name: info.name || id.charAt(0).toUpperCase() + id.slice(1) };
  }).filter((m: any) => m.isActive);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center pb-0 relative overflow-x-hidden" style={bgPattern}>
      <div className="w-full sm:max-w-[420px] bg-transparent sm:bg-white sm:rounded-xl sm:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-0 sm:border border-gray-100/50 flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden min-h-screen sm:min-h-0">
        <div className="mx-5 sm:mx-0 mt-4 sm:mt-0 h-10 bg-white rounded-xl sm:rounded-none shadow-sm sm:shadow-none flex items-center justify-between px-4 border border-gray-100 sm:border-b sm:border-gray-100">
          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-gray-50 text-gray-700" onClick={handleHome}><Home className="w-6 h-6" /></Button>
          <Button variant="ghost" size="icon" disabled={isCancelling} className="w-8 h-8 hover:bg-gray-50 text-gray-700" onClick={() => setShowCancelAlert(true)}><X className="w-7 h-7" /></Button>
        </div>
        <div className="flex flex-col items-center py-6 px-6">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white shadow-sm mb-3 bg-gray-50 flex items-center justify-center">
            {store?.logoUrl ? <Image src={store.logoUrl} alt="Store Logo" fill className="object-cover" /> : <User className="w-8 h-8 text-gray-300" />}
          </div>
          <h2 className="text-xs font-black text-gray-700 mb-4 text-center uppercase tracking-wide">{store?.name || "Merchant Store"}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className={`h-8 rounded-md border-gray-100 text-[10px] font-bold uppercase gap-1.5 shadow-none px-3 transition-colors ${view === 'support' ? 'bg-[#10853D] text-white border-[#10853D]' : 'bg-white text-gray-500'}`} onClick={() => setView('support')}><HelpCircle className="w-3.5 h-3.5" /> সাপোর্ট</Button>
            <Button variant="outline" size="sm" className={`h-8 rounded-md border-gray-100 text-[10px] font-bold uppercase gap-1.5 shadow-none px-3 transition-colors ${view === 'details' ? 'bg-[#10853D] text-white border-[#10853D]' : 'bg-white text-gray-500'}`} onClick={() => setView('details')}><Info className="w-3.5 h-3.5" /> বিস্তারিত</Button>
          </div>
        </div>
        <div className="px-4 mb-4">
          <button onClick={() => setView('methods')} className={`w-full font-bold h-10 flex items-center justify-center rounded-md shadow-sm tracking-widest text-[10px] uppercase transition-colors ${view === 'methods' ? 'bg-[#10853D] text-white' : 'bg-gray-100 text-gray-500'}`}>মোবাইল ব্যাংকিং</button>
        </div>
        <div className="px-4 mb-24 sm:mb-6 flex-grow">
          {view === 'methods' && (
            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeMethods.length > 0 ? activeMethods.map((method: any) => (
                <button key={method.id} onClick={() => handleSelect(method.id)} className="group flex items-center justify-center p-3 h-16 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-green-400 transition-all active:scale-95">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img src={method.logoUrl || DEFAULT_LOGOS[method.id.toLowerCase()] || "https://placehold.co/100x40?text=" + method.name} alt={method.name} className="max-h-8 max-w-full object-contain" />
                  </div>
                </button>
              )) : <div className="col-span-2 py-8 text-center bg-white rounded-xl border border-dashed border-gray-200"><p className="text-[10px] font-bold text-gray-400 uppercase">কোন পেমেন্ট মেথড পাওয়া যায়নি</p></div>}
            </div>
          )}
          {view === 'details' && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-[#10853D]/5 py-3 text-center border-b border-[#10853D]/5"><h3 className="text-[#10853D] font-bold text-xs uppercase tracking-widest"> বিস্তারিত</h3></div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center text-[10px]"><span className="text-gray-400 font-bold uppercase">ইনভয়েসঃ</span><span className="text-gray-600 font-bold break-all ml-4 text-right">{session?.sessionId}</span></div>
                <div className="flex justify-between items-start text-[10px]"><span className="text-gray-400 font-bold uppercase">ডোমেইনঃ</span><span className="text-gray-600 font-bold text-right max-w-[150px]">{store?.websiteUrl || "merchant-site.com"}</span></div>
                <div className="flex justify-between items-center text-[10px]"><span className="text-gray-400 font-bold uppercase">পরিমাণঃ</span><span className="text-gray-600 font-bold">৳{Number(session?.amount).toFixed(2)}</span></div>
              </div>
            </div>
          )}
          {view === 'support' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {store?.supportPhone && <a href={`tel:${store.supportPhone}`} className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-400 transition-all"><div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-[#10853D]"><PhoneCall className="w-5 h-5" /></div><p className="text-[10px] font-bold text-gray-600">কল করুন</p></a>}
              {store?.whatsappNumber && <a href={`https://wa.me/${store.whatsappNumber.replace(/\+/g, '')}`} target="_blank" className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-400 transition-all"><div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-[#10853D]"><MessageCircle className="w-5 h-5" /></div><p className="text-[10px] font-bold text-gray-600">হোয়াটসঅ্যাপ</p></a>}
              {store?.supportEmail && <a href={`mailto:${store.supportEmail}`} className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-400 transition-all"><div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-[#10853D]"><Mail className="w-5 h-5" /></div><p className="text-[10px] font-bold text-gray-600">ইমেইল করুন</p></a>}
            </div>
          )}
        </div>
        <div className="fixed sm:static bottom-0 left-0 right-0 flex justify-center z-50">
          <div className="w-full sm:max-w-none h-14 sm:h-12 bg-[#F0FDF4] flex items-center justify-center border-t border-green-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sm:shadow-none rounded-t-xl sm:rounded-none">
            <span className="text-[#10853D] font-black text-[11px] uppercase tracking-[0.2em]">Pay ৳{Number(session?.amount).toFixed(2)}</span>
          </div>
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

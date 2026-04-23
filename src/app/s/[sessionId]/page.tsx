
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Info, HelpCircle, X, Home, PhoneCall, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

const PAYMENT_METHODS = [
  { id: "bkash", name: "bKash", logo: "https://i.imgur.com/GeOlI04.png" },
  { id: "nagad", name: "Nagad", logo: "https://i.imgur.com/RZBbEjb.png" },
  { id: "rocket", name: "Rocket", logo: "https://i.imgur.com/wolCFJc.png" },
  { id: "upay", name: "Upay", logo: "https://i.imgur.com/iqgxYRk.png" },
];

export default function MethodSelect() {
  const { sessionId } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const [view, setView] = useState<"methods" | "details" | "support">("methods");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) return;
      const docRef = doc(db, "payment_sessions", sessionId as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSession(docSnap.data());
      }
    }
    fetchSession();
  }, [sessionId, db]);

  const handleSelect = (method: string) => {
    router.push(`/s/${sessionId}/${method}`);
  };

  const bgPattern = {
    backgroundColor: '#eef2f6',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='16' height='16' rx='4' ry='4' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1.2'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
  };

  if (!session) return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start sm:justify-center pb-0 relative overflow-x-hidden"
      style={bgPattern}
    >
      <div className="w-full sm:max-w-[420px] bg-transparent sm:bg-white sm:rounded-xl sm:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-0 sm:border border-gray-100/50 flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden min-h-screen sm:min-h-0">
        
        <div className="mx-5 sm:mx-0 mt-4 sm:mt-0 h-10 bg-white rounded-xl sm:rounded-none shadow-sm sm:shadow-none flex items-center justify-between px-4 border border-gray-100 sm:border-b sm:border-gray-100">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 hover:bg-gray-50 text-gray-700"
            onClick={() => router.push('/')}
          >
            <Home className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-1.5">
             <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 hover:bg-gray-50 text-gray-700"
              onClick={() => router.push('/s/cancel')}
            >
              <X className="w-7 h-7" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center py-6 px-6">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white shadow-sm mb-3 bg-white">
            <Image 
              src="https://picsum.photos/seed/store/200" 
              alt="Store Logo" 
              fill 
              className="object-cover"
              data-ai-hint="store logo"
            />
          </div>
          <h2 className="text-xs font-black text-gray-700 mb-4 text-center uppercase tracking-wide">BD Esports Arena</h2>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-8 rounded-md border-gray-100 text-[10px] font-bold uppercase gap-1.5 shadow-none px-3 transition-colors ${view === 'support' ? 'bg-[#10853D] text-white border-[#10853D]' : 'bg-white text-gray-500'}`}
              onClick={() => setView('support')}
            >
              <HelpCircle className="w-3.5 h-3.5" /> সাপোর্ট
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-8 rounded-md border-gray-100 text-[10px] font-bold uppercase gap-1.5 shadow-none px-3 transition-colors ${view === 'details' ? 'bg-[#10853D] text-white border-[#10853D]' : 'bg-white text-gray-500'}`}
              onClick={() => setView('details')}
            >
              <Info className="w-3.5 h-3.5" /> বিস্তারিত
            </Button>
          </div>
        </div>

        <div className="px-4 mb-4">
          <button 
            onClick={() => setView('methods')}
            className={`w-full font-bold h-10 flex items-center justify-center rounded-md shadow-sm tracking-widest text-[10px] uppercase transition-colors ${view === 'methods' ? 'bg-[#10853D] text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            মোবাইল ব্যাংকিং
          </button>
        </div>

        <div className="px-4 mb-24 sm:mb-6">
          {view === 'methods' && (
            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleSelect(method.id)}
                  className="group flex items-center justify-center p-3 h-16 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-green-400 transition-all active:scale-95"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={method.logo} 
                      alt={method.name}
                      className="max-h-8 max-w-full object-contain"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}

          {view === 'details' && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-[#10853D]/5 py-3 text-center border-b border-[#10853D]/5">
                <h3 className="text-[#10853D] font-bold text-xs uppercase tracking-widest"> বিস্তারিত</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400 font-bold uppercase">ইনভয়েসঃ</span>
                  <span className="text-gray-600 font-bold">{session.sessionId?.toString().slice(0, 12).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-start text-[10px]">
                  <span className="text-gray-400 font-bold uppercase">ডোমেইনঃ</span>
                  <span className="text-gray-600 font-bold text-right max-w-[150px]">bd-esports-arena.com</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400 font-bold uppercase">পরিমাণঃ</span>
                  <span className="text-gray-600 font-bold">৳{Number(session.amount).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-dashed border-gray-100 flex justify-between items-center">
                  <span className="text-gray-500 font-bold text-[10px] uppercase">মোট প্রদেয় পরিমাণঃ</span>
                  <span className="text-[#10853D] font-black text-xs">৳{Number(session.amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {view === 'support' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <button className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-400 transition-all active:scale-[0.98]">
                <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-[#10853D]">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-600">আমাদের সাপোর্টে নাম্বারে যোগাযোগ করতে এখানে ক্লিক করুন।</p>
                </div>
              </button>
              <button className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-400 transition-all active:scale-[0.98]">
                <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-[#10853D]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-600">আমাদের সাপোর্টে হোয়াটসঅ্যাপ নাম্বারে যোগাযোগ করতে এখানে ক্লিক করুন।</p>
                </div>
              </button>
              <button className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-400 transition-all active:scale-[0.98]">
                <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-[#10853D]">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-600">আমাদের সাপোর্টে ইমেইল করতে এখানে ক্লিক করুন।</p>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="fixed sm:static bottom-0 left-0 right-0 flex justify-center z-50">
          <div className="w-full sm:max-w-none h-14 sm:h-12 bg-[#F0FDF4] flex items-center justify-center border-t border-green-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sm:shadow-none rounded-t-xl sm:rounded-none">
            <span className="text-[#10853D] font-black text-[11px] uppercase tracking-[0.2em]">Pay ৳{Number(session.amount).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="hidden sm:block mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">
        Secured by AntiPay Gateway
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const METHOD_CONFIG = {
  bkash: {
    name: "bKash",
    logo: "https://i.imgur.com/GeOlI04.png",
    color: "#E2136E",
    boxBg: "bg-[#E2136E]",
    dial: "*247#",
    number: "01336166870",
  },
  nagad: {
    name: "Nagad",
    logo: "https://i.imgur.com/RZBbEjb.png",
    color: "#D12026",
    boxBg: "bg-[#D12026]",
    dial: "*167#",
    number: "01786543210",
  },
  rocket: {
    name: "Rocket",
    logo: "https://i.imgur.com/wolCFJc.png",
    color: "#8C3494",
    boxBg: "bg-[#8C3494]",
    dial: "*322#",
    number: "01912345678",
  },
  upay: {
    name: "Upay",
    logo: "https://i.imgur.com/iqgxYRk.png",
    color: "#FFD400",
    boxBg: "bg-[#FFD400]",
    dial: "*268#",
    number: "01312345678",
  },
} as const;

export default function MethodPage() {
  const { sessionId, method } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);

  const config = METHOD_CONFIG[method as keyof typeof METHOD_CONFIG];

  if (!config) return <div className="p-8 text-center">Invalid Method</div>;

  const copyNumber = () => {
    navigator.clipboard.writeText(config.number);
    setCopied(true);
    toast({ title: "Copied!", description: "Number copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-0 relative overflow-x-hidden pb-24">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")',
          backgroundColor: '#F8FAFC'
        }} 
      />

      <div className="w-full max-w-[420px] flex flex-col gap-4 z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 px-3">
        
        {/* Top Bar - No circles, reduced radius/shadow */}
        <div className="mt-4 h-[60px] bg-[#f2f2f2] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-between px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-black/5 text-gray-400"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-black/5 text-gray-400"
            onClick={() => router.push(`/s/${sessionId}`)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center py-1">
          <div className="relative h-12 w-28">
             <img src={config.logo} alt={config.name} className="h-full w-full object-contain" />
          </div>
          <span className="text-[9px] font-black text-pink-600 tracking-[0.2em] mt-1">PERSONAL</span>
        </div>

        {/* Store Card - Reduced shadow/radius */}
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg border border-gray-50 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
            <Image src="https://picsum.photos/seed/store/120" width={48} height={48} alt="store" className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-700 text-sm">BD Esports Arena</h3>
            <p className="text-[10px] text-gray-400 font-medium">ইনভয়েস আইডিঃ <span className="font-bold text-gray-500 uppercase">ssicbt940147</span></p>
          </div>
        </div>

        {/* Amount Bar - Reduced shadow/radius */}
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] px-5 py-3.5 flex items-center">
          <span className="text-lg font-extrabold text-[#5F6E8C]">৳145.00</span>
        </div>

        {/* Instruction & Input Box - Smaller radius and reduced padding */}
        <div className={`w-full rounded-xl p-5 ${config.boxBg} text-white shadow-lg mb-4`}>
          <h2 className="text-sm font-bold mb-4 text-center">ট্রানজেকশন আইডি দিন</h2>
          
          <div className="relative mb-6">
            <Input 
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="ট্রানজেকশন আইডি দিন"
              className="bg-white border-none text-gray-700 placeholder:text-gray-300 h-10 rounded-lg text-center text-xs font-bold focus-visible:ring-0"
            />
          </div>

          <div className="space-y-3 text-[11px] font-medium leading-relaxed">
            <div className="flex items-start gap-2.5 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>
                {config.dial} ডায়াল করে অথবা {config.name.toUpperCase()} অ্যাপে যান।
              </p>
            </div>
            
            <div className="flex items-start gap-2.5 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>"<span className="text-yellow-400 font-bold">Send Money</span>" -এ ক্লিক করুন।</p>
            </div>

            <div className="flex items-start gap-2.5 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5">
                <p>প্রাপক নম্বরটি লিখুনঃ <span className="text-yellow-400 font-bold text-sm tracking-wide">{config.number}</span></p>
                <button 
                  onClick={copyNumber} 
                  className="flex items-center w-fit gap-1 bg-black/10 hover:bg-black/20 px-2 py-0.5 rounded transition-colors border border-white/5"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[9px] font-bold uppercase">Copy</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>টাকার পরিমাণঃ <span className="text-yellow-400 font-bold">৳145.00</span></p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>সবশেষে Transaction ID দিয়ে <span className="text-yellow-400 font-bold">VERIFY</span> করুন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Button - Reduced radius */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-[420px] pointer-events-auto">
          <Button 
            className={`w-full h-[60px] rounded-t-xl rounded-b-none text-white font-bold text-sm tracking-widest transition-all active:scale-[0.99] ${config.boxBg} hover:brightness-105 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]`}
          >
            VERIFY
          </Button>
        </div>
      </div>
    </div>
  );
}

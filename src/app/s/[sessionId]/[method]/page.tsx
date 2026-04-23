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

  if (!config) return <div className="p-8 text-center font-bold">Invalid Method</div>;

  const copyNumber = () => {
    navigator.clipboard.writeText(config.number);
    setCopied(true);
    toast({ title: "Copied!", description: "Number copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center p-0 relative overflow-x-hidden pb-24"
      style={{ 
        backgroundColor: '#eef2f6',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='4' y='4' width='32' height='32' rx='8' ry='8' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1.2'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="w-full max-w-[420px] flex flex-col gap-4 z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 px-3">
        
        {/* Top Bar - Modern White Bar */}
        <div className="mt-4 h-[60px] bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-between px-4 border border-gray-100/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-gray-50 text-gray-500"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-gray-50 text-gray-500"
            onClick={() => router.push(`/s/${sessionId}`)}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center py-1">
          <div className="relative h-12 w-28">
             <img src={config.logo} alt={config.name} className="h-full w-full object-contain" />
          </div>
          <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] mt-1 uppercase">Official Payment Partner</span>
        </div>

        {/* Store Card */}
        <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm p-3.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg border border-gray-50 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
            <Image src="https://picsum.photos/seed/store/120" width={40} height={40} alt="store" className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-700 text-[11px]">BD Esports Arena</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Invoice: <span className="text-gray-500">SSICBT940147</span></p>
          </div>
        </div>

        {/* Amount Bar */}
        <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Amount to pay</span>
          <span className="text-sm font-black text-gray-800">৳145.00</span>
        </div>

        {/* Instruction & Input Box */}
        <div className={`w-full rounded-xl p-5 ${config.boxBg} text-white shadow-lg mb-4`}>
          <h2 className="text-[12px] font-black mb-4 text-center uppercase tracking-wider">ট্রানজেকশন আইডি দিন</h2>
          
          <div className="relative mb-5">
            <Input 
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="ট্রানজেকশন আইডি দিন"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-10 rounded-lg text-center text-xs font-bold focus-visible:ring-0 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-4 text-[10px] leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />
              <p className="font-bold">
                {config.dial} ডায়াল করে আপনার {config.name.toUpperCase()} মোবাইল মেনুতে যান অথবা {config.name.toUpperCase()} অ্যাপে যান।
              </p>
            </div>
            
            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />
              <p className="font-bold">"<span className="text-yellow-300">Send Money</span>" -এ ক্লিক করুন।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <p className="font-bold">প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ <span className="text-yellow-300 text-xs tracking-widest">{config.number}</span></p>
                <button 
                  onClick={copyNumber} 
                  className="flex items-center w-fit gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors border border-white/10"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[9px] font-black uppercase">Copy Number</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />
              <p className="font-bold">টাকার পরিমাণঃ <span className="text-yellow-300">৳145.00</span></p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />
              <p className="font-bold">নিশ্চিত করতে এখন আপনার {config.name.toUpperCase()} মোবাইল মেনু পিন লিখুন।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />
              <p className="font-bold">সবকিছু ঠিক থাকলে, আপনি {config.name.toUpperCase()} থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />
              <p className="font-bold">এখন উপরের বক্সে আপনার <span className="text-yellow-300">Transaction ID</span> দিন এবং নিচের <span className="text-yellow-300">VERIFY</span> বাটনে ক্লিক করুন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Button - Flushed */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-[420px] pointer-events-auto">
          <Button 
            className={`w-full h-[60px] rounded-none text-white font-black text-xs tracking-[0.25em] transition-all active:scale-[0.99] ${config.boxBg} hover:brightness-105 shadow-2xl`}
          >
            VERIFY TRANSACTION
          </Button>
        </div>
      </div>
    </div>
  );
}

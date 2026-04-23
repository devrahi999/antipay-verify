
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-0 sm:p-0 relative overflow-x-hidden pb-24">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")',
          backgroundColor: '#F8FAFC'
        }} 
      />

      <div className="w-full max-w-[420px] flex flex-col gap-5 px-4 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* 1. Top Bar */}
        <div className="flex items-center justify-between py-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-10 h-10 border-gray-200 bg-white shadow-sm"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-10 h-10 border-gray-200 bg-white shadow-sm"
            onClick={() => router.push(`/s/${sessionId}`)}
          >
            <X className="w-5 h-5 text-gray-400" />
          </Button>
        </div>

        {/* 2. Logo Section */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative h-14 w-32">
             <img src={config.logo} alt={config.name} className="h-full w-full object-contain" />
          </div>
          <span className="text-[10px] font-black text-pink-600 tracking-[0.2em] mt-1">PERSONAL</span>
        </div>

        {/* 3. Store Card */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0 shadow-inner">
            <Image src="https://picsum.photos/seed/store/120" width={56} height={56} alt="store" className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-700 text-base">BD Esports Arena</h3>
            <p className="text-[11px] text-gray-400 font-medium">ইনভয়েস আইডিঃ <span className="font-bold text-gray-500 uppercase">ssicbt940147</span></p>
          </div>
        </div>

        {/* 4. Amount Bar */}
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] px-5 py-4 flex items-center">
          <span className="text-xl font-extrabold text-[#5F6E8C]">৳145.00</span>
        </div>

        {/* 5. Instruction & Input Box */}
        <div className={`w-full rounded-[20px] p-6 ${config.boxBg} text-white shadow-xl`}>
          <h2 className="text-[15px] font-bold mb-5 text-center">ট্রানজেকশন আইডি দিন</h2>
          
          <div className="relative mb-8">
            <Input 
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="ট্রানজেকশন আইডি দিন"
              className="bg-white border-none text-gray-700 placeholder:text-gray-400 h-12 rounded-xl text-center text-sm font-bold focus-visible:ring-0 shadow-inner"
            />
          </div>

          <div className="space-y-4 text-[12px] font-medium leading-relaxed">
            <div className="flex items-start gap-3 pb-3 border-b border-white/20">
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>
                {config.dial} ডায়াল করে আপনার {config.name.toUpperCase()} মোবাইল মেনুতে যান অথবা {config.name.toUpperCase()} অ্যাপে যান।
              </p>
            </div>
            
            <div className="flex items-start gap-3 pb-3 border-b border-white/20">
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>"<span className="text-yellow-400 font-bold">Send Money</span>" -এ ক্লিক করুন।</p>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-white/20">
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <p>প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ <span className="text-yellow-400 font-bold text-base tracking-wide">{config.number}</span></p>
                <button 
                  onClick={copyNumber} 
                  className="flex items-center w-fit gap-1.5 bg-black/20 hover:bg-black/30 px-3 py-1 rounded-lg transition-colors border border-white/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-bold uppercase">Copy</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-white/20">
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>টাকার পরিমাণঃ <span className="text-yellow-400 font-bold">৳145.00</span></p>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-white/20">
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>নিশ্চিত করতে এখন আপনার {config.name.toUpperCase()} মোবাইল মেনু পিন লিখুন।</p>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-white/20">
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>সবকিছু ঠিক থাকলে, আপনি {config.name.toUpperCase()} থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>এখন উপরের বক্সে আপনার <span className="text-yellow-400 font-bold">Transaction ID</span> দিন এবং নিচের <span className="text-yellow-400 font-bold">VERIFY</span> বাটনে ক্লিক করুন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Fixed Bottom Verify Button */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-[420px] pointer-events-auto">
          <Button 
            className={`w-full h-[64px] rounded-t-[24px] rounded-b-none text-white font-bold text-base tracking-widest transition-all active:scale-[0.98] ${config.boxBg} hover:brightness-110 shadow-[0_-8px_20px_-4px_rgba(0,0,0,0.1)]`}
          >
            VERIFY
          </Button>
        </div>
      </div>
    </div>
  );
}

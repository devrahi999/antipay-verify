
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
    <div 
      className="min-h-screen flex flex-col items-center p-0 relative overflow-x-hidden pb-24"
      style={{ 
        backgroundColor: '#f8fafc',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.57 13.43-30 30-30 0 16.57-13.43 30-30 30zm0 0c0 16.57-13.43 30-30 30 0-16.57-13.43-30 30-30zm0 0c0-16.57-13.43-30-30-30 0 16.57-13.43 30 30 30zm0 0c0 16.57 13.43 30 30 30 0-16.57-13.43-30 30-30z' fill='%23000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="w-full max-w-[420px] flex flex-col gap-3.5 z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 px-3">
        
        {/* Top Bar - Modern Soft Bar */}
        <div className="mt-4 h-[60px] bg-white rounded-lg shadow-sm flex items-center justify-between px-3 border border-gray-100/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-9 h-9 hover:bg-gray-50 text-gray-500"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-9 h-9 hover:bg-gray-50 text-gray-500"
            onClick={() => router.push(`/s/${sessionId}`)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center py-0.5">
          <div className="relative h-10 w-24">
             <img src={config.logo} alt={config.name} className="h-full w-full object-contain" />
          </div>
          <span className="text-[8px] font-black text-pink-600 tracking-[0.2em] mt-0.5 uppercase">Personal</span>
        </div>

        {/* Store Card */}
        <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md border border-gray-50 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
            <Image src="https://picsum.photos/seed/store/120" width={40} height={40} alt="store" className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-700 text-xs">BD Esports Arena</h3>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">ইনভয়েস আইডিঃ <span className="text-gray-500">SSICBT940147</span></p>
          </div>
        </div>

        {/* Amount Bar */}
        <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm px-4 py-3 flex items-center">
          <span className="text-base font-black text-[#5F6E8C]">৳145.00</span>
        </div>

        {/* Instruction & Input Box - Smaller & Rounded */}
        <div className={`w-full rounded-xl p-5 ${config.boxBg} text-white shadow-md mb-4`}>
          <h2 className="text-[11px] font-black mb-3.5 text-center uppercase tracking-wide">ট্রানজেকশন আইডি দিন</h2>
          
          <div className="relative mb-5">
            <Input 
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="ট্রানজেকশন আইডি দিন"
              className="bg-white border-none text-gray-700 placeholder:text-gray-300 h-9 rounded-md text-center text-[10px] font-black focus-visible:ring-0"
            />
          </div>

          <div className="space-y-3 text-[10px] font-black leading-relaxed">
            <div className="flex items-start gap-2 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>
                {config.dial} ডায়াল করে আপনার {config.name.toUpperCase()} মোবাইল মেনুতে যান অথবা {config.name.toUpperCase()} অ্যাপে যান।
              </p>
            </div>
            
            <div className="flex items-start gap-2 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>"<span className="text-yellow-400 font-black">Send Money</span>" -এ ক্লিক করুন।</p>
            </div>

            <div className="flex items-start gap-2 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5">
                <p>প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ <span className="text-yellow-400 text-xs tracking-widest font-black">{config.number}</span></p>
                <button 
                  onClick={copyNumber} 
                  className="flex items-center w-fit gap-1 bg-black/10 hover:bg-black/20 px-1.5 py-0.5 rounded transition-colors border border-white/5"
                >
                  {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                  <span className="text-[8px] font-black uppercase">Copy</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>টাকার পরিমাণঃ <span className="text-yellow-400 font-black">৳145.00</span></p>
            </div>

            <div className="flex items-start gap-2 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>নিশ্চিত করতে এখন আপনার {config.name.toUpperCase()} মোবাইল মেনু পিন লিখুন।</p>
            </div>

            <div className="flex items-start gap-2 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>সবকিছু ঠিক থাকলে, আপনি {config.name.toUpperCase()} থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</p>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
              <p>এখন উপরের বক্সে আপনার <span className="text-yellow-400 font-black">Transaction ID</span> দিন এবং নিচের <span className="text-yellow-400 font-black">VERIFY</span> বাটনে ক্লিক করুন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Button - Flat to Bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-[420px] pointer-events-auto">
          <Button 
            className={`w-full h-[60px] rounded-none text-white font-black text-xs tracking-[0.2em] transition-all active:scale-[0.99] ${config.boxBg} hover:brightness-105 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]`}
          >
            VERIFY
          </Button>
        </div>
      </div>
    </div>
  );
}

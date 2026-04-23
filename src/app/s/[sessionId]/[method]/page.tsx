
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
    <div className="min-h-screen bg-white flex flex-col items-center p-0 relative overflow-x-hidden pb-24">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")',
        }} 
      />

      <div className="w-full max-w-[420px] flex flex-col gap-4 z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 px-3">
        
        {/* Top Bar - White Background & Reduced Radius */}
        <div className="mt-4 h-[60px] bg-white rounded-lg shadow-sm flex items-center justify-between px-4 border border-gray-100">
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
        <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-md border border-gray-50 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
            <Image src="https://picsum.photos/seed/store/120" width={48} height={48} alt="store" className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-700 text-sm">BD Esports Arena</h3>
            <p className="text-[10px] text-gray-400 font-bold">ইনভয়েস আইডিঃ <span className="text-gray-500 uppercase">SSICBT940147</span></p>
          </div>
        </div>

        {/* Amount Bar - Reduced shadow/radius */}
        <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm px-5 py-3.5 flex items-center">
          <span className="text-lg font-bold text-[#5F6E8C]">৳145.00</span>
        </div>

        {/* Instruction & Input Box - Rounded-lg and Bold Text */}
        <div className={`w-full rounded-lg p-5 ${config.boxBg} text-white shadow-md mb-4`}>
          <h2 className="text-sm font-bold mb-4 text-center">ট্রানজেকশন আইডি দিন</h2>
          
          <div className="relative mb-6">
            <Input 
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="ট্রানজেকশন আইডি দিন"
              className="bg-white border-none text-gray-700 placeholder:text-gray-300 h-10 rounded-md text-center text-xs font-bold focus-visible:ring-0"
            />
          </div>

          <div className="space-y-4 text-[11px] font-bold leading-relaxed">
            <div className="flex items-start gap-2.5 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>
                {config.dial} ডায়াল করে আপনার {config.name.toUpperCase()} মোবাইল মেনুতে যান অথবা {config.name.toUpperCase()} অ্যাপে যান।
              </p>
            </div>
            
            <div className="flex items-start gap-2.5 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>"<span className="text-yellow-400">Send Money</span>" -এ ক্লিক করুন।</p>
            </div>

            <div className="flex items-start gap-2.5 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5">
                <p>প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ <span className="text-yellow-400 text-sm tracking-wide">{config.number}</span></p>
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
              <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>টাকার পরিমাণঃ <span className="text-yellow-400">৳145.00</span></p>
            </div>

            <div className="flex items-start gap-2.5 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>নিশ্চিত করতে এখন আপনার {config.name.toUpperCase()} মোবাইল মেনু পিন লিখুন।</p>
            </div>

            <div className="flex items-start gap-2.5 pb-2.5 border-b border-white/10">
              <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>সবকিছু ঠিক থাকলে, আপনি {config.name.toUpperCase()} থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
              <p>এখন উপরের বক্সে আপনার <span className="text-yellow-400">Transaction ID</span> দিন এবং নিচের <span className="text-yellow-400">VERIFY</span> বাটনে ক্লিক করুন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verify Button - Large Rounded Bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-[420px] pointer-events-auto">
          <Button 
            className={`w-full h-[60px] rounded-t-2xl rounded-b-none text-white font-bold text-sm tracking-widest transition-all active:scale-[0.99] ${config.boxBg} hover:brightness-105 shadow-md`}
          >
            VERIFY
          </Button>
        </div>
      </div>
    </div>
  );
}


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
    number: "01786543210",
  },
  nagad: {
    name: "Nagad",
    logo: "https://i.imgur.com/RZBbEjb.png",
    color: "#D12026",
    boxBg: "bg-[#D12026]",
    dial: "*167#",
    number: "01336166870",
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
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.05]" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")',
          backgroundColor: '#F0F4F8'
        }} 
      />

      <div className="w-full max-w-[440px] bg-white rounded-[20px] shadow-2xl flex flex-col relative overflow-hidden z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-8 h-8 border-gray-200 text-gray-400"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 text-gray-400">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 px-6 pb-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center pb-6">
            <div className="relative h-12 w-28">
               <img src={config.logo} alt={config.name} className="h-full w-full object-contain" />
            </div>
            <span className="text-[9px] font-bold text-pink-600 tracking-widest mt-0.5">PERSONAL</span>
          </div>

          {/* Store & Amount Row */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
               <div className="w-10 h-10 rounded-full border border-gray-50 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                 <Image src="https://picsum.photos/seed/store/80" width={40} height={40} alt="store" className="object-cover" />
               </div>
               <div className="flex flex-col min-w-0">
                 <h3 className="font-bold text-gray-600 text-[13px] truncate">BD Esports Arena</h3>
                 <p className="text-[10px] text-gray-400 truncate">ইনভয়েস আইডিঃ <span className="font-bold text-gray-500">3DH7TG934476</span></p>
               </div>
            </div>
            <div className="px-5 py-3 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-gray-600">৳145.00</span>
            </div>
          </div>

          {/* Instruction Box (Rounded All Corners, Smaller Size) */}
          <div className={`rounded-[20px] p-6 ${config.boxBg} text-white shadow-lg mb-6`}>
            <h2 className="text-[14px] font-bold mb-4 text-center">ট্রানজেকশন আইডি দিন</h2>
            
            <div className="relative mb-6">
              <Input 
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="ট্রানজেকশন আইডি দিন"
                className="bg-white border-none text-gray-800 placeholder:text-gray-300 h-11 rounded-lg text-center text-sm focus-visible:ring-2 focus-visible:ring-white/20"
              />
            </div>

            <div className="space-y-3 text-[11px] font-medium leading-relaxed">
              <div className="flex items-start gap-2 pb-2 border-b border-white/10">
                <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
                <p>
                  {config.dial} ডায়াল করে আপনার {config.name.toUpperCase()} মোবাইল মেনুতে যান অথবা {config.name.toUpperCase()} অ্যাপে যান।
                </p>
              </div>
              
              <div className="flex items-start gap-2 pb-2 border-b border-white/10">
                <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
                <p>"<span className="text-yellow-400 font-bold">Send Money</span>" - এ ক্লিক করুন।</p>
              </div>

              <div className="flex items-start gap-2 pb-2 border-b border-white/10">
                <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <p>প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ</p>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 font-bold text-base">{config.number}</span>
                    <button 
                      onClick={copyNumber} 
                      className="flex items-center gap-1 bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded transition-colors border border-white/10"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[9px] font-bold">Copy</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pb-2 border-b border-white/10">
                <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
                <p>টাকার পরিমাণঃ <span className="text-yellow-400 font-bold">৳145.00</span></p>
              </div>

              <div className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
                <p>নিশ্চিত করতে এখন আপনার {config.name.toUpperCase()} মোবাইল মেনু পিন লিখুন।</p>
              </div>
            </div>
          </div>

          {/* Verify Button (Inside Card, Sticky to bottom of content) */}
          <Button 
            className={`w-full h-12 rounded-xl text-white font-bold text-sm transition-all active:scale-[0.98] ${config.boxBg} hover:brightness-110 shadow-md`}
          >
            VERIFY
          </Button>
        </div>
      </div>
    </div>
  );
}

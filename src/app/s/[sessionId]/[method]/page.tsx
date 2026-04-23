
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
    dial: "*247#",
    number: "01336166870",
  },
  nagad: {
    name: "Nagad",
    logo: "https://i.imgur.com/RZBbEjb.png",
    color: "#D12026",
    dial: "*167#",
    number: "01786543210",
  },
  rocket: {
    name: "Rocket",
    logo: "https://i.imgur.com/wolCFJc.png",
    color: "#8C3494",
    dial: "*322#",
    number: "01912345678",
  },
  upay: {
    name: "Upay",
    logo: "https://i.imgur.com/iqgxYRk.png",
    color: "#FFD400",
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
      className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 relative overflow-x-hidden"
      style={{ 
        backgroundColor: '#eef2f6',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='16' height='16' rx='4' ry='4' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1.2'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="w-full h-full sm:h-auto sm:max-w-[420px] bg-transparent sm:bg-white sm:rounded-xl sm:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-0 sm:border border-gray-100/50 flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden min-h-screen sm:min-h-0 pb-24 sm:pb-0">
        
        {/* Top Nav Bar - Fixed/Sticky on mobile with clear background */}
        <div className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b border-gray-200 bg-white shadow-sm sm:shadow-none">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 hover:bg-gray-50 text-gray-700"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 hover:bg-gray-50 text-gray-700"
            onClick={() => router.push(`/s/${sessionId}`)}
          >
            <X className="w-8 h-8" />
          </Button>
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative h-12 w-32">
             <img src={config.logo} alt={config.name} className="h-full w-full object-contain" />
          </div>
          <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] mt-1 uppercase">Official Payment Partner</span>
        </div>

        {/* Store & Amount Info Row */}
        <div className="px-5 mb-6">
          <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-gray-50 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                <Image src="https://picsum.photos/seed/store/120" width={40} height={40} alt="store" className="object-cover" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-gray-700 text-[11px]">BD Esports Arena</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Invoice: <span className="text-gray-500">SSICBT940147</span></p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-gray-800">৳145.00</span>
            </div>
          </div>
        </div>

        {/* Instruction & Input Box - Specific Green #A7E693 */}
        <div className="mx-5 mb-6 rounded-lg p-5 bg-[#A7E693] text-gray-800 shadow-sm border border-black/5">
          <h2 className="text-[12px] font-black mb-4 text-center uppercase tracking-wider">ট্রানজেকশন আইডি দিন</h2>
          
          <div className="relative mb-5">
            <Input 
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="ট্রানজেকশন আইডি দিন"
              className="bg-white border-transparent text-gray-900 placeholder:text-gray-400 h-10 rounded-lg text-center text-xs font-bold focus-visible:ring-0 shadow-sm"
            />
          </div>

          <div className="space-y-4 text-[10px] leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-black/20 rounded-full shrink-0" />
              <p className="font-bold">
                {config.dial} ডায়াল করে আপনার {config.name.toUpperCase()} মোবাইল মেনুতে যান অথবা {config.name.toUpperCase()} অ্যাপে যান।
              </p>
            </div>
            
            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-black/20 rounded-full shrink-0" />
              <p className="font-bold">"<span className="text-black underline underline-offset-2">Send Money</span>" -এ ক্লিক করুন।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-black/20 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <p className="font-bold">প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ <span className="text-black text-xs tracking-widest bg-white/50 px-1.5 py-0.5 rounded">{config.number}</span></p>
                <button 
                  onClick={copyNumber} 
                  className="flex items-center w-fit gap-1.5 bg-black/5 hover:bg-black/10 px-2 py-1 rounded transition-colors border border-black/5"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[9px] font-black uppercase">Copy Number</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-black/20 rounded-full shrink-0" />
              <p className="font-bold">টাকার পরিমাণঃ <span className="text-black">৳145.00</span></p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-black/20 rounded-full shrink-0" />
              <p className="font-bold">নিশ্চিত করতে এখন আপনার {config.name.toUpperCase()} মোবাইল মেনু পিন লিখুন।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-black/20 rounded-full shrink-0" />
              <p className="font-bold">সবকিছু ঠিক থাকলে, আপনি {config.name.toUpperCase()} থেকে একটি নিশ্চিতকরণ বার্তা পাবেন।</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="mt-1 w-1.5 h-1.5 bg-black/20 rounded-full shrink-0" />
              <p className="font-bold">এখন উপরের বক্সে আপনার <span className="text-black font-black">Transaction ID</span> দিন এবং নিচের <span className="text-black font-black">VERIFY</span> বাটনে ক্লিক করুন।</p>
            </div>
          </div>
        </div>

        {/* Verify Button - Fixed at bottom on mobile, full width */}
        <div className="fixed sm:static bottom-0 left-0 right-0 z-50 bg-white sm:bg-transparent px-0 sm:px-5 pb-0 sm:pb-5">
          <Button 
            className="w-full h-14 sm:h-11 rounded-t-xl sm:rounded-b-xl rounded-b-none text-white font-black text-sm tracking-[0.25em] transition-all active:scale-[0.99] bg-[#10853D] hover:bg-[#0d6e32] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sm:shadow-md border-0"
          >
            VERIFY
          </Button>
        </div>
      </div>
      
      {/* Policy Text - Only visible on desktop or scroll */}
      <div className="hidden sm:block mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">
        Secured by AntiPay Gateway
      </div>
    </div>
  );
}

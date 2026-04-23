
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-start sm:py-8">
      {/* Subtle Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
          backgroundColor: '#F8FAFC'
        }} 
      />

      <div className="w-full max-w-[420px] bg-white sm:rounded-[24px] shadow-sm flex flex-col min-h-screen sm:min-h-fit relative overflow-hidden z-10 border border-gray-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 px-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-9 h-9 border-gray-200 text-gray-400"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 text-gray-400">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Method Logo */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative h-14 w-32">
               <img src={config.logo} alt={config.name} className="h-full w-full object-contain" />
            </div>
            <span className="text-[10px] font-bold text-orange-500 mt-[-4px]">Personal</span>
          </div>

          {/* Store & Invoice Card */}
          <div className="px-6 mb-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-50">
               <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center overflow-hidden bg-white shrink-0">
                 <Image src="https://picsum.photos/seed/store/100" width={40} height={40} alt="store" className="object-cover" />
               </div>
               <div className="flex flex-col">
                 <h3 className="font-bold text-gray-600 text-[15px]">BD Esports Arena</h3>
                 <p className="text-[11px] text-gray-400 font-medium">ইনভয়েস আইডিঃ <span className="font-bold text-gray-500 uppercase">3DH7TG934476</span></p>
               </div>
            </div>
          </div>

          {/* Amount Display */}
          <div className="px-6 mb-4">
            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-500">৳145.00</h1>
            </div>
          </div>

          {/* Instruction Box */}
          <div className="px-0 sm:px-0">
            <div className={`rounded-t-[32px] pt-8 pb-12 px-8 ${config.boxBg} text-white shadow-lg min-h-[400px]`}>
              <h2 className="text-[18px] font-bold mb-6 text-center">ট্রানজেকশন আইডি দিন</h2>
              
              <div className="relative mb-8">
                <Input 
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="ট্রানজেকশন আইডি দিন"
                  className="bg-white border-none text-gray-800 placeholder:text-gray-300 h-14 rounded-xl text-center text-lg focus-visible:ring-2 focus-visible:ring-blue-400"
                />
              </div>

              <div className="space-y-4 text-[13px] leading-relaxed">
                <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  <p>
                    {config.dial} ডায়াল করে আপনার {config.name.toUpperCase()} মোবাইল মেনুতে যান অথবা {config.name.toUpperCase()} অ্যাপে যান।
                  </p>
                </div>
                
                <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  <p>
                    "<span className="text-yellow-400 font-bold">Send Money</span>" - এ ক্লিক করুন।
                  </p>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  <div className="flex flex-col gap-2">
                    <p>প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ</p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-bold text-lg">{config.number}</span>
                      <button 
                        onClick={copyNumber} 
                        className="flex items-center gap-1 bg-black/30 hover:bg-black/40 px-3 py-1 rounded-md transition-colors border border-white/10"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span className="text-[10px] font-bold">Copy</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  <p>টাকার পরিমাণঃ <span className="text-yellow-400 font-bold">৳145.00</span></p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  <p>নিশ্চিত করতে এখন আপনার {config.name.toUpperCase()} মোবাইল মেনু পিন লিখুন।</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verify Button */}
        <div className="absolute bottom-0 left-0 right-0">
          <Button 
            className={`w-full h-14 rounded-t-2xl rounded-b-none text-white font-bold text-base transition-all active:scale-[0.98] ${config.boxBg} hover:brightness-110 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]`}
          >
            VERIFY
          </Button>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const METHOD_CONFIG = {
  bkash: {
    name: "bKash",
    logo: "https://i.imgur.com/GeOlI04.png",
    color: "#E2136E",
    bg: "bg-[#E2136E]",
    dial: "*247#",
    number: "017XXXXXXXX",
  },
  nagad: {
    name: "Nagad",
    logo: "https://i.imgur.com/RZBbEjb.png",
    color: "#F7941D",
    bg: "bg-[#F7941D]",
    dial: "*167#",
    number: "018XXXXXXXX",
  },
  rocket: {
    name: "Rocket",
    logo: "https://i.imgur.com/wolCFJc.png",
    color: "#8C3494",
    bg: "bg-[#8C3494]",
    dial: "*322#",
    number: "019XXXXXXXX",
  },
  upay: {
    name: "Upay",
    logo: "https://i.imgur.com/iqgxYRk.png",
    color: "#FFD400",
    bg: "bg-[#FFD400]",
    dial: "*268#",
    number: "013XXXXXXXX",
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
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-start sm:py-8">
      <div className="w-full max-w-[420px] bg-white sm:rounded-[24px] shadow-sm flex flex-col min-h-screen sm:min-h-fit relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-8 h-8"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
            <X className="w-5 h-5 text-gray-900" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Method Logo */}
          <div className="flex justify-center py-6">
            <div className="relative h-12 w-32">
               <img src={config.logo} alt={config.name} className="h-full w-full object-contain" />
            </div>
          </div>

          {/* Store & Invoice Card */}
          <div className="px-4 mb-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
               <div className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden relative">
                 <Image src="https://picsum.photos/seed/store/100" fill alt="store" className="object-cover" />
               </div>
               <div>
                 <h3 className="font-bold text-gray-700 text-sm">BD Esports Arena</h3>
                 <p className="text-[10px] text-gray-400 uppercase tracking-wider">Invoice ID: #67B66D606C7</p>
               </div>
            </div>
          </div>

          {/* Amount Display */}
          <div className="text-center py-4 mb-4">
            <h1 className="text-4xl font-black text-gray-800">৳145.00</h1>
          </div>

          {/* Instruction Box */}
          <div className="px-4">
            <div className={`rounded-2xl p-6 ${config.bg} text-white shadow-lg`}>
              <h2 className="text-lg font-bold mb-4 text-center">ট্রানজেকশন আইডি দিন</h2>
              
              <Input 
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="ট্রানজেকশন আইডি দিন"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 text-center text-lg mb-6 focus-visible:ring-offset-0 focus-visible:ring-white/30"
              />

              <div className="space-y-4 text-sm font-medium">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">1</span>
                  <p>আপনার ফোন থেকে <span className="text-white font-bold underline">{config.dial}</span> ডায়াল করুন।</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">2</span>
                  <p>"Send Money" অপশনটি সিলেক্ট করুন।</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">3</span>
                  <div className="flex-1">
                    <p className="mb-1">প্রাপক নাম্বার হিসেবে নিচের নাম্বারটি দিন:</p>
                    <div className="flex items-center justify-between bg-white/20 rounded-lg px-3 py-2 border border-white/30">
                      <span className="font-mono text-base">{config.number}</span>
                      <button onClick={copyNumber} className="hover:scale-110 transition-transform">
                        {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">4</span>
                  <p>টাকার পরিমাণ <span className="bg-white text-black px-2 py-0.5 rounded font-bold">৳১৪৫.০০</span> দিন।</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">5</span>
                  <p>পিন (PIN) দিয়ে লেনদেন সম্পন্ন করুন।</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verify Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-50">
          <Button 
            className={`w-full h-14 rounded-xl text-white font-bold text-lg transition-transform active:scale-95 ${config.bg} hover:brightness-110 shadow-lg`}
          >
            VERIFY
          </Button>
        </div>
      </div>
    </div>
  );
}

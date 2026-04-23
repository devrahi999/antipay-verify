"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Info, HelpCircle, AlertCircle, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const PAYMENT_METHODS = [
  { id: "bkash", name: "bKash", logo: "https://i.imgur.com/GeOlI04.png" },
  { id: "nagad", name: "Nagad", logo: "https://i.imgur.com/RZBbEjb.png" },
  { id: "rocket", name: "Rocket", logo: "https://i.imgur.com/wolCFJc.png" },
  { id: "upay", name: "Upay", logo: "https://i.imgur.com/iqgxYRk.png" },
];

export default function MethodSelect() {
  const { sessionId } = useParams();
  const router = useRouter();

  const handleSelect = (method: string) => {
    router.push(`/s/${sessionId}/${method}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-start pb-8">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")',
          backgroundColor: '#F8FAFC'
        }} 
      />

      <div className="w-full max-w-[420px] flex flex-col z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* 1. Unified Modern Top Bar */}
        <div className="mx-3 mt-4 h-[64px] bg-[#f2f2f2] rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-between px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-10 h-10 bg-white shadow-sm border-none hover:bg-white/90"
          >
            <Home className="w-5 h-5 text-gray-400" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-10 h-10 bg-white shadow-sm border-none hover:bg-white/90"
          >
            <X className="w-5 h-5 text-gray-900 font-bold" />
          </Button>
        </div>

        {/* 2. Store Info Section */}
        <div className="flex flex-col items-center py-8 px-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
            <Image 
              src="https://picsum.photos/seed/store/200" 
              alt="Store Logo" 
              fill 
              className="object-cover"
              data-ai-hint="store logo"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">BD Esports Arena</h2>
          
          <div className="flex gap-4">
            <Button variant="outline" size="icon" className="rounded-xl border-gray-200 bg-white text-gray-400 shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl border-gray-200 bg-white text-gray-400 shadow-sm">
              <Info className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl border-gray-200 bg-white text-gray-400 shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 3. Category Tab */}
        <div className="px-4 mb-4">
          <Button className="w-full bg-[#0052CC] hover:bg-[#0041a3] text-white font-bold h-12 rounded-xl shadow-md tracking-wide">
            মোবাইল ব্যাংকিং
          </Button>
        </div>

        {/* 4. Methods Grid */}
        <div className="grid grid-cols-2 gap-3 px-4 mb-24">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className="group flex items-center justify-center p-4 h-24 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-blue-200 hover:shadow-md transition-all active:scale-95"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={method.logo} 
                  alt={method.name}
                  className="max-h-12 max-w-full object-contain grayscale-0 group-hover:scale-110 transition-transform"
                />
              </div>
            </button>
          ))}
        </div>

        {/* 5. Bottom Amount Bar (Selection) */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 px-4 pb-4">
          <div className="w-full max-w-[420px] h-[64px] bg-[#E1F0FF] rounded-2xl flex items-center justify-center shadow-lg border border-blue-100">
            <span className="text-[#0052CC] font-bold text-lg">Pay ৳145.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

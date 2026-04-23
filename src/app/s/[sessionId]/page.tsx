
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
    <div 
      className="min-h-screen flex flex-col items-center justify-start sm:justify-center pb-8 relative overflow-x-hidden"
      style={{ 
        backgroundColor: '#eef2f6',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='16' height='16' rx='4' ry='4' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1.2'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="w-full sm:max-w-[420px] bg-transparent sm:bg-white sm:rounded-xl sm:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-0 sm:border border-gray-100/50 flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
        
        {/* Top Bar - Solid with border for mobile, integrated for desktop */}
        <div className="mx-3 sm:mx-0 mt-4 sm:mt-0 h-[56px] bg-white rounded-lg sm:rounded-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:shadow-none flex items-center justify-between px-4 border border-gray-100 sm:border-b sm:border-gray-100">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-gray-50 text-gray-700"
            onClick={() => router.push('/')}
          >
            <Home className="w-6 h-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-gray-50 text-gray-700"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Store Info Section */}
        <div className="flex flex-col items-center py-6 px-6">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white shadow-sm mb-3 bg-white">
            <Image 
              src="https://picsum.photos/seed/store/200" 
              alt="Store Logo" 
              fill 
              className="object-cover"
              data-ai-hint="store logo"
            />
          </div>
          <h2 className="text-xs font-black text-gray-700 mb-3 text-center uppercase tracking-wide">BD Esports Arena</h2>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 rounded-md border-gray-100 bg-white text-gray-500 text-[10px] font-bold uppercase gap-1.5 shadow-none px-3">
              <HelpCircle className="w-3.5 h-3.5" /> সাপোর্ট
            </Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md border-gray-100 bg-white text-gray-500 text-[10px] font-bold uppercase gap-1.5 shadow-none px-3">
              <Info className="w-3.5 h-3.5" /> বিস্তারিত
            </Button>
            <Button variant="outline" size="sm" className="h-8 rounded-md border-gray-100 bg-white text-gray-500 text-[10px] font-bold uppercase gap-1.5 shadow-none px-3">
              <AlertCircle className="w-3.5 h-3.5" /> শর্তাবলী
            </Button>
          </div>
        </div>

        {/* Category Tab - Matches Image Style (Blue Bar) */}
        <div className="px-4 mb-4">
          <div className="w-full bg-[#0052CC] text-white font-bold h-10 flex items-center justify-center rounded-md shadow-sm tracking-widest text-[10px] uppercase">
            মোবাইল ব্যাংকিং
          </div>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-2 gap-3 px-4 mb-24 sm:mb-6">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className="group flex items-center justify-center p-3 h-16 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-400 transition-all active:scale-95"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={method.logo} 
                  alt={method.name}
                  className="max-h-8 max-w-full object-contain"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Amount Bar - Fixed at bottom for mobile, integrated for desktop */}
        <div className="fixed sm:static bottom-0 left-0 right-0 flex justify-center z-50">
          <div className="w-full sm:max-w-none h-16 sm:h-12 bg-[#E3F2FD] flex items-center justify-center border-t border-blue-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sm:shadow-none">
            <span className="text-[#0052CC] font-black text-xs uppercase tracking-[0.2em]">Pay ৳145.00</span>
          </div>
        </div>
      </div>
      
      {/* Policy Text for Desktop */}
      <div className="hidden sm:block mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">
        Secured by AntiPay Gateway
      </div>
    </div>
  );
}

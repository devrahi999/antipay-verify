
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pb-8">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")',
        }} 
      />

      <div className="w-full max-w-[420px] flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Top Bar - White Background & Reduced Radius */}
        <div className="mx-3 mt-4 h-[60px] bg-white rounded-lg shadow-sm flex items-center justify-between px-4 border border-gray-100">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-black/5 text-gray-400"
            onClick={() => router.push('/')}
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-black/5 text-gray-600"
          >
            <X className="w-5 h-5 font-bold" />
          </Button>
        </div>

        {/* Store Info Section */}
        <div className="flex flex-col items-center py-8 px-6">
          <div className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-white shadow-sm mb-4">
            <Image 
              src="https://picsum.photos/seed/store/200" 
              alt="Store Logo" 
              fill 
              className="object-cover"
              data-ai-hint="store logo"
            />
          </div>
          <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">BD Esports Arena</h2>
          
          <div className="flex gap-4">
            <Button variant="outline" size="icon" className="rounded-md border-gray-100 bg-white text-gray-400 shadow-none">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-md border-gray-100 bg-white text-gray-400 shadow-none">
              <Info className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-md border-gray-100 bg-white text-gray-400 shadow-none">
              <AlertCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Category Tab */}
        <div className="px-4 mb-4">
          <Button className="w-full bg-[#10853D] hover:bg-[#0d6e32] text-white font-bold h-11 rounded-md shadow-sm tracking-wide">
            মোবাইল ব্যাংকিং
          </Button>
        </div>

        {/* Methods Grid - Reduced shadow and radius */}
        <div className="grid grid-cols-2 gap-3 px-4 mb-24">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className="group flex items-center justify-center p-4 h-24 bg-white border border-gray-100 rounded-md shadow-sm hover:border-green-200 transition-all active:scale-95"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={method.logo} 
                  alt={method.name}
                  className="max-h-11 max-w-full object-contain grayscale-0 group-hover:scale-105 transition-transform"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Amount Bar - Green Theme, Flat bottom corners */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="w-full max-w-[420px] h-[60px] bg-[#E8F5E9] rounded-t-xl flex items-center justify-center shadow-lg border-t border-green-100 pointer-events-auto">
            <span className="text-[#10853D] font-bold text-base">Pay ৳145.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

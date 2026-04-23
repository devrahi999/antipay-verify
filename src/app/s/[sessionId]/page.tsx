
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pb-8 relative overflow-x-hidden">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.05]" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")',
          backgroundRepeat: 'repeat',
        }} 
      />

      <div className="w-full max-w-[420px] flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Top Bar - White & Modern */}
        <div className="mx-3 mt-4 h-[60px] bg-white rounded-lg shadow-sm flex items-center justify-between px-4 border border-gray-100">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-gray-50 text-gray-400"
            onClick={() => router.push('/')}
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 hover:bg-gray-50 text-gray-600"
          >
            <X className="w-5 h-5 font-bold" />
          </Button>
        </div>

        {/* Store Info Section */}
        <div className="flex flex-col items-center py-6 px-6">
          <div className="relative w-16 h-16 rounded-md overflow-hidden border-2 border-white shadow-sm mb-3">
            <Image 
              src="https://picsum.photos/seed/store/200" 
              alt="Store Logo" 
              fill 
              className="object-cover"
              data-ai-hint="store logo"
            />
          </div>
          <h2 className="text-base font-bold text-gray-700 mb-3 text-center">BD Esports Arena</h2>
          
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="w-9 h-9 rounded-md border-gray-100 bg-white text-gray-400 shadow-none">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-9 h-9 rounded-md border-gray-100 bg-white text-gray-400 shadow-none">
              <Info className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-9 h-9 rounded-md border-gray-100 bg-white text-gray-400 shadow-none">
              <AlertCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Tab */}
        <div className="px-4 mb-4">
          <Button className="w-full bg-[#10853D] hover:bg-[#0d6e32] text-white font-bold h-10 rounded-md shadow-sm tracking-wide text-xs">
            মোবাইল ব্যাংকিং
          </Button>
        </div>

        {/* Methods Grid - Smaller Cards */}
        <div className="grid grid-cols-2 gap-2.5 px-4 mb-24">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className="group flex items-center justify-center p-3 h-20 bg-white border border-gray-100 rounded-md shadow-sm hover:border-green-200 transition-all active:scale-95"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={method.logo} 
                  alt={method.name}
                  className="max-h-9 max-w-full object-contain transition-transform"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Amount Bar - Flat to Bottom */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="w-full max-w-[420px] h-[60px] bg-[#E8F5E9] rounded-t-xl rounded-b-none flex items-center justify-center shadow-lg border-t border-green-100 pointer-events-auto">
            <span className="text-[#10853D] font-bold text-sm">Pay ৳145.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

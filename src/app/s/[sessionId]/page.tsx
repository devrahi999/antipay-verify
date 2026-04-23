
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Info, HelpCircle, AlertCircle, X, Languages, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-start sm:py-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 grayscale opacity-[0.03]" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

      <div className="w-full max-w-[420px] bg-white sm:rounded-[24px] shadow-sm flex flex-col min-h-screen sm:min-h-fit relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                <Home className="w-4 h-4 text-gray-400" />
             </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
              <Languages className="w-4 h-4 text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
              <X className="w-4 h-4 text-gray-900 font-bold" />
            </Button>
          </div>
        </div>

        {/* Store Info */}
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
          <h2 className="text-xl font-bold text-gray-700 mb-4">BD Esports Arena</h2>
          
          <div className="flex gap-4">
            <Button variant="outline" size="icon" className="rounded-xl border-gray-100 text-gray-400">
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl border-gray-100 text-gray-400">
              <Info className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl border-gray-100 text-gray-400">
              <AlertCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Category Tab */}
        <div className="px-4 mb-4">
          <Button className="w-full bg-[#0052CC] hover:bg-[#0041a3] text-white font-medium h-12 rounded-lg">
            মোবাইল ব্যাংকিং
          </Button>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-24">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className="group flex items-center justify-center p-4 h-20 bg-white border border-blue-50 rounded-xl hover:border-blue-200 hover:shadow-md transition-all active:scale-95"
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

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-50">
          <div className="w-full h-14 bg-[#E1F0FF] rounded-xl flex items-center justify-center">
            <span className="text-[#0052CC] font-bold text-lg">Pay ৳145.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

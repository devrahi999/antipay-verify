
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
      className="min-h-screen flex flex-col items-center justify-start pb-8 relative overflow-x-hidden"
      style={{ 
        backgroundColor: '#eef2f6',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1.2'%3E%3Ccircle cx='40' cy='40' r='38'/%3E%3Ccircle cx='0' cy='0' r='38'/%3E%3Ccircle cx='80' cy='0' r='38'/%3E%3Ccircle cx='0' cy='80' r='38'/%3E%3Ccircle cx='80' cy='80' r='38'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="w-full max-w-[420px] flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Top Bar - Modern White Bar */}
        <div className="mx-3 mt-4 h-[60px] bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-between px-3 border border-gray-100/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-9 h-9 hover:bg-gray-50 text-gray-500"
            onClick={() => router.push('/')}
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-9 h-9 hover:bg-gray-50 text-gray-500"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Store Info Section */}
        <div className="flex flex-col items-center py-5 px-6">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white shadow-sm mb-2.5">
            <Image 
              src="https://picsum.photos/seed/store/200" 
              alt="Store Logo" 
              fill 
              className="object-cover"
              data-ai-hint="store logo"
            />
          </div>
          <h2 className="text-xs font-bold text-gray-700 mb-2.5 text-center">BD Esports Arena</h2>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-gray-100 bg-white text-gray-400 shadow-none">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-gray-100 bg-white text-gray-400 shadow-none">
              <Info className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-gray-100 bg-white text-gray-400 shadow-none">
              <AlertCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Tab */}
        <div className="px-4 mb-3.5">
          <Button className="w-full bg-[#10853D] hover:bg-[#0d6e32] text-white font-bold h-9 rounded-md shadow-sm tracking-wide text-[10px] uppercase">
            মোবাইল ব্যাংকিং
          </Button>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-2 gap-2 px-4 mb-24">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className="group flex items-center justify-center p-2.5 h-14 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-green-200 transition-all active:scale-95"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={method.logo} 
                  alt={method.name}
                  className="max-h-6 max-w-full object-contain"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Amount Bar - Flushed */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <div className="w-full max-w-[420px] h-[56px] bg-[#E8F5E9] flex items-center justify-center border-t border-green-100 pointer-events-auto">
            <span className="text-[#10853D] font-black text-xs uppercase">Pay ৳145.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  const router = useRouter();

  const bgPattern = {
    backgroundColor: '#eef2f6',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='16' height='16' rx='4' ry='4' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1.2'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 relative overflow-x-hidden"
      style={bgPattern}
    >
      <div className="w-full h-full sm:h-auto sm:max-w-[420px] bg-transparent sm:bg-white sm:rounded-xl sm:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-0 sm:border border-gray-100/50 flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden min-h-screen sm:min-h-0">
        
        {/* Cancel Card Section */}
        <div className="px-5 mt-8 sm:mt-6">
          <div className="bg-white rounded-xl border border-red-100 overflow-hidden shadow-md">
            <div className="bg-[#D12026] py-3 flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5 text-white" />
              <h3 className="text-white font-bold text-sm tracking-wide">পেমেন্ট বাতিল!</h3>
            </div>
            <div className="py-6 text-center">
              <p className="text-[#8C3494] font-bold text-xs">আপনি পেমেন্ট বাতিল করেছেন।</p>
            </div>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-6">
          <div className="relative w-full aspect-[4/3] max-w-[280px]">
            <img 
              src="https://i.imgur.com/I1469U9.png" 
              alt="Oops! Illustration" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Home Button Section - Fixed at bottom on mobile */}
        <div className="fixed sm:static bottom-8 left-0 right-0 z-50 px-5 sm:px-5 sm:pb-8">
          <Button 
            onClick={() => router.push('/')}
            className="w-full h-12 sm:h-12 bg-white hover:bg-gray-50 text-[#818CF8] font-bold text-xs rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 gap-3 flex items-center justify-center transition-all active:scale-[0.98]"
          >
            <Home className="w-5 h-5" />
            <span>ওয়েবসাইটে ফিরে যান!</span>
          </Button>
        </div>
      </div>

      {/* Policy Text for Desktop */}
      <div className="hidden sm:block mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">
        Secured by AntiPay Gateway
      </div>
    </div>
  );
}

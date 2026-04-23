
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
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden"
      style={bgPattern}
    >
      <div className="w-full sm:max-w-[420px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100/50 flex flex-col z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
        
        {/* Cancel Status Banner */}
        <div className="px-5 mt-8">
          <div className="bg-white rounded-xl border border-red-100 overflow-hidden shadow-md">
            <div className="bg-[#D12026] py-3 flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5 text-white" />
              <h3 className="text-white font-bold text-sm tracking-wide">পেমেন্ট বাতিল!</h3>
            </div>
            <div className="py-4 text-center">
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">আপনি পেমেন্ট বাতিল করেছেন।</p>
            </div>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="flex flex-col items-center justify-center py-8 px-6">
          <div className="relative w-full aspect-square max-w-[240px] animate-in zoom-in-95 duration-700">
            <img 
              src="https://i.imgur.com/I1469U9.png" 
              alt="Payment Cancelled" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Home Button Section */}
        <div className="px-5 pb-8">
          <Button 
            onClick={() => router.push('/')}
            className="w-full h-11 bg-white hover:bg-gray-50 text-[#10853D] font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-gray-100 gap-3 flex items-center justify-center transition-all active:scale-[0.98] uppercase tracking-widest"
          >
            <Home className="w-5 h-5" />
            <span>ওয়েবসাইটে ফিরে যান!</span>
          </Button>
        </div>
      </div>

      <div className="mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">
        Secured by AntiPay Gateway
      </div>
    </div>
  );
}

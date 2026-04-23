
"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Smartphone, CreditCard, ArrowRight, Loader2, ChevronLeft, BangladeshiTaka } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Service = "bkash" | "nagad" | null;
type Step = "selection" | "input" | "processing" | "status";

export default function PaymentGateway() {
  const [step, setStep] = useState<Step>("selection");
  const [service, setService] = useState<Service>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount] = useState(1250); // Mock amount
  const [status, setStatus] = useState<"success" | "failure" | null>(null);

  const handleServiceSelect = (selected: Service) => {
    setService(selected);
    setStep("input");
  };

  const handleBack = () => {
    if (step === "input") setStep("selection");
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 11) return;
    setStep("processing");

    // Simulate network latency
    setTimeout(() => {
      // Mock probability of success
      const isSuccess = Math.random() > 0.2;
      setStatus(isSuccess ? "success" : "failure");
      setStep("status");
    }, 2500);
  };

  const resetFlow = () => {
    setStep("selection");
    setService(null);
    setMobileNumber("");
    setStatus(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md animate-in fade-in duration-700 slide-in-from-bottom-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">TransactFlow</h1>
          <p className="text-muted-foreground">Secure minimalist payment gateway</p>
        </header>

        {step === "selection" && (
          <Card className="border-none shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Select Service</CardTitle>
              <CardDescription>Choose your preferred mobile financial service</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleServiceSelect("bkash")}
                className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-transparent bg-white hover:border-bkash transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                <div className="w-16 h-16 rounded-full bg-bkash/10 flex items-center justify-center group-hover:bg-bkash transition-colors duration-300">
                  <span className="text-bkash group-hover:text-white font-bold text-lg">bKash</span>
                </div>
                <span className="font-medium text-sm text-primary">bKash Pay</span>
              </button>
              <button
                onClick={() => handleServiceSelect("nagad")}
                className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-transparent bg-white hover:border-nagad transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                <div className="w-16 h-16 rounded-full bg-nagad/10 flex items-center justify-center group-hover:bg-nagad transition-colors duration-300">
                  <span className="text-nagad group-hover:text-white font-bold text-lg">Nagad</span>
                </div>
                <span className="font-medium text-sm text-primary">Nagad Pay</span>
              </button>
            </CardContent>
          </Card>
        )}

        {step === "input" && (
          <Card className={cn(
            "border-none shadow-xl transition-all duration-500",
            service === "bkash" ? "border-t-4 border-t-bkash" : "border-t-4 border-t-nagad"
          )}>
            <CardHeader className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-4 top-4"
                onClick={handleBack}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex flex-col items-center pt-4">
                <div className={cn(
                  "px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2",
                  service === "bkash" ? "bg-bkash/10 text-bkash" : "bg-nagad/10 text-nagad"
                )}>
                  {service} Payment
                </div>
                <CardTitle className="text-2xl font-bold">৳{amount.toLocaleString()}</CardTitle>
                <CardDescription>Confirm amount and enter number</CardDescription>
              </div>
            </CardHeader>
            <form onSubmit={handleProcessPayment}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 11))}
                      className="pl-10 h-12 text-lg tracking-widest focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">You will receive a 6-digit verification code from {service}.</p>
                </div>

                <div className="rounded-lg bg-muted/50 p-4 border border-border">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono font-medium">#TRX-94821</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-mono font-medium">Included</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={mobileNumber.length < 11}
                  className={cn(
                    "w-full h-12 text-lg font-semibold transition-all duration-300",
                    service === "bkash" ? "bg-bkash hover:bg-bkash/90 text-white" : "bg-nagad hover:bg-nagad/90 text-white"
                  )}
                >
                  Pay Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {step === "processing" && (
          <Card className="border-none shadow-xl py-12">
            <CardContent className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <Loader2 className={cn(
                  "h-16 w-16 animate-spin",
                  service === "bkash" ? "text-bkash" : "text-nagad"
                )} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Processing Transaction</h3>
                <p className="text-muted-foreground">Please wait while we verify your details with {service}.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "status" && (
          <Card className="border-none shadow-xl overflow-hidden">
            <div className={cn(
              "h-2",
              status === "success" ? "bg-green-500" : "bg-red-500"
            )} />
            <CardContent className="pt-12 pb-8 flex flex-col items-center text-center space-y-4">
              {status === "success" ? (
                <>
                  <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center animate-in zoom-in-50 duration-500">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold">Payment Successful</h3>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Your transaction was completed successfully.</p>
                    <p className="text-sm font-mono bg-muted py-1 px-3 rounded">ID: 8F29JS82</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center animate-in zoom-in-50 duration-500">
                    <XCircle className="h-12 w-12 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold">Payment Failed</h3>
                  <p className="text-muted-foreground px-4">The transaction could not be processed. Please check your balance or try again later.</p>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={resetFlow}
                variant="outline"
                className="w-full h-11 border-2 font-semibold"
              >
                {status === "success" ? "Done" : "Try Again"}
              </Button>
            </CardFooter>
          </Card>
        )}

        <footer className="mt-8 flex items-center justify-center gap-6 text-muted-foreground/40 grayscale transition-all hover:grayscale-0">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-tighter">PCI-DSS Compliant</span>
          </div>
          <div className="h-4 w-px bg-muted-foreground/20" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-[10px] font-semibold uppercase tracking-tighter">Secure SSL</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "invalid">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (process.env.NODE_ENV === "production") {
      setStatus("error");
      setErrorMessage("Subscriptions are currently unavailable. Please try again later.");
      return;
    }
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("invalid");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    // Simulate API call
    setTimeout(() => {
      // We simulate a successful subscription for the frontend mock.
      // Backend integration will handle 'already_subscribed' or 'server_error' states.
      setStatus("success");
      setEmail("");
    }, 800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === "invalid" || status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  return (
    <section className="bg-[#FCFAF5] w-full border-t border-[#E4E7E2]">
      <div className="py-[64px] lg:py-[88px] container mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[32px] lg:gap-[64px]">
          
          {/* Text Content */}
          <div className="flex flex-col text-left lg:w-[45%]">
            <span className="text-[11px] lg:text-[12px] font-medium tracking-[0.14em] text-[#5F706C] uppercase mb-3">
              Stay in the loop
            </span>
            <h2 className="font-heading text-[28px] sm:text-[32px] lg:text-[40px] leading-[1.15] text-[#183330] font-medium mb-3 lg:mb-4">
              Gifting inspiration, delivered.
            </h2>
            <p className="text-[15px] lg:text-[16px] text-[#5F706C] leading-relaxed">
              Discover new collections, thoughtful gifting ideas and seasonal updates, delivered occasionally to your inbox.
            </p>
          </div>

          {/* Form Area */}
          <div className="flex flex-col lg:w-[55%] max-w-[500px] lg:max-w-none w-full">
            
            {status === "success" ? (
              <div 
                className="flex flex-col bg-[#EEF5F3] border border-[#07514D]/20 p-5 lg:p-6 rounded-[8px] animate-in fade-in slide-in-from-bottom-2"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#07514D]" />
                  <span className="text-[16px] font-medium text-[#183330]">You&apos;re subscribed.</span>
                </div>
                <p className="text-[14px] text-[#5F706C] ml-[30px]">
                  We&apos;ll send thoughtful gifting updates occasionally.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-grow relative">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      disabled={status === "submitting"}
                      aria-invalid={status === "invalid"}
                      aria-describedby={errorMessage ? "newsletter-error" : undefined}
                      className={cn(
                        "w-full h-[48px] lg:h-[52px] px-4 rounded-[6px] border bg-white text-[15px] text-[#183330] placeholder:text-[#5F706C]/70 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                        status === "invalid" 
                          ? "border-red-600 focus-visible:border-red-600 focus-visible:ring-1 focus-visible:ring-red-600" 
                          : "border-[#E4E7E2] hover:border-[#C4C7C2] focus-visible:border-[#07514D] focus-visible:ring-1 focus-visible:ring-[#07514D]"
                      )}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    className="h-[48px] lg:h-[52px] px-6 lg:px-8 rounded-[6px] bg-[#07514D] text-[#FCFAF5] font-medium text-[15px] shrink-0 transition-colors hover:bg-[#043F3C]"
                  >
                    {status === "submitting" ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>

                {/* Validation Error Message */}
                <div 
                  id="newsletter-error"
                  aria-live="polite"
                  className={cn(
                    "min-h-[24px] mt-2 flex items-center text-[13px] text-red-600 font-medium transition-opacity",
                    errorMessage ? "opacity-100" : "opacity-0"
                  )}
                >
                  {errorMessage && (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                      {errorMessage}
                    </>
                  )}
                </div>

                <div className="mt-2 text-[12px] text-[#5F706C] leading-relaxed">
                  By subscribing, you agree to receive gifting updates from giftT seller. You can unsubscribe anytime.{" "}
                  <Link href="/privacy-policy" className="underline hover:text-[#183330] transition-colors">
                    Privacy Policy
                  </Link>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}

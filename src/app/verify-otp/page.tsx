"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyOtp, sendOtp } from "@/data/auth";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/auth/AuthContext";
import { cn } from "@/lib/utils";
import { safeReturnPath } from "@/lib/safe-return-path";

const OTP_LENGTH = 6;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const phoneOrEmail = searchParams.get("id");
  const returnTo = safeReturnPath(searchParams.get("returnTo"));

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  // Redirect to login if accessed directly without an ID
  useEffect(() => {
    if (!phoneOrEmail) {
      router.replace("/login");
    }
  }, [phoneOrEmail, router]);

  // Handle focus
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (value && !/^\d+$/.test(value)) return;

    const newOTP: string[] = [...otp];
    newOTP[index] = value.substring(value.length - 1);
    setOtp(newOTP);

    // Auto-submit if full
    const fullOtp = newOTP.join("");
    if (fullOtp.length === OTP_LENGTH) {
      handleVerify(fullOtp);
    } else if (value) {
      setActiveOTPIndex(Math.min(OTP_LENGTH - 1, index + 1));
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOTP = [...otp];
      newOTP[index] = "";
      setOtp(newOTP);
      if (index > 0) setActiveOTPIndex(index - 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      setActiveOTPIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      setActiveOTPIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasteData)) return;

    const newOTP = [...otp];
    pasteData.split("").forEach((char, i) => {
      newOTP[i] = char;
    });
    setOtp(newOTP);

    if (pasteData.length === OTP_LENGTH) {
      setActiveOTPIndex(OTP_LENGTH - 1);
      handleVerify(pasteData);
    } else {
      setActiveOTPIndex(pasteData.length);
    }
  };

  const handleVerify = async (otpCode: string) => {
    if (otpCode.length !== OTP_LENGTH || !phoneOrEmail) return;

    setIsVerifying(true);
    setError(null);

    try {
      const result = await verifyOtp(phoneOrEmail, otpCode);
      if (result.success && result.user) {
        login(result.user);
        router.push(returnTo);
      } else {
        setError(result.error || "Verification failed. Please try again.");
        setIsVerifying(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !phoneOrEmail) return;
    
    setResendCooldown(30);
    setError(null);
    setOtp(Array(OTP_LENGTH).fill(""));
    setActiveOTPIndex(0);
    inputRef.current?.focus();
    
    await sendOtp(phoneOrEmail);
  };

  if (!phoneOrEmail) return null;

  return (
    <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 sm:p-8 shadow-sm">
      <Link 
        href={`/login${returnTo !== '/account' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} 
        className="inline-flex items-center text-[14px] text-[#5F706C] hover:text-[#183330] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
      </Link>

      <h1 className="font-heading text-[28px] text-[#183330] font-medium text-center mb-2">
        Verify your number
      </h1>
      <p className="text-[15px] text-[#5F706C] text-center mb-8 px-4 leading-relaxed">
        We sent a verification code to <span className="font-medium text-[#183330] whitespace-nowrap">{phoneOrEmail}</span>
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start gap-3 border border-red-100 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-[14px] leading-snug">{error}</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-8">
        {/* Custom OTP Input */}
        <div className="flex gap-2 sm:gap-3 justify-center" dir="ltr">
          {otp.map((_, index) => (
            <input
              key={index}
              ref={index === activeOTPIndex ? inputRef : null}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleOnChange(e, index)}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              onPaste={handlePaste}
              onFocus={() => setActiveOTPIndex(index)}
              disabled={isVerifying}
              className={cn(
                "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-medium rounded-md border outline-none transition-all",
                otp[index] ? "border-[#07514D] text-[#183330]" : "border-[#E4E7E2] text-[#183330]",
                index === activeOTPIndex && "ring-2 ring-[#07514D] ring-offset-0 border-[#07514D]",
                isVerifying && "opacity-50 cursor-not-allowed bg-gray-50"
              )}
            />
          ))}
        </div>

        <Button 
          onClick={() => handleVerify(otp.join(""))}
          disabled={isVerifying || otp.join("").length !== OTP_LENGTH}
          className="h-12 w-full bg-[#07514D] hover:bg-[#043F3C] text-white text-[16px] transition-colors"
        >
          {isVerifying ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
            </span>
          ) : (
            "Verify & Continue"
          )}
        </Button>

        <div className="text-center text-[14px]">
          <span className="text-[#5F706C]">Didn&apos;t receive the code? </span>
          <button 
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={cn(
              "font-medium transition-colors",
              resendCooldown > 0 
                ? "text-[#A87908] cursor-default opacity-80" 
                : "text-[#07514D] hover:underline cursor-pointer"
            )}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-[#FCFAF5] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] flex flex-col items-center">
        <Link href="/" className="mb-8 block hover:opacity-80 transition-opacity">
          <Logo className="w-auto h-8 text-[#07514D]" />
        </Link>
        
        <div className="w-full">
          <Suspense fallback={
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-[#07514D]" />
            </div>
          }>
            <VerifyOtpForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

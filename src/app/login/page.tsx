"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendOtp } from "@/data/auth";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/auth/AuthContext";
import { safeReturnPath } from "@/lib/safe-return-path";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  
  const returnTo = safeReturnPath(searchParams.get("returnTo"));
  
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(returnTo);
    }
  }, [isAuthenticated, isLoading, router, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await sendOtp(phoneOrEmail);
      if (result.success) {
        // Navigate to OTP verification with context in URL params
        const params = new URLSearchParams();
        params.set("id", phoneOrEmail);
        if (searchParams.get("returnTo")) {
          params.set("returnTo", returnTo);
        }
        router.push(`/verify-otp?${params.toString()}`);
      } else {
        setError("We couldn't send the verification code. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-[#07514D]" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 sm:p-8 shadow-sm">
      <h1 className="font-heading text-[28px] text-[#183330] font-medium text-center mb-2">
        Welcome
      </h1>
      <p className="text-[15px] text-[#5F706C] text-center mb-8">
        Sign in or create an account to continue.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-[14px] leading-snug">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="identity" className="text-[#183330]">
            Email or Mobile Number
          </Label>
          <Input 
            id="identity" 
            placeholder="e.g. 9876543210 or name@example.com" 
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            className="h-12 border-[#E4E7E2] focus-visible:ring-[#07514D]"
            required
            autoComplete="username"
            autoFocus
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="h-12 w-full bg-[#07514D] hover:bg-[#043F3C] text-white text-[16px] mt-2 transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Sending Code...
            </span>
          ) : (
            "Continue"
          )}
        </Button>

        <p className="text-[13px] text-[#5F706C] text-center mt-2 leading-relaxed">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[#183330]">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-[#183330]">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
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
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

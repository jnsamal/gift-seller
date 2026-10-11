"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/components/commerce/CartContext";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();

  // State
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived
  const shippingCost = deliveryMethod === "express" ? 149 : deliveryMethod === "sameday" ? 249 : 99;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (process.env.NODE_ENV === "production") {
      toast.error("Checkout is currently unavailable. Please try again later.");
      return;
    }
    if (!email || !firstName || !address || !city || !pincode || !phone) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Mock order placement
    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      toast.success("Order placed successfully!", { position: "top-center" });
      router.push("/order/success/ORD-12345");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF5] px-4">
        <div className="mb-8">
          <Logo />
        </div>
        <h2 className="font-heading text-2xl text-[#183330] mb-4">Your checkout session expired</h2>
        <Link href="/cart" className="inline-flex items-center justify-center h-10 px-4 py-2 bg-[#07514D] hover:bg-[#043F3C] text-white rounded-md text-sm font-medium transition-colors">
          Return to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Checkout Header */}
      <header className="border-b border-[#E4E7E2] py-5 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 text-[#5F706C] text-[13px] font-medium">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start min-h-[calc(100vh-80px)]">
        
        {/* Left Column: Form */}
        <div className="w-full lg:w-[55%] xl:w-[60%] lg:border-r border-[#E4E7E2] pt-8 lg:pt-12 pb-24 px-4 sm:px-6 lg:px-12 xl:px-16 lg:min-h-full">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-[13px] text-[#5F706C] mb-8 font-medium">
            <Link href="/cart" className="hover:text-[#183330] transition-colors">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5 mx-2" />
            <span className="text-[#183330]">Information</span>
            <ChevronRight className="w-3.5 h-3.5 mx-2" />
            <span>Payment</span>
          </nav>

          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-10">
            
            {/* Contact Information */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-heading text-[22px] text-[#183330] font-medium">Contact</h2>
                <span className="text-[14px] text-[#5F706C]">
                  Have an account? <Link href="/login" className="text-[#07514D] hover:underline font-medium">Log in</Link>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[13px] text-[#5F706C]">Email address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] text-[15px]" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-[13px] text-[#5F706C]">Phone number *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] text-[15px]" 
                  />
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section>
              <h2 className="font-heading text-[22px] text-[#183330] font-medium mb-4">Delivery Address</h2>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-[13px] text-[#5F706C]">First name *</Label>
                    <Input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-12 bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] text-[15px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-[13px] text-[#5F706C]">Last name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-12 bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] text-[15px]" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-[13px] text-[#5F706C]">Address *</Label>
                  <Input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House/Flat No., Building Name, Street" className="h-12 bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] text-[15px]" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="pincode" className="text-[13px] text-[#5F706C]">PIN Code *</Label>
                    <Input id="pincode" required maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value)} className="h-12 bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] text-[15px]" />
                  </div>
                  <div className="space-y-1.5 md:col-span-1">
                    <Label htmlFor="city" className="text-[13px] text-[#5F706C]">City *</Label>
                    <Input id="city" required value={city} onChange={(e) => setCity(e.target.value)} className="h-12 bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] text-[15px]" />
                  </div>
                  <div className="space-y-1.5 md:col-span-1 col-span-2">
                    <Label htmlFor="state" className="text-[13px] text-[#5F706C]">State</Label>
                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} className="h-12 bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] text-[15px]" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox id="save-address" className="border-[#E4E7E2] data-[state=checked]:bg-[#07514D] data-[state=checked]:border-[#07514D]" />
                  <label htmlFor="save-address" className="text-[14px] text-[#183330] font-medium leading-none cursor-pointer">
                    Save this information for next time
                  </label>
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section>
              <h2 className="font-heading text-[22px] text-[#183330] font-medium mb-4">Delivery Method</h2>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="flex flex-col gap-3">
                <label className="flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-[#F4F2EA] [&:has([data-state=checked])]:border-[#07514D] [&:has([data-state=checked])]:bg-[#FCFAF5]">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="standard" id="standard" className="mt-0.5 border-[#A87908] text-[#07514D]" />
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-[#183330]">Standard Delivery</span>
                      <span className="text-[13px] text-[#5F706C] mt-0.5">3-5 Business Days</span>
                    </div>
                  </div>
                  <span className="text-[15px] font-medium text-[#183330]">₹99</span>
                </label>
                
                <label className="flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-[#F4F2EA] [&:has([data-state=checked])]:border-[#07514D] [&:has([data-state=checked])]:bg-[#FCFAF5]">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="express" id="express" className="mt-0.5 border-[#A87908] text-[#07514D]" />
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-[#183330]">Express Delivery</span>
                      <span className="text-[13px] text-[#5F706C] mt-0.5">1-2 Business Days</span>
                    </div>
                  </div>
                  <span className="text-[15px] font-medium text-[#183330]">₹149</span>
                </label>

                <label className="flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-colors hover:bg-[#F4F2EA] [&:has([data-state=checked])]:border-[#07514D] [&:has([data-state=checked])]:bg-[#FCFAF5]">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="sameday" id="sameday" className="mt-0.5 border-[#A87908] text-[#07514D]" />
                    <div className="flex flex-col">
                      <span className="text-[15px] font-medium text-[#183330]">Same-Day Delivery</span>
                      <span className="text-[13px] text-[#5F706C] mt-0.5">Order before 2 PM</span>
                    </div>
                  </div>
                  <span className="text-[15px] font-medium text-[#183330]">₹249</span>
                </label>
              </RadioGroup>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="font-heading text-[22px] text-[#183330] font-medium mb-1">Payment</h2>
              <p className="text-[13px] text-[#5F706C] mb-4">All transactions are secure and encrypted.</p>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col gap-0 border border-[#E4E7E2] rounded-lg overflow-hidden bg-white">
                
                {/* UPI / Razorpay */}
                <div className="flex flex-col border-b border-[#E4E7E2]">
                  <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#F4F2EA] transition-colors [&:has([data-state=checked])]:bg-[#FCFAF5]">
                    <RadioGroupItem value="upi" id="upi" className="border-[#A87908] text-[#07514D]" />
                    <span className="text-[15px] font-medium text-[#183330]">UPI / Cards / Net Banking</span>
                  </label>
                  {paymentMethod === "upi" && (
                    <div className="px-4 pb-4 pt-1 bg-[#FCFAF5] flex flex-col items-center justify-center py-6 text-center">
                      <ShieldCheck className="w-10 h-10 text-[#07514D] mb-3 stroke-[1.5]" />
                      <p className="text-[14px] text-[#5F706C] max-w-[300px]">
                        After clicking &quot;Pay Now&quot;, you will be redirected to Razorpay to complete your purchase securely.
                      </p>
                    </div>
                  )}
                </div>

                {/* COD */}
                <div className="flex flex-col">
                  <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[#F4F2EA] transition-colors [&:has([data-state=checked])]:bg-[#FCFAF5]">
                    <RadioGroupItem value="cod" id="cod" className="border-[#A87908] text-[#07514D]" />
                    <span className="text-[15px] font-medium text-[#183330]">Cash on Delivery (COD)</span>
                  </label>
                  {paymentMethod === "cod" && (
                    <div className="px-4 pb-4 pt-1 bg-[#FCFAF5] flex flex-col pl-11">
                      <p className="text-[13px] text-[#5F706C]">
                        Pay with cash upon delivery. An additional fee of ₹50 may apply.
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </section>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#E4E7E2]">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 bg-[#07514D] hover:bg-[#043F3C] text-white text-[16px] font-medium rounded-md transition-colors"
              >
                {isSubmitting ? "Processing..." : paymentMethod === "upi" ? "Pay Now" : "Place Order"}
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-[12px] text-[#5F706C]">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure 256-bit SSL encryption</span>
              </div>
            </div>

          </form>

        </div>

        {/* Right Column: Order Summary (Sticky Desktop) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#FCFAF5] lg:bg-transparent lg:border-none border-t border-[#E4E7E2] px-4 sm:px-6 lg:px-12 xl:px-16 py-8 lg:py-12">
          <div className="lg:sticky lg:top-12">
            <CheckoutOrderSummary shippingCost={shippingCost} />
          </div>
        </div>

      </main>
    </div>
  );
}

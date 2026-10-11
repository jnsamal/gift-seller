"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Check, Clock, Calendar, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- MOCK API LAYER ---
type DeliveryStatus = "IDLE" | "LOADING" | "AVAILABLE" | "PARTIALLY_AVAILABLE" | "UNSUPPORTED" | "INVALID";

interface DeliveryData {
  pincode: string;
  city: string;
  serviceable: boolean;
  sameDay: boolean;
  express: boolean;
  scheduled: boolean;
}

const mockCheckDelivery = async (input: string): Promise<{ status: DeliveryStatus; data?: DeliveryData }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pin = input.trim();
      if (pin.length < 6 || isNaN(Number(pin))) {
        resolve({ status: "INVALID" });
        return;
      }
      if (pin === "751001" || pin === "110001" || pin === "400001") {
        resolve({
          status: "AVAILABLE",
          data: {
            pincode: pin,
            city: pin === "751001" ? "Bhubaneswar" : pin === "110001" ? "New Delhi" : "Mumbai",
            serviceable: true,
            sameDay: true,
            express: true,
            scheduled: true,
          }
        });
      } else if (pin.startsWith("8") || pin.startsWith("9")) {
        resolve({ status: "UNSUPPORTED" });
      } else {
        resolve({
          status: "PARTIALLY_AVAILABLE",
          data: {
            pincode: pin,
            city: "Other City",
            serviceable: true,
            sameDay: false,
            express: false,
            scheduled: true,
          }
        });
      }
    }, 600);
  });
};

// --- SUB-COMPONENTS ---

function DeliveryOptions({ data }: { data: DeliveryData }) {
  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm">
      <div className={cn("flex items-center gap-1.5", data.sameDay ? "text-primary" : "text-muted-foreground opacity-50")}>
        <Clock className="w-4 h-4" />
        <span className="font-medium">Same Day</span>
      </div>
      <div className="w-1 h-1 rounded-full bg-border" />
      <div className={cn("flex items-center gap-1.5", data.express ? "text-primary" : "text-muted-foreground opacity-50")}>
        <ArrowRight className="w-4 h-4" />
        <span className="font-medium">Express</span>
      </div>
      <div className="w-1 h-1 rounded-full bg-border" />
      <div className={cn("flex items-center gap-1.5", data.scheduled ? "text-primary" : "text-muted-foreground opacity-50")}>
        <Calendar className="w-4 h-4" />
        <span className="font-medium">Scheduled</span>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export function DeliveryIntent() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<DeliveryStatus>("IDLE");
  const [data, setData] = useState<DeliveryData | null>(null);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setStatus("LOADING");
    const result = await mockCheckDelivery(input);
    setStatus(result.status);
    if (result.data) {
      setData(result.data);
    } else {
      setData(null);
    }
  };

  const handleReset = () => {
    setInput("");
    setStatus("IDLE");
    setData(null);
  };

  return (
    <section className="w-full bg-background border-b border-border/60 relative z-20 py-8 lg:py-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          
          {/* LEFT: Copy */}
          <div className="flex-shrink-0 max-w-xs">
            <h2 className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase mb-2">Delivery Made Simple</h2>
            <h3 className="font-heading text-xl md:text-2xl text-foreground font-medium mb-1">Where should we deliver your gift?</h3>
            <p className="text-sm text-muted-foreground">Check delivery options before you shop.</p>
          </div>

          {/* CENTER: Input Action */}
          <div className="w-full lg:max-w-md xl:max-w-lg flex-shrink-0">
            {status === "AVAILABLE" || status === "PARTIALLY_AVAILABLE" || status === "UNSUPPORTED" ? (
              <div className="flex items-center justify-between w-full h-12 px-4 rounded-md border border-border bg-muted/20">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {data ? `Delivering to ${data.city}, ${data.pincode}` : "Location not supported"}
                  </span>
                </div>
                <Button 
                  variant="link"
                  onClick={handleReset}
                  className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Change location"
                >
                  Change
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCheck} className="relative flex w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                </div>
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (status === "INVALID") setStatus("IDLE");
                  }}
                  placeholder="Enter PIN code or city"
                  className={cn(
                    "w-full h-12 pl-10 pr-[100px] bg-background text-sm transition-all focus-visible:ring-1 focus-visible:ring-offset-0",
                    status === "INVALID" ? "border-red-500 focus-visible:ring-red-500" : "border-border focus-visible:ring-primary"
                  )}
                  aria-label="Enter PIN code or city"
                  aria-invalid={status === "INVALID"}
                />
                <Button
                  type="submit"
                  disabled={status === "LOADING" || !input.trim()}
                  className="absolute right-1 top-1 bottom-1 h-10 px-5 text-sm font-medium"
                >
                  {status === "LOADING" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
                </Button>
              </form>
            )}
            {/* Inline Validation */}
            {status === "INVALID" && (
              <div className="flex items-center gap-1.5 mt-2 text-red-500 text-xs font-medium" aria-live="polite">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please enter a valid 6-digit PIN code.</span>
              </div>
            )}
          </div>

          {/* RIGHT: Delivery Result / Options */}
          <div className="flex-1 w-full lg:w-auto" aria-live="polite">
            {(status === "IDLE" || status === "LOADING" || status === "INVALID") && (
              <div className="hidden lg:flex items-center text-sm text-muted-foreground/70 italic">
                Enter a PIN code to check Same-Day & Express availability.
              </div>
            )}

            {status === "AVAILABLE" && data && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1"><Check className="w-3.5 h-3.5" /> All options available</span>
                <DeliveryOptions data={data} />
              </div>
            )}

            {status === "PARTIALLY_AVAILABLE" && data && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Standard delivery available</span>
                <DeliveryOptions data={data} />
              </div>
            )}

            {status === "UNSUPPORTED" && (
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <AlertCircle className="w-4 h-4 opacity-70" />
                  We don&apos;t currently deliver to this PIN.
                </div>
                <span>Please try another location or contact support.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

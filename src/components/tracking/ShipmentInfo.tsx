"use client";

import { useState } from "react";
import { Truck, Copy, ExternalLink, Check } from "lucide-react";

interface ShipmentInfoProps {
  trackingNumber: string;
  courier?: string;
}

export function ShipmentInfo({ trackingNumber, courier }: ShipmentInfoProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 text-[#183330] font-medium mb-4">
        <Truck className="w-5 h-5 text-[#D2A01F]" />
        <h2 className="font-heading text-[18px]">Shipment Information</h2>
      </div>
      
      <div className="bg-[#FCFAF5] border border-[#E4E7E2] rounded-lg p-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] text-[#5F706C] uppercase tracking-wider font-medium">Tracking Number</span>
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#183330] text-[16px]">{trackingNumber}</span>
            <button 
              onClick={handleCopy}
              className="text-[#07514D] hover:text-[#043F3C] transition-colors p-1 rounded-md hover:bg-[#F4F2EA]"
              aria-label="Copy tracking number"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[13px] text-[#5F706C] uppercase tracking-wider font-medium">Courier</span>
          <span className="font-medium text-[#183330] text-[16px]">{courier || "Standard Delivery"}</span>
        </div>

        {/* Mock tracking external link for demonstration */}
        <a 
          href={`https://example.com/track?id=${trackingNumber}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-white border border-[#E4E7E2] text-[#183330] hover:bg-[#F4F2EA] rounded-md text-[14px] font-medium transition-colors"
        >
          Track on courier site <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

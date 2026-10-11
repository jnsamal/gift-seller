import Image from "next/image";
import { Order } from "@/data/orders";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

export function TrackingOrderSummary({ order }: { order: Order }) {
  return (
    <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2 text-[#183330] font-medium mb-2">
        <Package className="w-5 h-5 text-[#D2A01F]" />
        <h2 className="font-heading text-[18px]">Order Summary</h2>
      </div>
      
      <div className="flex flex-col gap-5">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative w-16 h-16 bg-[#F4F2EA] border border-[#E4E7E2] rounded-md overflow-hidden shrink-0">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#5F706C] text-white text-[11px] font-medium flex items-center justify-center rounded-full z-10 border-2 border-[#F4F2EA]">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[14px] font-medium text-[#183330] leading-snug">{item.title}</span>
              {item.personalisation && item.personalisation.length > 0 && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {item.personalisation.map((p, i) => (
                    <span key={i} className="text-[12px] text-[#5F706C]">
                      {p.label}: <span className="font-medium text-[#183330]">{p.value}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-[#E4E7E2] my-2" />

      {/* Simplified totals */}
      <div className="flex justify-between items-center text-[#183330]">
        <span className="text-[15px] font-medium">Total</span>
        <span className="font-heading text-[20px] font-semibold">₹{order.summary.total.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

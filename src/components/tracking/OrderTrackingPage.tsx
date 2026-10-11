"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Package, MapPin, Copy, Check, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchTrackingDetails, Order } from "@/data/orders";
import { TrackingTimeline } from "./TrackingTimeline";
import { TrackingOrderSummary } from "./TrackingOrderSummary";
import { ShipmentInfo } from "./ShipmentInfo";

interface OrderTrackingPageProps {
  initialOrderId?: string;
}

export function OrderTrackingPage({ initialOrderId = "" }: OrderTrackingPageProps) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !emailOrPhone) return;

    setIsLoading(true);
    setError(null);
    setOrder(null);

    const result = await fetchTrackingDetails(orderId, emailOrPhone);
    setIsLoading(false);

    if (result) {
      setOrder(result);
    } else {
      setError("We couldn't find an order with those details. Please check and try again.");
    }
  };

  if (order) {
    return (
      <div className="min-h-screen bg-[#FCFAF5] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1000px] mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-[32px] text-[#183330] font-medium mb-1">
                Order Tracking
              </h1>
              <p className="text-[#5F706C]">
                Tracking details for order <span className="font-medium text-[#183330]">{order.id}</span>
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setOrder(null)}
              className="border-[#E4E7E2] text-[#183330] hover:bg-[#F4F2EA] w-fit"
            >
              Track another order
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column - Tracking Timeline & Info (65%) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Estimated Delivery Banner */}
              {order.estimatedDeliveryDate && (
                <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[14px] text-[#5F706C] font-medium uppercase tracking-wider block mb-1">
                      Estimated Delivery
                    </span>
                    <span className="font-heading text-[24px] font-semibold text-[#183330]">
                      {order.estimatedDeliveryDate}
                    </span>
                  </div>
                  <Package className="w-10 h-10 text-[#D2A01F] opacity-80" />
                </div>
              )}

              {/* Timeline */}
              <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-[20px] font-medium text-[#183330] mb-6">
                  Delivery Status
                </h2>
                <TrackingTimeline timeline={order.timeline} currentStatus={order.status} />
              </div>

              {/* Shipment Info */}
              {order.trackingNumber && (
                <ShipmentInfo trackingNumber={order.trackingNumber} courier={order.courier} />
              )}
            </div>

            {/* Right Column - Order Summary & Delivery Address (35%) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <TrackingOrderSummary order={order} />

              {/* Delivery Address */}
              <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 text-[#183330] font-medium mb-4">
                  <MapPin className="w-5 h-5 text-[#D2A01F]" />
                  <h3 className="font-heading text-[18px]">Delivering to</h3>
                </div>
                <div className="text-[14px] text-[#5F706C] flex flex-col leading-relaxed">
                  <span className="font-medium text-[#183330]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</span>
                  <span>{order.shippingAddress.address}</span>
                  <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</span>
                </div>
              </div>

              {/* Support / View Details Actions */}
              <div className="bg-[#F4F2EA] rounded-xl p-6 flex flex-col gap-4 border border-[#E4E7E2]">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-[#183330]">Need help with this order?</span>
                  <span className="text-[13px] text-[#5F706C]">Contact our support team for assistance.</span>
                </div>
                <div className="flex gap-3 mt-2">
                  <Link href={`/account/orders/${order.id}`} className="flex-1 inline-flex items-center justify-center h-10 bg-white border border-[#E4E7E2] text-[#183330] hover:bg-gray-50 rounded-md text-[14px] font-medium transition-colors">
                    View Details
                  </Link>
                  <Link href="/contact" className="flex-1 inline-flex items-center justify-center h-10 bg-[#07514D] hover:bg-[#043F3C] text-white rounded-md text-[14px] font-medium transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lookup Form State
  return (
    <div className="min-h-screen bg-[#FCFAF5] py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-[480px] w-full">
        <h1 className="font-heading text-[32px] md:text-[40px] text-[#183330] font-medium text-center mb-3">
          Track your order
        </h1>
        <p className="text-[16px] text-[#5F706C] text-center mb-8">
          Enter your order details below to see the latest delivery status.
        </p>

        <div className="bg-white border border-[#E4E7E2] rounded-xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleTrack} className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start gap-3 border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-[14px]">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="orderId" className="text-[#183330]">Order Number</Label>
              <Input 
                id="orderId" 
                placeholder="e.g. ORD-12345" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="h-12 border-[#E4E7E2] focus-visible:ring-[#07514D]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-[#183330]">Email or Phone Number</Label>
              <Input 
                id="email" 
                placeholder="Entered during checkout" 
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="h-12 border-[#E4E7E2] focus-visible:ring-[#07514D]"
                required
              />
              <span className="text-[12px] text-[#5F706C]">
                Used to verify your identity.
              </span>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-12 w-full bg-[#07514D] hover:bg-[#043F3C] text-white text-[16px] mt-2"
            >
              {isLoading ? (
                "Tracking..."
              ) : (
                <>
                  Track Order <Search className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

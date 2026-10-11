import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, MapPin, AlertCircle, Clock, CreditCard } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { fetchOrderDetails } from "@/data/orders";
import { Badge } from "@/components/ui/badge";

export async function OrderSuccessPage({ orderId }: { orderId: string }) {
  const order = await fetchOrderDetails(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FCFAF5] flex flex-col">
        <header className="border-b border-[#E4E7E2] py-5 px-4 sm:px-6 lg:px-8 bg-white flex justify-center">
          <Logo />
        </header>
        <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-12 lg:py-20 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#F4F2EA] rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-[#183330]" />
          </div>
          <h1 className="font-heading text-[28px] text-[#183330] font-medium text-center mb-4">
            Order not found
          </h1>
          <p className="text-[15px] text-[#5F706C] text-center max-w-md mb-8">
            We couldn&apos;t find an order with the ID {orderId}.
          </p>
          <div className="flex gap-4">
            <Link href="/account/orders" className="inline-flex items-center justify-center h-10 px-4 py-2 bg-[#07514D] hover:bg-[#043F3C] text-white rounded-md text-sm font-medium transition-colors">
              View My Orders
            </Link>
            <Link href="/" className="inline-flex items-center justify-center h-10 px-4 py-2 border border-[#E4E7E2] text-[#183330] hover:bg-[#F4F2EA] rounded-md text-sm font-medium transition-colors">
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid" || order.paymentStatus === "cod";
  const isFailed = order.paymentStatus === "failed";
  const isPending = order.paymentStatus === "pending";

  if (isFailed) {
    return (
      <div className="min-h-screen bg-[#FCFAF5] flex flex-col">
        <header className="border-b border-[#E4E7E2] py-5 px-4 sm:px-6 lg:px-8 bg-white flex justify-center">
          <Logo />
        </header>
        <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-12 lg:py-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="font-heading text-[32px] text-[#183330] font-medium mb-4">
            Payment wasn&apos;t completed.
          </h1>
          <p className="text-[15px] text-[#5F706C] max-w-md mb-8">
            We couldn&apos;t process your payment. Your cart is still available, so you can try a different payment method.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/checkout" className="inline-flex items-center justify-center h-12 px-8 bg-[#07514D] hover:bg-[#043F3C] text-white rounded-md text-[15px] font-medium transition-colors">
              Return to Checkout
            </Link>
            <Link href="/cart" className="inline-flex items-center justify-center h-12 px-8 border border-[#E4E7E2] text-[#183330] hover:bg-[#F4F2EA] rounded-md text-[15px] font-medium transition-colors">
              Back to Cart
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF5] flex flex-col">
      <header className="border-b border-[#E4E7E2] py-5 px-4 sm:px-6 lg:px-8 bg-white flex justify-center">
        <Logo />
      </header>

      <main className="flex-1 max-w-[800px] w-full mx-auto px-4 py-8 lg:py-16 flex flex-col items-center">
        
        {/* Success Header */}
        {isPending ? (
          <div className="w-16 h-16 bg-[#F4F2EA] border border-[#E4E7E2] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Clock className="w-7 h-7 text-[#A87908]" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-[#07514D] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
        )}

        <h1 className="font-heading text-[32px] md:text-[40px] text-[#183330] font-medium text-center mb-3">
          {isPending ? "Payment confirmation pending" : "Order confirmed"}
        </h1>
        
        <p className="text-[16px] text-[#5F706C] text-center max-w-md mb-1.5">
          {isPending 
            ? "We're confirming your payment. Please don't place the order again."
            : `Thank you, ${order.shippingAddress.firstName}. Your order has been successfully placed.`
          }
        </p>
        
        {order.customerEmail && !isPending && (
          <p className="text-[14px] text-[#5F706C] text-center mb-8">
            We&apos;ve sent your order confirmation to <span className="font-medium text-[#183330]">{order.customerEmail}</span>
          </p>
        )}

        {isPending && <div className="mb-8" />}

        {/* Order Details Grid */}
        <div className="w-full bg-white border border-[#E4E7E2] rounded-xl overflow-hidden mb-8 shadow-sm">
          
          {/* Header Bar */}
          <div className="bg-[#F4F2EA] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E7E2]">
            <div className="flex flex-col">
              <span className="text-[12px] uppercase tracking-wider font-semibold text-[#5F706C]">Order Number</span>
              <span className="text-[16px] font-medium text-[#183330]">{order.id}</span>
            </div>
            <div className="flex items-center gap-3">
              {isPaid && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>}
              {isPending && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>}
              <Badge variant="secondary" className="bg-[#FCFAF5] text-[#183330] border border-[#E4E7E2] capitalize">
                {order.status.replace("_", " ")}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Delivery Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#183330] font-medium">
                <MapPin className="w-5 h-5 text-[#D2A01F]" />
                <span>Delivering to</span>
              </div>
              <div className="text-[14px] text-[#5F706C] flex flex-col leading-relaxed">
                <span className="font-medium text-[#183330]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</span>
                <span>{order.shippingAddress.address}</span>
                <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</span>
                <span className="mt-1">Phone: {order.shippingAddress.phone}</span>
              </div>
            </div>

            {/* Tracking / Payment Info */}
            <div className="flex flex-col gap-6">
              {/* Payment Summary */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[#183330] font-medium">
                  <CreditCard className="w-5 h-5 text-[#D2A01F]" />
                  <span>Payment</span>
                </div>
                <div className="text-[14px] text-[#5F706C] flex flex-col leading-relaxed">
                  <span>Method: <span className="font-medium text-[#183330] uppercase">{order.paymentMethod}</span></span>
                  {order.transactionId && <span>Ref: {order.transactionId}</span>}
                </div>
              </div>

              {/* Status/Tracking Timeline */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[#183330] font-medium">
                  <Package className="w-5 h-5 text-[#D2A01F]" />
                  <span>Delivery Status</span>
                </div>
                
                <div className="text-[14px] text-[#5F706C] flex flex-col">
                  {order.trackingNumber ? (
                    <div className="bg-[#FCFAF5] p-3 rounded-md border border-[#E4E7E2]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-[#183330]">{order.courier || "Courier"}</span>
                        <a href={`/track/${order.trackingNumber}`} className="text-[#07514D] font-medium hover:underline">Track</a>
                      </div>
                      <span className="text-[13px]">Tracking ID: {order.trackingNumber}</span>
                    </div>
                  ) : (
                    <p className="text-[13px]">
                      Tracking will be available once your order is shipped.
                      {order.estimatedDeliveryDate && (
                        <span className="block mt-1 font-medium text-[#183330]">
                          Estimated delivery: {order.estimatedDeliveryDate}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-[#E4E7E2]" />

          {/* Items Summary */}
          <div className="p-6 lg:p-8">
            <h3 className="font-heading text-[18px] text-[#183330] font-medium mb-5">Order Summary</h3>
            
            <div className="flex flex-col gap-5 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 bg-[#F4F2EA] border border-[#E4E7E2] rounded-md overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#5F706C] text-white text-[11px] font-medium flex items-center justify-center rounded-full z-10 border-2 border-[#F4F2EA]">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[14px] font-medium text-[#183330]">{item.title}</span>
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
                  <div className="text-[14px] font-medium text-[#183330] shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-[#E4E7E2] mb-4" />

            {/* Totals */}
            <div className="flex flex-col gap-2 max-w-[300px] ml-auto">
              <div className="flex justify-between text-[14px] text-[#5F706C]">
                <span>Subtotal</span>
                <span>₹{order.summary.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.summary.discount > 0 && (
                <div className="flex justify-between text-[14px] text-[#D2A01F]">
                  <span>Discount</span>
                  <span>−₹{order.summary.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-[14px] text-[#5F706C]">
                <span>Delivery</span>
                <span>{order.summary.shipping === 0 ? "Free" : `₹${order.summary.shipping.toLocaleString("en-IN")}`}</span>
              </div>
              <div className="flex justify-between text-[16px] font-medium text-[#183330] mt-2 pt-2 border-t border-[#E4E7E2]">
                <span>Total</span>
                <span className="font-heading text-[20px] font-semibold">₹{order.summary.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
          {order.trackingNumber ? (
            <Link href={`/track/${order.trackingNumber}`} className="inline-flex items-center justify-center h-12 px-8 bg-[#07514D] hover:bg-[#043F3C] text-white text-[15px] font-medium rounded-md transition-colors w-full sm:w-auto">
              Track Order
            </Link>
          ) : (
            <Link href="/category/all" className="inline-flex items-center justify-center h-12 px-8 bg-[#07514D] hover:bg-[#043F3C] text-white text-[15px] font-medium rounded-md transition-colors w-full sm:w-auto">
              Continue Shopping
            </Link>
          )}

          <Link href={`/account/orders/${order.id}`} className="inline-flex items-center justify-center h-12 px-8 border border-[#E4E7E2] text-[#183330] hover:bg-[#F4F2EA] text-[15px] font-medium rounded-md transition-colors w-full sm:w-auto">
            View Order Details
          </Link>

          {order.trackingNumber && (
            <Link href="/category/all" className="inline-flex items-center justify-center h-12 px-8 text-[#5F706C] hover:text-[#183330] hover:bg-[#F4F2EA] text-[15px] font-medium rounded-md transition-colors w-full sm:w-auto">
              Continue Shopping
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

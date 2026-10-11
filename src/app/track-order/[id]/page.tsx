import { OrderTrackingPage } from "@/components/tracking/OrderTrackingPage";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MainNavbar } from "@/components/MainNavbar";
import { Footer } from "@/components/gifting/Footer";

export const metadata = {
  title: "Track Your Order - giftT seller",
  description: "Track your giftT seller order status, estimated delivery, and courier information.",
};

export const instant = false;

export default async function TrackOrderIdRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <MainNavbar />
      <main className="flex-1">
        <OrderTrackingPage initialOrderId={id} />
      </main>
      <Footer />
    </div>
  );
}

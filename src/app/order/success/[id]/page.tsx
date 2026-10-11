import { Suspense } from "react";
import { OrderSuccessPage } from "@/components/checkout/OrderSuccessPage";
import { OrderSkeleton } from "@/components/checkout/OrderSkeleton";

export const instant = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderSuccessPage orderId={id} />
    </Suspense>
  );
}

import { CheckoutPage } from "@/components/checkout/CheckoutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Gifty",
  description: "Complete your thoughtful gift order securely.",
};

export default function Page() {
  return <CheckoutPage />;
}

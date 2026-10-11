import { CartPage } from "@/components/commerce/CartPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | Gifty",
  description: "Review your selected gifts and proceed to secure checkout.",
};

export default function Page() {
  return <CartPage />;
}

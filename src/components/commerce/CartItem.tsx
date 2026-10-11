import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { CartItem as CartItemType } from "@/data/cart";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity, personalisation } = item;

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const handleIncrement = () => {
    // Arbitrary max inventory limit for demo
    if (quantity < 10) {
      onUpdateQuantity(item.id, quantity + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-6 border-b border-[#E4E7E2]">
      {/* Product Image */}
      <Link href={product.href} className="shrink-0 group">
        <div className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] relative rounded-md overflow-hidden bg-[#F4F2EA]">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-2">
          <Link href={product.href} className="text-[#183330] font-medium text-[15px] sm:text-[16px] leading-snug hover:text-[#07514D] transition-colors">
            {product.title}
          </Link>
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 text-left sm:text-right shrink-0">
            <span className="font-semibold text-[#183330] text-[16px]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.compareAtPrice && (
              <span className="text-[#5F706C] text-[13px] line-through">
                ₹{product.compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Personalisation Summary */}
        {personalisation && personalisation.length > 0 && (
          <div className="bg-[#F4F2EA] p-3 rounded-[4px] mb-4 mt-1">
            <p className="text-[11px] uppercase tracking-widest text-[#5F706C] font-semibold mb-1.5">Personalisation</p>
            <div className="flex flex-col gap-1">
              {personalisation.map((p, idx) => (
                <div key={idx} className="flex items-start text-[13px] text-[#183330]">
                  <span className="text-[#5F706C] w-[120px] shrink-0">{p.label}:</span>
                  <span className="font-medium">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Info */}
        {product.deliveryInfo && (
          <div className="text-[13px] text-[#07514D] font-medium mb-4 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D2A01F]" />
            {product.deliveryInfo}
          </div>
        )}

        <div className="flex-1" />

        {/* Actions & Quantity */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-transparent sm:border-[#E4E7E2]/50 sm:pt-0 sm:mt-auto">
          {/* Quantity Control */}
          <div className="flex items-center border border-[#E4E7E2] rounded-[4px] bg-white h-9">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-9 h-full flex items-center justify-center text-[#5F706C] hover:text-[#183330] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-[14px] font-medium text-[#183330]">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= 10}
              className="w-9 h-full flex items-center justify-center text-[#5F706C] hover:text-[#183330] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-[#5F706C] hover:text-[#183330] hover:bg-[#F4F2EA] text-[13px] font-normal"
            >
              <Heart className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="h-8 px-2 text-[#5F706C] hover:text-[#c42c2c] hover:bg-red-50 text-[13px] font-normal"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

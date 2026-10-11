"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star, MapPin, Check, Plus, Minus, ShieldCheck, Gift, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/data/products";
import { useCart } from "@/components/commerce/CartContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [pinCode, setPinCode] = useState("");
  const [deliveryState, setDeliveryState] = useState<"idle" | "loading" | "available" | "unavailable" | "invalid">("idle");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Personalization State
  const [personalisationData, setPersonalisationData] = useState<Record<string, string>>({});

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      position: "bottom-center"
    });
  };

  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "inc" && quantity < (product.stock || 10)) {
      setQuantity(q => q + 1);
    } else if (type === "dec" && quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const checkDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 6 || !/^\d+$/.test(pinCode)) {
      setDeliveryState("invalid");
      setDeliveryMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    setDeliveryState("loading");
    setDeliveryMessage("Checking availability...");

    // Mock API Call
    setTimeout(() => {
      if (pinCode.startsWith("4")) {
        setDeliveryState("unavailable");
        setDeliveryMessage("Delivery isn't currently available to this location.");
      } else {
        setDeliveryState("available");
        setDeliveryMessage(product.sameDayAvailable ? "Same-day delivery available to " + pinCode : "Delivery by tomorrow to " + pinCode);
      }
    }, 1000);
  };

  const handleAddToCart = () => {
    // Validate required personalization
    if (product.personalisationOptions) {
      const missing = product.personalisationOptions.find(opt => opt.required && !personalisationData[opt.label]);
      if (missing) {
        toast.error(`Please provide ${missing.label} for personalisation.`, { position: "top-center" });
        return;
      }
    }

    setIsAddingToCart(true);

    const selectedPers = [];
    if (product.personalisationOptions) {
      for (const opt of product.personalisationOptions) {
        if (personalisationData[opt.label]) {
          selectedPers.push({ label: opt.label, value: personalisationData[opt.label] });
        }
      }
    }

    const newItem = {
      id: `${product.id}-${Date.now()}`, // Temporary unique ID; exact duplicates merged by Context
      productId: product.id,
      product: product,
      quantity,
      personalisation: selectedPers.length > 0 ? selectedPers : undefined
    };

    setTimeout(() => {
      addItem(newItem);
      setIsAddingToCart(false);
      toast.success(`${quantity}x ${product.title} added to cart`, {
        position: "top-center",
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart")
        }
      });
    }, 800);
  };

  return (
    <div className="flex flex-col w-full text-left">
      
      {/* Title & Metadata */}
      <div className="flex flex-col mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="font-heading text-[28px] md:text-[34px] leading-[1.15] text-[#183330] font-medium">
            {product.title}
          </h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleWishlist}
            className="shrink-0 w-11 h-11 rounded-full text-[#183330] hover:bg-[#F4F2EA]"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={cn("w-6 h-6 transition-colors", isWishlisted && "fill-[#D2A01F] text-[#D2A01F]")} 
              strokeWidth={isWishlisted ? 0 : 1.5}
            />
          </Button>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 text-[14px] text-[#5F706C] mb-4">
            <div className="flex items-center text-[#D2A01F]">
              <Star className="w-[16px] h-[16px] fill-current" />
            </div>
            <span className="font-medium text-[#183330]">{product.rating}</span>
            <span className="underline underline-offset-4 hover:text-[#183330] cursor-pointer">
              ({product.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-[24px] font-semibold text-[#183330]">
            {product.currency || "₹"}{product.price.toLocaleString("en-IN")}
          </span>
          {product.compareAtPrice && (
            <span className="text-[16px] text-[#5F706C] line-through">
              {product.currency || "₹"}{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
          )}
          {product.discountPercentage && (
            <span className="text-[13px] font-semibold text-[#D2A01F] tracking-wide ml-1">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>
        <span className="text-[13px] text-[#5F706C]">Inclusive of all taxes</span>
      </div>

      <Separator className="bg-[#E4E7E2] mb-8" />

      {/* Description Preview */}
      {product.description && (
        <div className="mb-8">
          <p className="text-[15px] text-[#5F706C] leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Personalisation Form */}
      {product.isPersonalised && product.personalisationOptions && (
        <div className="mb-8 p-5 bg-[#F4F2EA] border border-[#E4E7E2] rounded-lg flex flex-col gap-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[13px] font-bold tracking-widest text-[#183330] uppercase">Make it personal</h3>
          </div>
          
          {product.personalisationOptions.map((opt, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <Label htmlFor={`pers-${idx}`} className="text-[14px] font-medium text-[#183330]">
                  {opt.label} {opt.required && <span className="text-[#D2A01F]">*</span>}
                </Label>
                {opt.maxLength && (
                  <span className="text-[12px] text-[#5F706C]">
                    {(personalisationData[opt.label] || "").length} / {opt.maxLength}
                  </span>
                )}
              </div>
              
              {opt.type === "text" && (
                <Input 
                  id={`pers-${idx}`}
                  maxLength={opt.maxLength}
                  placeholder={`Enter ${opt.label.toLowerCase()}`}
                  className="bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] h-11"
                  value={personalisationData[opt.label] || ""}
                  onChange={(e) => setPersonalisationData({...personalisationData, [opt.label]: e.target.value})}
                />
              )}
              
              {opt.type === "photo" && (
                <div className="flex items-center justify-center w-full">
                  <label htmlFor={`pers-${idx}`} className="flex flex-col items-center justify-center w-full h-24 border-2 border-[#E4E7E2] border-dashed rounded-lg cursor-pointer bg-white hover:bg-[#FCFAF5] transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="text-[13px] font-medium text-[#07514D]">Click to upload photo</p>
                      <p className="text-[12px] text-[#5F706C] mt-1">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                    </div>
                    <input id={`pers-${idx}`} type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delivery Checker */}
      <div className="mb-8 flex flex-col gap-3">
        <h3 className="text-[14px] font-medium text-[#183330] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#5F706C]" /> Check Delivery
        </h3>
        <form onSubmit={checkDelivery} className="flex gap-3">
          <Input 
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            placeholder="Enter PIN code" 
            maxLength={6}
            className="h-12 bg-white border-[#E4E7E2] focus-visible:ring-[#07514D] max-w-[200px] text-[15px]"
          />
          <Button 
            type="submit" 
            variant="outline" 
            className="h-12 px-6 rounded-md border-[#E4E7E2] text-[#183330] hover:bg-[#F4F2EA] font-medium"
            disabled={deliveryState === "loading"}
          >
            Check
          </Button>
        </form>
        {deliveryMessage && (
          <p className={cn(
            "text-[13px] mt-1 font-medium flex items-start gap-1.5",
            deliveryState === "available" ? "text-[#07514D]" : 
            deliveryState === "invalid" || deliveryState === "unavailable" ? "text-red-700" : "text-[#5F706C]"
          )}>
            {deliveryState === "available" && <Check className="w-4 h-4 shrink-0 mt-0.5" />}
            {deliveryMessage}
          </p>
        )}
      </div>

      {/* Purchase Actions */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center gap-4">
          {/* Quantity */}
          <div className="flex items-center border border-[#E4E7E2] rounded-md h-12 w-[120px] bg-white shrink-0">
            <button 
              onClick={() => handleQuantity("dec")}
              className="w-10 h-full flex items-center justify-center text-[#183330] hover:bg-[#F4F2EA] disabled:opacity-50 transition-colors"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center text-[15px] font-medium text-[#183330]">{quantity}</span>
            <button 
              onClick={() => handleQuantity("inc")}
              className="w-10 h-full flex items-center justify-center text-[#183330] hover:bg-[#F4F2EA] disabled:opacity-50 transition-colors"
              disabled={quantity >= (product.stock || 10)}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 h-12 bg-[#07514D] hover:bg-[#043F3C] text-[#FCFAF5] font-medium text-[15px] rounded-md transition-all disabled:opacity-80"
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
        
        <Button 
          variant="outline"
          className="w-full h-12 border-[#183330] text-[#183330] hover:bg-[#F4F2EA] font-medium text-[15px] rounded-md transition-colors"
        >
          Buy Now
        </Button>
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#E4E7E2] mb-10">
        <div className="flex flex-col items-center text-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#07514D]" strokeWidth={1.5} />
          <span className="text-[12px] font-medium text-[#183330]">Secure Payments</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2 border-x border-[#E4E7E2]">
          <Truck className="w-6 h-6 text-[#07514D]" strokeWidth={1.5} />
          <span className="text-[12px] font-medium text-[#183330]">Pan-India Delivery</span>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Gift className="w-6 h-6 text-[#07514D]" strokeWidth={1.5} />
          <span className="text-[12px] font-medium text-[#183330]">Premium Packaging</span>
        </div>
      </div>

      {/* Accordions for Details */}
      <Accordion defaultValue={["details"]} className="w-full">
        <AccordionItem value="details" className="border-b border-[#E4E7E2] py-2">
          <AccordionTrigger className="text-[15px] font-medium text-[#183330] hover:no-underline hover:text-[#07514D] py-3">
            Product Details
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4 text-[14px] text-[#5F706C] leading-relaxed">
            {product.description || "Thoughtfully designed to create a lasting impression. This premium gift is meticulously crafted using high-quality materials to ensure it stands the test of time."}
            
            {product.specifications && (
              <div className="mt-6">
                <ul className="flex flex-col gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key} className="flex flex-col sm:flex-row sm:gap-4 border-b border-[#E4E7E2]/50 pb-2 last:border-0 last:pb-0">
                      <span className="text-[13px] font-medium text-[#183330] sm:w-[120px] shrink-0">{key}</span>
                      <span className="text-[14px] text-[#5F706C]">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="delivery" className="border-b border-[#E4E7E2] py-2">
          <AccordionTrigger className="text-[15px] font-medium text-[#183330] hover:no-underline hover:text-[#07514D] py-3">
            Delivery & Returns
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4 text-[14px] text-[#5F706C] leading-relaxed">
            <p className="mb-3">Standard delivery takes 3-5 business days. Same-day delivery is available in select cities for orders placed before 2 PM.</p>
            <p>Personalised items cannot be returned or exchanged unless there is a manufacturing defect or transit damage. Please record an unboxing video to claim transit damage.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}

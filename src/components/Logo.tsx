import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src="/logo.png" 
        alt="giftT seller logo" 
        className="h-8 md:h-10 w-auto object-contain"
      />
    </div>
  );
}

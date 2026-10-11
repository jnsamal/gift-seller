import { Check, Clock } from "lucide-react";
import { OrderTimelineEvent, OrderStatus } from "@/data/orders";
import { cn } from "@/lib/utils";

interface TrackingTimelineProps {
  timeline?: OrderTimelineEvent[];
  currentStatus: OrderStatus;
}

export function TrackingTimeline({ timeline, currentStatus }: TrackingTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-[14px] text-[#5F706C] p-4 bg-[#FCFAF5] rounded-md border border-[#E4E7E2]">
        Timeline details are currently unavailable. Current status: <span className="font-medium text-[#183330] capitalize">{currentStatus.replace("_", " ")}</span>
      </div>
    );
  }

  return (
    <div className="relative pl-3 md:pl-0">
      {/* Vertical line connecting nodes */}
      <div className="absolute left-[27px] top-[24px] bottom-[24px] w-[2px] bg-[#E4E7E2] z-0 md:left-[35px]" />

      <div className="flex flex-col gap-8 relative z-10">
        {timeline.map((event, index) => {
          const isCurrent = event.status === currentStatus;
          const isCompleted = event.completed;
          const isFuture = !isCompleted && !isCurrent;

          return (
            <div key={index} className={cn("flex gap-4 md:gap-6", isFuture ? "opacity-50" : "opacity-100")}>
              
              {/* Status Indicator */}
              <div className="relative flex flex-col items-center mt-1">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors z-10 shrink-0",
                    isCompleted ? "bg-[#07514D] border-[#07514D] text-white" : 
                    isCurrent ? "bg-white border-[#07514D] text-[#07514D]" : 
                    "bg-white border-[#E4E7E2] text-[#E4E7E2]"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 bg-[#07514D] rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-[#E4E7E2] rounded-full" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 pb-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 md:gap-4 mb-1">
                  <h3 className={cn(
                    "text-[16px] font-medium",
                    isCurrent ? "text-[#183330]" : 
                    isCompleted ? "text-[#183330]" : 
                    "text-[#5F706C]"
                  )}>
                    {event.label}
                  </h3>
                  {event.timestamp && (
                    <span className={cn(
                      "text-[13px] md:text-right shrink-0",
                      isCurrent ? "text-[#07514D] font-medium" : "text-[#5F706C]"
                    )}>
                      {event.timestamp}
                    </span>
                  )}
                </div>
                
                {event.description && (
                  <p className="text-[14px] text-[#5F706C] mt-1 leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

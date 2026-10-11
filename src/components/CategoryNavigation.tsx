"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { navigationItems, NavItem, MegaMenuColumn } from "@/data/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

function MegaMenu({ columns, featured }: { columns?: MegaMenuColumn[], featured?: NavItem["featured"] }) {
  if (!columns || columns.length === 0) return null;
  
  return (
    <div className="w-[100vw] lg:w-[760px] xl:w-[860px] max-w-screen-xl p-6 lg:p-8 flex gap-10 lg:gap-14 bg-white">
      {/* Columns */}
      <div className="flex gap-8 lg:gap-12 flex-1">
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col min-w-[140px]">
            <h3 className="text-[12px] font-semibold text-[#183330] mb-4 uppercase tracking-[0.08em]">{col.heading}</h3>
            <ul className="flex flex-col gap-3">
              {col.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <NavigationMenuLink render={<Link href={link.href} />} className="text-[14px] text-[#5F706C] hover:text-[#07514D] transition-colors flex items-center gap-2 group/link">
                    {link.label}
                    {link.badge && (
                      <span className="px-1.5 py-0.5 rounded-[4px] bg-[#EEF5F3] text-[#07514D] text-[10px] font-bold uppercase tracking-wider group-hover/link:bg-[#07514D] group-hover/link:text-[#FCFAF5] transition-colors">
                        {link.badge}
                      </span>
                    )}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Featured Area */}
      {featured && (
        <div className="w-[240px] shrink-0 border-l border-[#E4E7E2] pl-8 lg:pl-10 flex flex-col">
          <h3 className="text-[12px] font-semibold text-[#183330] mb-4 uppercase tracking-[0.08em]">{featured.title}</h3>
          
          {featured.image && (
             <NavigationMenuLink render={<Link href={featured.links[0]?.href || "#"} />} className="block mb-5 overflow-hidden rounded-[8px] group/feat">
               <div className="relative w-full aspect-[4/3] bg-[#F4F2EA]">
                 <img 
                   src={featured.image} 
                   alt={featured.title} 
                   className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/feat:scale-105" 
                 />
               </div>
             </NavigationMenuLink>
          )}

          <ul className="flex flex-col gap-3">
            {featured.links.map((link, lIdx) => (
              <li key={lIdx}>
                <NavigationMenuLink render={<Link href={link.href} />} className="text-[14px] font-medium text-[#183330] hover:text-[#D2A01F] transition-colors flex items-center gap-2 group/link">
                  {link.label}
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded-[4px] bg-[#F4F2EA] text-[#183330] text-[10px] font-bold uppercase tracking-wider group-hover/link:bg-[#D2A01F] group-hover/link:text-[#FCFAF5] transition-colors">
                      {link.badge}
                    </span>
                  )}
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function CategoryNavigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex w-full bg-[#FCFAF5] border-b border-[#E4E7E2] relative z-30 justify-center">
      <div className="container mx-auto px-4 flex justify-center">
        <NavigationMenu className="max-w-full justify-center">
          <NavigationMenuList className="gap-1 lg:gap-2">
            {navigationItems.map((item, idx) => {
              // Hide overflowing items depending on breakpoint
              let visibilityClass = "flex";
              if (idx >= 6 && idx < 8) visibilityClass = "hidden lg:flex";
              else if (idx >= 8 && idx < 10) visibilityClass = "hidden xl:flex";
              else if (idx >= 10) visibilityClass = "hidden"; // More menu

              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const isMegaMenu = item.type === "mega-menu";

              // Link styling matches brand
              const linkClass = cn(
                "group inline-flex h-12 w-max items-center justify-center bg-transparent px-3 py-2 text-[14px] font-medium transition-colors hover:text-[#D2A01F] hover:bg-transparent focus:bg-transparent focus:text-[#D2A01F] focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-transparent data-[state=open]:bg-transparent",
                isActive ? "text-[#D2A01F]" : "text-[#183330]"
              );

              if (isMegaMenu) {
                return (
                  <NavigationMenuItem key={idx} className={visibilityClass}>
                    <NavigationMenuTrigger className={cn(linkClass, "data-[state=open]:text-[#D2A01F]")}>
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <MegaMenu columns={item.columns} featured={item.featured} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }

              return (
                <NavigationMenuItem key={idx} className={visibilityClass}>
                  <NavigationMenuLink render={<Link href={item.href} />} data-active={isActive ? "" : undefined} className={linkClass}>
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
            
            {/* The "More" dropdown for items hidden on smaller screens */}
            <NavigationMenuItem className="flex">
              <NavigationMenuTrigger className="group inline-flex h-12 w-max items-center justify-center bg-transparent px-3 py-2 text-[14px] font-medium text-[#183330] transition-colors hover:text-[#D2A01F] focus:outline-none data-[state=open]:text-[#D2A01F]">
                More
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[200px] p-2 flex flex-col gap-1 bg-white">
                  {navigationItems.map((item, idx) => {
                    if (idx < 6) return null;
                    
                    let visibilityClass = "block";
                    if (idx >= 6 && idx < 8) visibilityClass = "lg:hidden block";
                    else if (idx >= 8 && idx < 10) visibilityClass = "xl:hidden block";

                    const isOffers = item.label === "Offers";
                    const itemClass = isOffers 
                      ? "text-[#D2A01F] font-medium hover:text-[#A87908]" 
                      : "text-[#5F706C] hover:text-[#183330]";

                    return (
                      <li key={idx} className={visibilityClass}>
                        <NavigationMenuLink render={<Link href={item.href} />} className={cn("block px-4 py-2.5 text-[14px] rounded-[6px] hover:bg-[#F4F2EA] transition-colors", itemClass)}>
                          {item.label}
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}

export function MobileCategoryNavigation({ children }: { children: React.ReactElement }) {
  return (
    <Sheet>
      <SheetTrigger render={children} />
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-[#FCFAF5] p-0 flex flex-col border-r border-[#E4E7E2]">
        <div className="flex flex-col h-full overflow-y-auto pt-10 pb-6 px-4">
          <Accordion className="w-full">
            {navigationItems.map((item, idx) => {
              if (item.type === "mega-menu" && item.columns) {
                return (
                  <AccordionItem value={item.label} key={idx} className="border-b border-[#E4E7E2]">
                    <AccordionTrigger className="text-[15px] font-medium text-[#183330] hover:no-underline py-4">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-6 pt-2 pb-4 pl-2">
                        {item.columns.map((col, cIdx) => (
                          <div key={cIdx} className="flex flex-col gap-3">
                            <h4 className="text-[13px] font-semibold text-[#183330] uppercase tracking-[0.08em]">{col.heading}</h4>
                            <ul className="flex flex-col gap-2.5">
                              {col.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                  <Link href={link.href} className="text-[14px] text-[#5F706C] hover:text-[#07514D] transition-colors flex items-center gap-2">
                                    {link.label}
                                    {link.badge && (
                                      <span className="px-1.5 py-0.5 rounded-[4px] bg-[#EEF5F3] text-[#07514D] text-[10px] font-bold uppercase tracking-wider">
                                        {link.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        
                        {item.featured && (
                          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-[#E4E7E2]">
                            <h4 className="text-[13px] font-semibold text-[#183330] uppercase tracking-[0.08em]">{item.featured.title}</h4>
                            <ul className="flex flex-col gap-2.5">
                            {item.featured.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                  <Link href={link.href} className="text-[14px] font-medium text-[#183330] hover:text-[#D2A01F] transition-colors flex items-center gap-2">
                                    {link.label}
                                    {link.badge && (
                                      <span className="px-1.5 py-0.5 rounded-[4px] bg-[#07514D] text-[#FCFAF5] text-[10px] font-bold uppercase tracking-wider">
                                        {link.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return (
                <div key={idx} className="border-b border-[#E4E7E2]">
                  <Link href={item.href} className="flex py-4 text-[15px] font-medium text-[#183330] hover:text-[#07514D] transition-colors">
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function NavbarSearch() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  return <NavbarSearchInput key={initialQuery} initialQuery={initialQuery} />;
}

function NavbarSearchInput({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
      <form 
        onSubmit={handleSearch}
        className={cn(
          "relative flex items-center w-full h-12 md:h-11 rounded-md border bg-muted/30 transition-all",
          isFocused ? "border-primary ring-1 ring-primary bg-background shadow-sm" : "border-border hover:border-primary/50"
        )}
      >
        <button type="submit" className="pl-4 pr-2 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors" aria-label="Submit search">
          <Search className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search gifts, occasions, recipients and more"
          className="flex-1 h-full bg-transparent border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-sm md:text-base px-2 text-foreground placeholder:text-muted-foreground"
          aria-label="Search for gifts"
        />
        {query && (
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => { 
              setQuery(""); 
              setIsFocused(true); 
              // Don't auto-redirect on clear, just let them type anew
            }}
            className="w-6 h-6 mr-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </form>

      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl overflow-hidden py-4">
          <div className="px-5 pb-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Popular Searches</h4>
            <ul className="flex flex-col gap-2">
              {["Birthday gifts", "Personalised gifts", "Anniversary gifts"].map((item) => (
                <li key={item}>
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-start gap-3 w-full h-9 font-normal text-sm px-2 hover:bg-muted/50 text-foreground"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{item}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="px-5 pt-3 border-t border-border/50">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {["Flowers", "Cakes", "Hampers", "Jewellery"].map((cat) => (
                <Badge 
                  key={cat} 
                  variant="secondary" 
                  className="px-3 py-1.5 font-medium cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => handleSuggestionClick(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

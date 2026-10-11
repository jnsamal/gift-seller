"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

/* ---------------------------------------------------------------------- */
/* Inline multi-step questionnaire */
/* ---------------------------------------------------------------------- */

type ShortcutMode = "letters" | "numbers";
const SHORTCUT_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface QuestionnaireContextValue {
  values: Record<string, string | string[]>;
  setValue: (name: string, value: string | string[]) => void;
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
  names: string[];
  errors: Record<string, string>;
  setError: (name: string, message: string | null) => void;
  requiredMap: Record<string, boolean>;
  setRequired: (name: string, required: boolean) => void;
  shortcuts?: ShortcutMode;
}

const QuestionnaireContext = React.createContext<QuestionnaireContextValue | null>(null);

function useQuestionnaireContext(component: string) {
  const ctx = React.useContext(QuestionnaireContext);
  if (!ctx) throw new Error(`<${component} /> must be used inside <Questionnaire>`);
  return ctx;
}

interface ItemContextValue {
  name: string;
  required?: boolean;
  multiple?: boolean;
  active: boolean;
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useItemContext(component: string) {
  const ctx = React.useContext(ItemContext);
  if (!ctx) throw new Error(`<${component} /> must be used inside <QuestionnaireItem>`);
  return ctx;
}

function collectItemNames(node: React.ReactNode, names: string[] = []): string[] {
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === QuestionnaireItem) {
      const name = (child.props as { name?: string }).name;
      if (name) names.push(name);
      return;
    }
    const childProps = child.props as { children?: React.ReactNode } | undefined;
    if (childProps?.children) collectItemNames(childProps.children, names);
  });
  return names;
}

interface QuestionnaireProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  defaultItem?: string;
  shortcuts?: ShortcutMode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
}

function Questionnaire({ defaultItem, shortcuts, onSubmit, className, children, ...props }: QuestionnaireProps) {
  const names = React.useMemo(() => collectItemNames(children), [children]);
  const [values, setValues] = React.useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [requiredMap, setRequiredMap] = React.useState<Record<string, boolean>>({});
  const [stepIndex, setStepIndex] = React.useState(() => {
    const index = defaultItem ? names.indexOf(defaultItem) : 0;
    return index >= 0 ? index : 0;
  });

  const setValue = React.useCallback((name: string, value: string | string[]) => {
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  const setError = React.useCallback((name: string, message: string | null) => {
    setErrors((current) => {
      if (!message) {
        if (!(name in current)) return current;
        const next = { ...current };
        delete next[name];
        return next;
      }
      return { ...current, [name]: message };
    });
  }, []);

  const setRequired = React.useCallback((name: string, required: boolean) => {
    setRequiredMap((current) => {
      if (current[name] === required) return current;
      return { ...current, [name]: required };
    });
  }, []);

  return (
    <QuestionnaireContext.Provider value={{ values, setValue, stepIndex, setStepIndex, names, errors, setError, requiredMap, setRequired, shortcuts }}>
      <form {...props} onSubmit={onSubmit} className={cn("flex flex-col gap-6 lg:gap-8", className)}>
        {children}
      </form>
    </QuestionnaireContext.Provider>
  );
}

function QuestionnaireItem({ name, required, multiple, children, className }: { name: string; required?: boolean; multiple?: boolean; children?: React.ReactNode; className?: string }) {
  const { names, stepIndex, setRequired } = useQuestionnaireContext("QuestionnaireItem");
  const active = names.indexOf(name) === stepIndex;

  React.useEffect(() => {
    setRequired(name, Boolean(required));
  }, [name, required, setRequired]);

  return (
    <ItemContext.Provider value={{ name, required, multiple, active }}>
      <fieldset className={cn("flex flex-col gap-4 lg:gap-6 border-0 p-0", !active && "hidden animate-out fade-out", active && "animate-in fade-in slide-in-from-bottom-2 duration-300", className)}>
        {children}
      </fieldset>
    </ItemContext.Provider>
  );
}

function QuestionnaireChoice({ value, shortcutIndex, className, children }: { value: string; shortcutIndex: number; className?: string; children?: React.ReactNode }) {
  const { values, setValue, shortcuts } = useQuestionnaireContext("QuestionnaireChoice");
  const itemCtx = useItemContext("QuestionnaireChoice");
  const { name, multiple, active, required } = itemCtx;

  const shortcutLabel = shortcuts === "letters" ? (SHORTCUT_LETTERS[shortcutIndex] ?? null) : shortcuts === "numbers" ? String(shortcutIndex + 1) : null;

  const currentValue = values[name];
  const checked = multiple ? Array.isArray(currentValue) && currentValue.includes(value) : currentValue === value;

  const handleChange = React.useCallback(() => {
    if (multiple) {
      const current = Array.isArray(values[name]) ? (values[name] as string[]) : [];
      const next = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value];
      setValue(name, next);
    } else {
      setValue(name, value);
    }
  }, [multiple, name, setValue, value, values]);

  React.useEffect(() => {
    if (!active || !shortcutLabel) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === shortcutLabel.toLowerCase()) handleChange();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, shortcutLabel, handleChange]);

  return (
    <label data-checked={checked ? "true" : undefined} className={cn("group relative flex cursor-pointer items-start justify-between gap-3 border transition-colors select-none", className)}>
      <input type={multiple ? "checkbox" : "radio"} name={name} value={value} checked={checked} onChange={handleChange} required={!multiple && Boolean(required)} className="sr-only" />
      <div className="flex flex-1 flex-col gap-1 mt-0.5">{children}</div>
      {shortcutLabel && (
        <span className="shrink-0 rounded-[4px] border border-current/20 px-1.5 py-[1px] font-mono text-[11px] text-muted-foreground group-data-[checked=true]:text-current">
          {shortcutLabel}
        </span>
      )}
    </label>
  );
}

/* ---------------------------------------------------------------------- */
/* Data Definitions */
/* ---------------------------------------------------------------------- */

interface Product {
  name: string;
  price: string;
  summary: string;
  image: { src: string; alt: string };
  traits: string[];
  button: { label: string; href: string };
}

interface FinderChoice {
  value: string;
  label: string;
  description?: string;
  traits?: string[];
  reason?: string;
}

const PRODUCTS: Product[] = [
  {
    name: "The Midnight Celebration Hamper",
    price: "₹2,499",
    summary: "A premium assortment of gourmet treats, artisanal candles, and elegant accessories packed in a keepsake deep teal box.",
    image: { src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop", alt: "Premium gift box with ribbon" },
    traits: ["for-her", "for-wife", "anniversary", "birthday", "1000-2500", "2500-plus"],
    button: { label: "View Hamper", href: "/product/midnight-celebration-hamper" }
  },
  {
    name: "Personalised Leather Wallet & Pen Set",
    price: "₹1,299",
    summary: "A sophisticated everyday essential. Top-grain leather wallet and a smooth-writing metal pen, elegantly monogrammed.",
    image: { src: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop", alt: "Leather wallet and pen" },
    traits: ["for-him", "for-husband", "for-dad", "birthday", "1000-2500"],
    button: { label: "Personalise Set", href: "/product/leather-wallet-pen" }
  },
  {
    name: "Handcrafted Brass Diya Set",
    price: "₹899",
    summary: "Bring warmth and light to their new home with this set of intricately carved heavy-gauge brass diyas.",
    image: { src: "https://images.unsplash.com/photo-1605808362572-c51ff91a5db6?q=80&w=800&auto=format&fit=crop", alt: "Lit brass diyas" },
    traits: ["housewarming", "festival", "for-mom", "for-friend", "500-1000"],
    button: { label: "View Diya Set", href: "/product/brass-diya-set" }
  },
  {
    name: "Gourmet Chocolates Box",
    price: "₹499",
    summary: "A beautifully arranged box of twelve assorted handmade truffles in dark, milk, and white chocolate.",
    image: { src: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop", alt: "Box of assorted chocolates" },
    traits: ["for-friend", "for-kids", "thank-you", "just-because", "under-500"],
    button: { label: "View Chocolates", href: "/product/gourmet-chocolates" }
  }
];

const QUESTIONS = [
  {
    name: "recipient",
    title: "Who is it for?",
    description: "Tell us who we are shopping for today.",
    multiple: false,
    choices: [
      { value: "her", label: "For Her", traits: ["for-her", "for-wife", "for-mom"], reason: "Curated specifically for the wonderful women in your life." },
      { value: "him", label: "For Him", traits: ["for-him", "for-husband", "for-dad"], reason: "Classic and thoughtful picks perfect for him." },
      { value: "kids", label: "For Kids", traits: ["for-kids"], reason: "Fun, sweet, and guaranteed to bring a smile." },
      { value: "friends", label: "For Friends", traits: ["for-friend"], reason: "Perfect for celebrating the people you choose." }
    ]
  },
  {
    name: "occasion",
    title: "What's the occasion?",
    description: "The reason behind the gift matters.",
    multiple: false,
    choices: [
      { value: "birthday", label: "Birthday or Anniversary", traits: ["birthday", "anniversary"], reason: "A celebratory gift designed to mark special milestones." },
      { value: "home", label: "Housewarming or Festival", traits: ["housewarming", "festival"], reason: "Traditional and warm, ideal for bringing light into a home." },
      { value: "casual", label: "Just Because or Thank You", traits: ["just-because", "thank-you"], reason: "A sweet gesture that doesn't need a grand occasion." }
    ]
  },
  {
    name: "budget",
    title: "What's your budget?",
    description: "We have something beautiful at every price point.",
    multiple: false,
    choices: [
      { value: "under-1000", label: "Under ₹1,000", traits: ["under-500", "500-1000"], reason: "Thoughtful and premium, without breaking the bank." },
      { value: "over-1000", label: "₹1,000 and above", traits: ["1000-2500", "2500-plus"], reason: "A luxurious selection designed to impress." }
    ]
  }
];

/* ---------------------------------------------------------------------- */
/* Main Component */
/* ---------------------------------------------------------------------- */

export function GiftFinder() {
  const [result, setResult] = React.useState<{ product: Product; reasons: string[] } | null>(null);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const picked: FinderChoice[] = [];
    for (const question of QUESTIONS) {
      const values = data.getAll(question.name).map((entry) => String(entry));
      for (const value of values) {
        const choice = question.choices?.find((entry) => entry.value === value);
        if (choice) picked.push(choice);
      }
    }

    const wanted = picked.flatMap((choice) => choice.traits ?? []);
    let best: Product | undefined;
    let bestScore = -1;
    
    for (const product of PRODUCTS) {
      const score = wanted.filter((trait) => product.traits?.includes(trait)).length;
      if (score > bestScore) {
        best = product;
        bestScore = score;
      }
    }

    if (!best) return;
    const winner = best;

    const reasons = picked
      .filter((choice) => (choice.traits ?? []).some((trait) => winner.traits?.includes(trait)))
      .map((choice) => choice.reason)
      .filter((reason): reason is string => Boolean(reason));

    setResult({ product: winner, reasons });
  };

  const restart = () => setResult(null);

  const shownImage = result?.product.image ?? {
    src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    alt: "Premium gift box with a ribbon"
  };

  return (
    <section className="py-[88px] lg:py-[112px] bg-[#F4F2EA] w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]">
        
        {/* Header */}
        <div className="mb-[40px] lg:mb-[64px] text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] lg:text-[12px] font-medium tracking-[0.14em] text-[#D2A01F] uppercase mb-4 block">
              GIFT FINDER
            </span>
            <h2 className="font-heading text-[32px] sm:text-[36px] lg:text-[44px] leading-[1.15] text-[#183330] font-medium max-w-[500px] mx-auto lg:mx-0">
              Three questions. One perfect gift.
            </h2>
          </div>
          <p className="text-[14px] lg:text-[16px] text-[#5F706C] leading-relaxed max-w-[420px] mx-auto lg:mx-0 lg:text-right">
            Tell us a little about the moment and we&apos;ll help you narrow it down to something they&apos;ll genuinely love.
          </p>
        </div>

        {/* Content Split */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 items-start">
          
          {/* Left: Image Panel */}
          <div className="order-2 lg:order-1 flex flex-col h-full">
            <div className="relative w-full aspect-[4/3] lg:aspect-[3/4] overflow-hidden rounded-[12px] bg-[#EEF5F3]">
              <img
                className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
                src={shownImage.src}
                alt={shownImage.alt}
              />
            </div>
            {result && (
              <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 px-1">
                <p className="text-[20px] font-medium tracking-tight text-[#183330]">
                  {result.product.name}
                </p>
                <p className="text-[18px] font-medium text-[#07514D]">
                  {result.product.price}
                </p>
              </div>
            )}
          </div>

          {/* Right: Interaction Panel */}
          <div className="order-1 lg:order-2 flex flex-col justify-center min-h-[400px]">
            {result ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full justify-center">
                <span className="text-[11px] font-medium tracking-[0.14em] text-[#D2A01F] uppercase mb-4 block">
                  YOUR MATCH
                </span>
                <p className="text-[18px] lg:text-[20px] leading-relaxed text-[#183330] font-medium mb-8">
                  {result.product.summary}
                </p>

                {result.reasons.length > 0 && (
                  <div className="mb-10">
                    <p className="text-[13px] font-bold tracking-[0.1em] text-[#5F706C] uppercase mb-4">
                      Why this one
                    </p>
                    <ul className="flex flex-col border-t border-[#E4E7E2]">
                      {result.reasons.map((reason, index) => (
                        <li key={index} className="border-b border-[#E4E7E2] py-4 text-[15px] leading-relaxed text-[#183330] flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#07514D] shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href={result.product.button.href} className={cn(buttonVariants({ variant: "default" }), "h-[50px] px-8 rounded-[8px] font-medium text-[15px] w-full sm:w-auto bg-[#07514D] text-[#FCFAF5] hover:bg-[#043F3C]")}>
                    {result.product.button.label} <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <Button variant="outline" onClick={restart} className="h-[50px] px-6 rounded-[8px] font-medium text-[15px] w-full sm:w-auto border-[#E4E7E2] text-[#183330] hover:bg-[#EEF5F3] hover:text-[#07514D]">
                    <RotateCcw className="w-4 h-4 mr-2" /> Answer Again
                  </Button>
                </div>
              </div>
            ) : (
              <Questionnaire defaultItem={QUESTIONS[0].name} shortcuts="numbers" onSubmit={handleSubmit} className="flex-1 justify-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium tracking-[0.14em] text-[#D2A01F] uppercase">
                    QUICK QUIZ
                  </span>
                  <QuestionnaireContext.Consumer>
                    {(ctx) => ctx ? (
                      <span className="text-[13px] font-medium text-[#5F706C]">
                        Step {ctx.stepIndex + 1} of {ctx.names.length}
                      </span>
                    ) : null}
                  </QuestionnaireContext.Consumer>
                </div>

                <div className="w-full bg-[#E4E7E2] h-1 rounded-full mb-6 overflow-hidden">
                  <QuestionnaireContext.Consumer>
                    {(ctx) => ctx ? (
                      <div className="h-full bg-[#D2A01F] transition-all duration-500 ease-out" style={{ width: `${((ctx.stepIndex + 1) / ctx.names.length) * 100}%` }} />
                    ) : null}
                  </QuestionnaireContext.Consumer>
                </div>

                {QUESTIONS.map((question, index) => (
                  <QuestionnaireItem key={index} name={question.name} required={!question.multiple} multiple={question.multiple}>
                    <div className="mb-2">
                      <legend className="text-[24px] lg:text-[28px] font-medium tracking-tight text-[#183330] mb-2">
                        {question.title}
                      </legend>
                      {question.description && (
                        <p className="text-[15px] text-[#5F706C]">
                          {question.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {question.choices.map((choice, choiceIndex) => (
                        <QuestionnaireChoice 
                          key={choiceIndex} 
                          shortcutIndex={choiceIndex}
                          value={choice.value} 
                          className="rounded-[8px] p-4 text-[15px] border-[#E4E7E2] bg-white text-[#5F706C] hover:border-[#07514D] data-[checked=true]:border-[#07514D] data-[checked=true]:bg-[#EEF5F3] data-[checked=true]:text-[#043F3C] transition-all duration-200"
                        >
                          <span className="font-medium text-[15px]">
                            {choice.label}
                          </span>
                        </QuestionnaireChoice>
                      ))}
                    </div>
                    
                    <QuestionnaireContext.Consumer>
                      {(ctx) => ctx && ctx.errors[question.name] ? (
                        <p className="text-[13px] font-medium text-[#D2A01F] animate-in fade-in">{ctx.errors[question.name]}</p>
                      ) : null}
                    </QuestionnaireContext.Consumer>
                  </QuestionnaireItem>
                ))}

                <div className="flex items-center gap-3 mt-6">
                  <QuestionnaireContext.Consumer>
                    {(ctx) => ctx && ctx.stepIndex > 0 ? (
                      <Button type="button" variant="outline" onClick={() => ctx.setStepIndex((c) => Math.max(0, c - 1))} className="h-[48px] px-6 rounded-[8px] font-medium border-[#E4E7E2] text-[#5F706C] hover:text-[#183330]">
                        Back
                      </Button>
                    ) : null}
                  </QuestionnaireContext.Consumer>
                  
                  <QuestionnaireContext.Consumer>
                    {(ctx) => {
                      if (!ctx) return null;
                      const { stepIndex, names, setStepIndex, values, setError, requiredMap } = ctx;
                      const isLast = stepIndex >= names.length - 1;
                      
                      if (isLast) {
                        return (
                          <Button type="submit" className="h-[48px] px-8 rounded-[8px] font-medium bg-[#07514D] text-[#FCFAF5] hover:bg-[#043F3C] flex-1">
                            Find My Gift <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        );
                      }

                      return (
                        <Button 
                          type="button" 
                          onClick={() => {
                            const currentName = names[stepIndex];
                            const value = values[currentName];
                            const empty = value === undefined || (Array.isArray(value) && value.length === 0);
                            if (requiredMap[currentName] && empty) {
                              setError(currentName, "Please select an option to continue.");
                              return;
                            }
                            setError(currentName, null);
                            setStepIndex((c) => Math.min(names.length - 1, c + 1));
                          }} 
                          className="h-[48px] px-8 rounded-[8px] font-medium bg-[#183330] text-[#FCFAF5] hover:bg-[#07514D] flex-1"
                        >
                          Next <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      );
                    }}
                  </QuestionnaireContext.Consumer>
                </div>
              </Questionnaire>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

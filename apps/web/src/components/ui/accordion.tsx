"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionContextValue = {
  value: string | null;
  setValue: (value: string | null) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<string | null>(null);

type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: "single";
  collapsible?: boolean;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue ?? null);
    const resolvedValue = value ?? internalValue;

    const setValue = React.useCallback(
      (nextValue: string | null) => {
        if (value === undefined) {
          setInternalValue(nextValue);
        }
        if (nextValue) {
          onValueChange?.(nextValue);
        }
      },
      [onValueChange, value]
    );

    return (
      <AccordionContext.Provider value={{ value: resolvedValue, setValue }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => (
    <AccordionItemContext.Provider value={value}>
      <div ref={ref} className={cn("border-b", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const accordion = React.useContext(AccordionContext);
    const itemValue = React.useContext(AccordionItemContext);
    const isOpen = accordion?.value === itemValue;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-all hover:underline",
          className
        )}
        onClick={() => {
          if (!accordion || !itemValue) {
            return;
          }
          accordion.setValue(isOpen ? null : itemValue);
        }}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const accordion = React.useContext(AccordionContext);
    const itemValue = React.useContext(AccordionItemContext);
    const isOpen = accordion?.value === itemValue;

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden text-sm", !isOpen && "hidden", className)}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

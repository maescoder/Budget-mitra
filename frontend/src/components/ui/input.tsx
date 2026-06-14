import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-xl border border-outline-variant/40 bg-white/45 px-4 py-2 text-sm text-on-surface shadow-xs transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-on-surface-variant/60 font-semibold focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary",
        className
      )}
      {...props}
    />
  )
}

export { Input }

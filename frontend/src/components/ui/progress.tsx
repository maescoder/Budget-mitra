import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-surface-container relative h-2.5 w-full overflow-hidden rounded-full border border-outline-variant/10",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-gradient-to-r from-secondary to-primary h-full w-full flex-1 transition-all relative"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      >
        <div className="absolute top-0 right-0 w-4 h-full bg-white/20 animate-pulse"></div>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }

"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ComponentRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center w-full gap-2 has-[:disabled]:opacity-50 ",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ComponentRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex w-full items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

// const InputOTPSlot = React.forwardRef<
//   React.ComponentRef<"div">,
//   React.ComponentPropsWithoutRef<"div"> & { index: number }
// >(({ index, className, ...props }, ref) => {
//   const inputOTPContext = React.useContext(OTPInputContext)
//   const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

//   return (
//     <div
//       ref={ref}
//       className={cn(
//         "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
//         isActive && "z-10 ring-1 ring-ring",
//         className
//       )}
//       className={cn(
//         "relative flex w-full h-12 min-w-8 items-center ring-1 ring-slate-100 justify-center bg-white border-0 shadow-[0_0_50px_-10px_#1f6c75] text-lg outline-none first:rounded-l-full transition-all last:rounded-r-full focus-within:ring-4 focus-within:ring-primary ",
//         isActive && "z-10 ring-4 ring-primary",
//         className
//       )}

//       {...props}
//     >
//       {char}
//       {hasFakeCaret && (
//         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//           <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
//         </div>
//       )}
//     </div>
//   )
// })
const InputOTPSlot = React.forwardRef<
  React.ComponentRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number; variant?: "normal" | "stylish" }
>(({ index, className, variant = "normal", ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  const baseStyles =
    variant === "normal"
      ? "relative flex w-full h-full min-h-9 min-w-8  items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md"
      : "relative flex w-full h-12 min-w-8 items-center ring-1 ring-slate-100 justify-center bg-white border-0 shadow-[0_0_50px_-10px_#1f6c75] text-lg outline-none first:rounded-l-full transition-all last:rounded-r-full focus-within:ring-4 focus-within:ring-primary"

  const activeRing = isActive
    ? variant === "normal"
      ? " z-10 ring-1 ring-ring"
      : "z-10 ring-4 ring-primary"
    : ""

  return (
    <div
      ref={ref}
      className={cn(baseStyles, activeRing, className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})

InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ComponentRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

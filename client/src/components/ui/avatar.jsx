import React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

// Avatar component ko define karte hain
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      // Yahan pe hum ek mast gradient background add kar rahe hain
      "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500",
      // Glass effect ke liye backdrop blur aur transparency
      "backdrop-blur-xl bg-opacity-30 border border-white/30",
      // Thoda sa shadow taki avatar pop kare
      "shadow-lg shadow-purple-500/20",
      // Hover pe cool animation
      "transition-all duration-300 ease-in-out hover:shadow-purple-500/40 hover:scale-105",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// Avatar ke andar image ke liye component
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// Agar image nahi load hui to ye fallback dikhega
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      // Fallback ke liye bhi wohi mast gradient
      "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500",
      "text-sm font-medium text-white",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };


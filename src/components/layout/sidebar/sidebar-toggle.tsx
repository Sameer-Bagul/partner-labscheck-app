import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible absolute top-3 -right-3 z-[100]">
      <Button
        onClick={() => setIsOpen?.()}
        className="rounded-full w-7 h-7 bg-gradient-to-br from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 p-0"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 text-white transition-transform ease-in-out duration-300",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}

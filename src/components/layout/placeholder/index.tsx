import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderContentProps {
  children: ReactNode;
}

export default function PlaceholderContent({ children }: PlaceholderContentProps) {
  return (
    <Card className="rounded-2xl border border-purple-100/50 mt-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-4 sm:p-8">
        <div className="flex justify-center items-start min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="w-full flex flex-col relative">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

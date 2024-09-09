"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const [dark, setDark] = useState(true);
  const { setTheme } = useTheme();

  return (
    <Button variant="outline" size="icon">
      <Sun
        className={cn(
          !dark ? "visible" : "hidden",
          "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        )}
        onClick={() => {
          setDark(true);
          setTheme("dark");
        }}
      />
      <Moon
        className={cn(
          dark ? "visible" : "hidden",
          "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        )}
        onClick={() => {
          setDark(false);
          setTheme("light");
        }}
      />
    </Button>
  );
}

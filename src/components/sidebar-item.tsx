"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: ReactNode;
  title: string;
  href: string;
}

function SidebarItem({ icon, title, href }: SidebarItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;
  return (
    <div
      className={cn(
        "md:flex md:items-center md:gap-x-2 w-full cursor-pointer md:py-6 md:pl-5",
        selected
          ? "text-orange-600 border-r-2 border-orange-600 bg-orange-100 dark:bg-orange-950"
          : "text-slate-500"
      )}
      onClick={() => router.push(href)}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="md:hidden flex justify-center w-full py-6 px-7">
              {icon}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-lg w-full">{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="hidden md:block">{icon}</div>
      <div className="text-xl hidden md:block">{title}</div>
    </div>
  );
}

export default SidebarItem;

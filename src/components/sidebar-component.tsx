import React, { ReactNode } from "react";

function SidebarComponent({ children }: { children: ReactNode }) {
  return (
    <div className="border-r pt-28 min-h-screen w-20 md:w-52 fixed top-0 left-0 bg-background">
      {children}
    </div>
  );
}

export default SidebarComponent;

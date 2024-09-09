import Appbar from "@/components/appbar";
import SidebarComponent from "@/components/sidebar-component";
import SidebarItem from "@/components/sidebar-item";
import { BookOpenText, Pencil, Search } from "lucide-react";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Appbar />
      <div className="flex">
        <SidebarComponent>
          <SidebarItem title="Browse" href="/browse" icon={<Search />} />
          <SidebarItem
            title="Dashboard"
            href="/dashboard"
            icon={<BookOpenText />}
          />
          <SidebarItem
            title="Create"
            href="/creator/courses"
            icon={<Pencil />}
          />
        </SidebarComponent>
        {children}
      </div>
    </div>
  );
}

export default Layout;

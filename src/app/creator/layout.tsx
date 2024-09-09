import Appbar from "@/components/appbar";
import SidebarComponent from "@/components/sidebar-component";
import SidebarItem from "@/components/sidebar-item";
import {
  ArrowBigLeft,
  ChartColumnIncreasing,
  Goal,
  UserRoundPen,
} from "lucide-react";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      <Appbar />
      <div className="flex">
        <SidebarComponent>
          <SidebarItem
            title="Profile"
            href="/creator/profile"
            icon={<UserRoundPen />}
          />
          <SidebarItem
            title="Courses"
            href="/creator/courses"
            icon={<Goal />}
          />
          <SidebarItem
            title="Analytics"
            href="/creator/analytics"
            icon={<ChartColumnIncreasing />}
          />
          <SidebarItem title="Exit" href="/dashboard" icon={<ArrowBigLeft />} />
        </SidebarComponent>
        <div className="mt-28 ml-20 md:ml-52 w-full">{children}</div>
      </div>
    </div>
  );
}

export default Layout;

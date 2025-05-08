"use client";

import { useState, useEffect } from "react";

import { NavUser } from "@/components/sidebar/nav-user.jsx";
import { Sidebar, SidebarRail, SidebarHeader } from "@/components/ui/sidebar";

export function AppSidebar({ children, ...props }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  if (!userData) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser
          user={{
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
          }}
        />
      </SidebarHeader>
      <SidebarRail />
      {children}
    </Sidebar>
  );
}

import { useState } from "react";

export const useSidebar = (isMobile) => {
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setCollapsedSidebar((prev) => !prev);
    }
  };

  return { sidebarOpen, collapsedSidebar, toggleSidebar };
};

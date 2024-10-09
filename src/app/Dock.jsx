import React, { useEffect, useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { useRouter } from "next/navigation";
import {
  IconHome,
  IconUser,
  IconUpload,
  IconLogout,
  IconRobot,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useSession,signOut } from "next-auth/react";

const FloatingDockDemo = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (!session) {
    return null; // Do not render the dock if the user is not logged in
  }

  const username = session?.user?.username;
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => router.push("/"),
    },
    {
      title: "Posts",
      icon: (
        <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => router.push("/posts"),
    },
    {
      title: "Profile",
      icon: (
        <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => router.push(`/dashboard/${username}`),
    },
    {
      title: "Upload",
      icon: (
        <IconUpload className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => router.push("/upload"),
    },
    {
      title: "Logout",
      icon: (
        <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => signOut()
    },
    {
      title: "AI",
      icon: (
        <IconRobot className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => router.push("/create"),
    },
    {
      title: isDarkMode ? "Light Mode" : "Dark Mode",
      icon: isDarkMode ? (
        <IconSun className="h-full w-full text-yellow-500" />
      ) : (
        <IconMoon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => setIsDarkMode(!isDarkMode),
    },
  ];

  return (
    <div className="flex items-center justify-center w-full relative">
      <FloatingDock
        // only for demo, remove for production
        mobileClassName="translate-y-20"
        items={links}
      />
    </div>
  );
};

export default FloatingDockDemo;
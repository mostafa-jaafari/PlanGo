"use client";
import { BadgeHelp, Cog, House, Search, Trash2 } from "lucide-react";
import { GlobalLogo } from "./GlobalLogo";
import { SideBar_General } from "./SideBar_General";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchComponent from "./SearchComponent";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const Top_Sidebar_Links = [
    {
      name: "Home",
      icon: <House size={16} />,
      href: "/"
    },
    {
      name: "Search",
      icon: <Search size={16} />,
      href: "#"
    }
  ]
  const Bottom_Sidebar_Links = [
    {
      name: "Settings",
      icon: <Cog size={16} />,
      href: "/settings"
    },
    {
      name: "Help",
      icon: <BadgeHelp size={16} />,
      href: "/help"
    },
    {
      name: "Trash",
      icon: <Trash2 size={16} />,
      href: "/trash"
    },{
      name: "Tasks",
      icon: <BadgeHelp size={16} />,
      href: "/tasks"
    },
  ]
  const [SelectedLink, setSelectedLink] = useState<string>('');
  const pathname = usePathname();
  useEffect(() => {
    if(pathname === "/"){
      setSelectedLink('/');
    }
    // else if(pathname === "/settings"){
    //   setSelectedLink('settings');
    // }else if(pathname === "/help"){
    //   setSelectedLink('help');
    // }else if(pathname.startsWith("/trash")){
    //   setSelectedLink('trash');
    // }else{
    //   setSelectedLink('');
    // }
  },[pathname])
  const [IsSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <main 
      className="min-w-64 h-max sticky top-2 bg-neutral-900 overflow-hidden
        rounded-lg border border-neutral-800">
        <section 
          className="border-b border-neutral-800 w-full py-2 px-4">
            <GlobalLogo />
        </section>
        <section className="-space-y-4">
          <ul className="px-4 py-2 flex flex-col gap-1 mb-2">
            {Top_Sidebar_Links.map((link, index) => (
              <Link 
                key={index} 
                href={link.href}
                className={`flex hover:bg-neutral-800 rounded-lg 
                  cursor-pointer p-2 items-center gap-2 text-sm
                  ${SelectedLink === link.href ? "bg-neutral-800 text-white" : "text-neutral-400"}
                  `}>
                  {link.icon}
                  {link.name}
              </Link>
            ))}
          </ul>
          <SideBar_General />
        </section>
        <section>
          <ul className="px-4 py-2 flex flex-col gap-1 mt-2">
            {Bottom_Sidebar_Links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex rounded-lg 
                  cursor-pointer p-2 items-center gap-2 text-sm
                  ${link.name.toLowerCase() === "trash" ? "text-red-600 hover:bg-red-600 hover:text-white" : "hover:bg-neutral-800"}`}>
                    {link.icon} {link.name}
              </Link>
            ))}
          </ul>
        </section>
        {IsSearchOpen && (
          <SearchComponent 
            IsSearchOpen={IsSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
          />
        )}
    </main>
  );
}
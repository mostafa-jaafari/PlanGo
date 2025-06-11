'use client';
import { House, Search } from "lucide-react";
import { GlobalLogo } from "./GlobalLogo";
import { SideBar_General } from "./SideBar_General";

export default function SideBar() {
  return (
    <main 
      className="min-w-64 bg-neutral-900 overflow-hidden
        rounded-lg border border-neutral-800">
        <section 
          className="border-b border-neutral-800 w-full py-2 px-4">
            <GlobalLogo />
        </section>
        <section className="-space-y-4">
          <ul className="px-4 py-2 flex flex-col gap-1">
            <li 
              className="flex hover:bg-neutral-800 rounded-lg cursor-pointer p-2 items-center gap-2 text-sm"><Search size={16} />Search</li>
            <li 
              className="flex hover:bg-neutral-800 rounded-lg cursor-pointer p-2 items-center gap-2 text-sm"><House size={16} />Home</li>
          </ul>
          <SideBar_General />
        </section>
    </main>
  );
}
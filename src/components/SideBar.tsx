import { BadgeHelp, Cog, House, Search, Trash2 } from "lucide-react";
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
          <ul className="px-4 py-2 flex flex-col gap-1 mb-2">
            <li 
              className="flex hover:bg-neutral-800 rounded-lg cursor-pointer p-2 items-center gap-2 text-sm"><Search size={16} />Search</li>
            <li 
              className="flex hover:bg-neutral-800 rounded-lg cursor-pointer p-2 items-center gap-2 text-sm"><House size={16} />Home</li>
          </ul>
          <SideBar_General />
        </section>
        <section>
          <ul className="px-4 py-2 flex flex-col gap-1 mt-2">
            <li 
              className="flex hover:bg-neutral-800 rounded-lg 
                cursor-pointer p-2 items-center gap-2 text-sm">
                  <Cog size={16} /> Settings
            </li>
            <li 
              className="flex hover:bg-neutral-800 rounded-lg 
                cursor-pointer p-2 items-center gap-2 text-sm">
                  <BadgeHelp size={16} /> Help
            </li>
            <li 
              className="flex hover:bg-red-800 rounded-lg text-red-600
                cursor-pointer p-2 items-center gap-2 text-sm hover:text-white">
                  <Trash2 size={16} /> Trash
            </li>
          </ul>
        </section>
    </main>
  );
}
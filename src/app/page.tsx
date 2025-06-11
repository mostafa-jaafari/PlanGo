import { ToDoLists } from "@/components/Fake_Data";
import SideBar from "@/components/SideBar";
import { ArrowUp, Paperclip, Sunset } from "lucide-react";
// import DynamicPageRendering from "./DynamicPgaeRendering";

export default function Home() {
  return (
    <main className="w-full flex gap-4 p-2">
      <section className="w-full py-20 px-30">
        <div className="flex items-center gap-2 w-full flex justify-center items-center">
          <Sunset size={30} />
          <h1 className="text-2xl text-neutral-500">
            Good evening, 
            <span className="text-3xl font-semibold text-neutral-200">
              Mostafa Jaafari
            </span>
          </h1>
        </div>
        <div className="bg-neutral-900 mt-6 border border-neutral-800 rounded-lg overflow-hidden">
          <textarea 
            placeholder="Write your note here..."
            rows={5}
            className="group p-4 resize-none w-full
              outline-none focus:border-neutral-700">
          </textarea>
          <div className="w-full px-4 py-2 flex items-center justify-between">
            text test
            <div className="flex items-center gap-4">
              <span className="flex cursor-pointer w-max p-1 rounded-lg hover:bg-neutral-700/50">
                <Paperclip size={16} />
              </span>
              <span 
                className="flex cursor-pointer w-max p-1 
                  rounded-full bg-yellow-600 hover:bg-neutral-800 transition-all duration-200">
                <ArrowUp size={20} />
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Search, FileText } from "lucide-react";


export default function SearchComponent({ setIsSearchOpen, IsSearchOpen } : { setIsSearchOpen: (isOpen: boolean) => void; IsSearchOpen: boolean }) {
    const SearchRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
        if (IsSearchOpen) {
        // Slight delay to ensure smooth animation
        setTimeout(() => setIsVisible(true), 20);
        } else {
        setIsVisible(false);
        }
    }, [IsSearchOpen]);

    useEffect(() => {
      const HandleHideSearch = (e: MouseEvent) => {
            if(SearchRef.current && !SearchRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", HandleHideSearch);
        return () => {
            document.removeEventListener("mousedown", HandleHideSearch);
        }
    },[])
    
    // Keep component mounted for exit animation
    if (!IsSearchOpen && !isVisible) return null;
    
    return (
        <main 
            className="w-full h-screen bg-black/40 fixed top-0 left-0 z-50
                flex justify-center items-center">
            <section 
                ref={SearchRef}
                className="h-[80vh] w-[800px] rounded-xl bg-neutral-900 border border-neutral-800
                overflow-x-hidden overflow-y-scroll">
                <div>
                    <div 
                        className={`flex items-center pl-4 border-b border-neutral-800 transition-all duration-300 
                            ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <Search 
                            className="text-neutral-700" 
                            size={20} />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search notes..."
                            className="w-full h-12 px-4 bg-transparent text-white 
                            outline-none placeholder:text-neutral-700"
                            onFocus={() => setIsSearchOpen(true)}
                        />
                    </div>
                    <div className={`transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="p-4 space-y-2">
                            {Array(8).fill(0).map((_, index) => (
                                <div
                                    key={index}
                                    className="text-neutral-400 px-2 py-2 flex 
                                    items-center gap-2 hover:bg-neutral-800/50 border 
                                    border-transparent hover:border-neutral-800 
                                    rounded-lg transition-colors cursor-pointer">
                                    <FileText size={25} /> <h2 className="text-sm font-semibold">Note Title {index + 1}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
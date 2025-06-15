"use client";

import { useEffect, useRef, useState } from "react";



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
                        className={`transition-all duration-300 
                            ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="w-full h-12 px-4 bg-transparent text-white 
                            outline-none border-b border-neutral-800"
                            onFocus={() => setIsSearchOpen(true)}
                        />
                    </div>
                    {/* <div className={`transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="p-4 space-y-4">
                            {Array(8).fill(0).map((_, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer">
                                    <h2 className="text-white text-lg">Note Title {index + 1}</h2>
                                    <p className="text-neutral-400 text-sm">This is a brief description of the note content.</p>
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>
            </section>
        </main>
    )
}
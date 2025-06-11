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
            ref={SearchRef}
            className={`fixed z-50 h-screen left-0 w-full bg-black overflow-y-scroll rounded-2xl
              transform transition-transform duration-500 ease-in-out
              ${isVisible ? "-translate-y-94" : "translate-y-full"}`}>
            <section className="h-[300vh]">
                <button onClick={() => setIsSearchOpen(false)}>
                    setIsSearchOpen : {IsSearchOpen ? "true" : "false"}
                </button>
            </section>
        </main>
    )
}
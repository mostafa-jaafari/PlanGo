"use client";
import { useRef, useState } from "react";
import { Save } from "lucide-react";

export default function Note_Page() {
    const textareaRef = useRef(null);
    const inputTitleRef = useRef(null);
    const [isFilledTitle, setisFilledTitle] = useState(false);

    const handleInput = () => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleInputTitle = () => {
        setisFilledTitle(inputTitleRef.current.value.length > 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // منع النزول لسطر جديد داخل الـ input
            textareaRef.current.focus();
        }
    };
    return (
        <main>
            <section className="w-full flex items-center justify-end">
                <button 
                    className="py-1 px-2 rounded-lg cursor-pointer flex items-center gap-1
                        bg-yellow-600 hover:bg-yellow-600/50 transition-all duration-200">
                    <Save size={20} /> <span className="text-white">Save Note</span>
                </button>
            </section>
            <section className={`w-full h-full space-y-8 p-4`}>
                
                <input
                    className="w-full bg-transparent border-none outline-none 
                        px-4 text-white text-4xl font-semibold"
                    type="text"
                    ref={inputTitleRef}
                    onChange={handleInputTitle}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    placeholder="Type Title..."
                />
                <div
                    style={{
                        transition: "max-height 0.3s ease, opacity 0.3s ease",
                        overflow: "hidden",
                        maxHeight: !isFilledTitle && "0",
                        opacity: isFilledTitle ? 1 : 0,
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        onInput={handleInput}
                        className="w-full border-none outline-none px-4 mt-2 
                        resize-none text-neutral-400"
                        placeholder="Type Description..."
                        style={{
                            transition: "opacity 0.3s ease",
                            opacity: isFilledTitle ? 1 : 0,
                        }}
                        disabled={!isFilledTitle}
                    ></textarea>
                </div>
            </section>
        </main>
    );
}

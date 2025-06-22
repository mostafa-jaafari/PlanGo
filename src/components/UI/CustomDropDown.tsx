"use client";
import { ChevronDown, EllipsisVertical, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/FireBase";
import { toast, Toaster } from "sonner";

interface CustomDropDownProps {
    options: string[];
    // onSelect: (option: string) => void;
    title: string;
    icon: React.ReactNode;
    itemicon?: React.ReactNode;
    isLoading?: boolean;
    uuid: string[];
}
export function CustomDropDown({ options, title, icon, itemicon, isLoading, uuid } : CustomDropDownProps) {
    const [IsOpen, setIsOpen] = useState(false);
    const [IsOptionsOpen, setIsOptionsOpen] = useState<number | null>(null);
    const OptionsMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (OptionsMenuRef.current && !OptionsMenuRef.current.contains(event.target as Node)) {
                setIsOptionsOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[])
    const Current_User = useSession();
    const userEmail = Current_User.data?.user?.email;
    async function HandleDeleteNote(index: number) {
        if(userEmail){
            const userDocRef = doc(db, "users", userEmail);
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) return;
            const data = docSnap.data();
            const notes = data.notes || [];

            if (index < 0 || index >= notes.length) return; // تحقق من أن المؤشر صحيح

            notes.splice(index, 1); // حذف العنصر من المصفوفة

            await updateDoc(userDocRef, { notes });
            toast.success("✅ Note deleted successfully!");
        }
}
    return (
        <section 
            className="text-sm p-2">
                <Toaster
                    position="top-center"
                />
            <button 
                className="group w-full flex items-center justify-between 
                    gap-2 px-4 py-2
                    text-white rounded-lg focus:outline-none focus:ring-1
                    focus:ring-neutral-800 hover:bg-neutral-800">
                <span 
                    onClick={() => setIsOpen(!IsOpen)}
                    className="flex w-full items-center gap-2 text-white">
                    {icon} <Link 
                                href={`/${title.toLowerCase().replace(' ', '')}`} 
                                className='hover:underline w-max'>
                                    {title}
                            </Link>
                </span> 
                <div className="flex items-center gap-1">
                    <Link 
                        className="p-0.5 cursor-pointer hidden group-hover:flex 
                            rounded hover:bg-neutral-700/50"
                        href={title.toLowerCase() === 'notes' ? '/notes/new' : '/tasks/new'}>
                        <Plus size={14} />
                    </Link>
                    <span 
                        onClick={() => setIsOpen(!IsOpen)}
                        className="hover:bg-neutral-700/50 p-0.5 rounded">
                        <ChevronDown
                            className={`transition-all duration-200 ${!IsOpen && "-rotate-90"}`} 
                            size={16}
                        />
                    </span>
                </div>
            </button>
            {isLoading && IsOpen && options?.length > 0 ?
            (
                <div className="w-full flex px-6">
                    <ul className="w-full border-l border-neutral-800 px-2">
                        {[...Array(4)].map((_, index) => (
                            <li
                                key={index}
                                className={`w-full px-2 py-1 rounded-lg flex items-center justify-between ${index === 0 && "mt-2"}`}
                            >
                                <span className="w-full flex items-center gap-2">
                                    <span className="inline-block h-4 w-4 bg-neutral-700 rounded-full animate-pulse"></span>
                                    <span className="h-4 w-24 bg-neutral-700 rounded animate-pulse"></span>
                                </span>
                                <span className="h-4 w-4 bg-neutral-700 rounded animate-pulse"></span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) 
            :
            IsOpen && (
                <div className={`w-full flex px-6`}>
                    <ul className="w-full border-l border-neutral-800 px-2">
                        {options?.length > 0 ? options.map((option, index) => (
                            <li 
                                key={index} 
                                className={`relative group w-full px-2 py-1 rounded-lg text-neutral-300
                                    hover:bg-neutral-800 cursor-pointer flex items-center justify-between ${index === 0 && "mt-2"}`}
                            >
                                <Link
                                    href={`/${title.toLowerCase() === 'tasks' ? 'tasks' : 'notes'}/${uuid[index]}`}
                                >
                                    <span 
                                        className="w-full flex items-center gap-2">
                                        {itemicon}{option.slice(0, 12) + ' ...'}
                                    </span>

                                </Link>
                                <span 
                                    className="p-0.5 cursor-pointer
                                    rounded hover:bg-neutral-700/50 relative"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsOptionsOpen((prev) => prev === index ? null : index);
                                    }}
                                >
                                    <EllipsisVertical size={16} />
                                    {IsOptionsOpen === index && (
                                        <div 
                                            ref={OptionsMenuRef}
                                            className="absolute z-10 bg-black border border-neutral-800
                                                right-0 mt-2 rounded-lg p-2 min-w-[120px] text-left
                                                text-neutral-300 shadow-lg"
                                        >
                                            <button
                                                className="w-full text-left px-2 py-1 rounded hover:bg-neutral-700"
                                                onClick={() => HandleDeleteNote(index)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="w-full text-left px-2 py-1 rounded hover:bg-neutral-700"
                                                // onClick={handleEdit}
                                            >
                                                Edit
                                            </button>
                                            {/* Add more actions here */}
                                        </div>
                                    )}
                                </span>
                            </li>
                        )) : (
                            <li 
                                className="w-full px-2 py-1 rounded-lg text-neutral-500
                                    hover:bg-neutral-800 cursor-pointer flex items-center justify-between">
                                <span className="w-full flex items-center gap-2">
                                    No {title.toLowerCase()} available
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </section>
    )
}
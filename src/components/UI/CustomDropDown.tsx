"use client";
import { ChevronDown, EllipsisVertical, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/FireBase";
import { toast, Toaster } from "sonner";
import { useParams } from "next/navigation";

interface CustomDropDownProps {
    options: string[];
    // onSelect: (option: string) => void;
    title: string;
    icon: React.ReactNode;
    itemicon?: React.ReactNode;
    isLoading?: boolean;
    uuid: string[];
}
    // حذف الملاحظة عبر الفلترة وليس الـ index
interface Note {
    uuid: string;
    [key: string]: unknown;
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
    
    const [IsDeleteNoteOpen, setIsDeleteNoteOpen] = useState(false);
    const NoteIdParams = useParams().noteid as string;
    async function HandleDeleteNote() {
  if (userEmail) {
    const userDocRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) return;
    const data = docSnap.data();
    const notes = data.notes || [];

    const updatedNotes: Note[] = notes.filter((note: Note) => note.uuid !== NoteIdParams);

    await updateDoc(userDocRef, { notes: updatedNotes });
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
                    <ul className="w-full border-l space-y-1 border-neutral-800 px-2">
                        {options?.length > 0 ? options.map((option, index) => (
                            <li 
                                key={index} 
                                className={`relative group w-full px-2 py-1 rounded-lg text-neutral-300
                                    ${NoteIdParams === uuid[index] ? "bg-neutral-800" : ""} hover:bg-neutral-800 cursor-pointer flex items-center justify-between ${index === 0 && "mt-2"}`}
                            >
                                <Link
                                    href={`/${title.toLowerCase() === 'tasks' ? 'tasks' : 'notes'}/${uuid[index]}`}
                                    className="w-full"
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
                                                right-0 mt-2 space-y-1 rounded-lg p-2 min-w-[120px] text-left
                                                text-neutral-300 shadow-lg"
                                        >
                                            <button
                                                className="cursor-pointer w-full text-left px-2 py-1 rounded hover:bg-neutral-700"
                                                // onClick={handleEdit}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="w-full text-left px-2 py-1 rounded 
                                                    bg-red-600 hover:bg-red-700 cursor-pointer"
                                                onClick={() => setIsDeleteNoteOpen(true)}
                                            >
                                                Delete
                                            </button>
                                            {/* Add more actions here */}
                                        </div>
                                    )}
                                </span>
                            </li>
                        )) : (
                            <li 
                                className="w-full px-6 py-1 text-neutral-500
                                    flex items-center justify-start gap-2">
                                <span className="w-full flex items-center gap-2">
                                    No {title.toLowerCase()} available
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            )}
            {IsDeleteNoteOpen && (
                <div 
                    className="fixed w-full h-screen flex justify-center 
                        items-center top-0 left-0 z-50 bg-black/50">
                    <div 
                        className="w-[400px] min-h-[100px] bg-neutral-900 
                        rounded-lg border border-neutral-800 flex py-8
                        flex-col space-y-6 items-center justify-center">
                        <h1 className="text-white">Are you sure to <span className="text-red-600 font-semibold">Delete</span> This Note ?</h1>
                        <div className="w-full flex items-center justify-center gap-4">
                            <button 
                                onClick={async () => {
                                    await HandleDeleteNote();
                                    setIsDeleteNoteOpen(false);
                                    setIsOptionsOpen(null);
                                    setIsOpen(false);
                                }}
                                className="bg-red-500 hover:bg-red-600 px-4 py-0.5 
                                    rounded border border-red-400 cursor-pointer">
                                        Delete
                            </button>
                            <button 
                                onClick={() => {
                                    setIsDeleteNoteOpen(false);
                                    setIsOptionsOpen(null);
                                    setIsOpen(false);
                                }}
                                className="bg-neutral-900/20 hover:bg-neutral-800 
                                    px-4 py-0.5 rounded border border-neutral-800 
                                    hover:border-neutral-700 cursor-pointer">
                                        Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </section>
    )
}
"use client";
import { ChevronDown, EllipsisVertical, Plus } from "lucide-react";
import React, { useState } from "react";
import Link from 'next/link';

interface CustomDropDownProps {
    options: string[];
    // onSelect: (option: string) => void;
    title: string;
    icon: React.ReactNode;
    itemicon?: React.ReactNode;
    isLoading?: boolean;
}
export function CustomDropDown({ options, title, icon, itemicon, isLoading } : CustomDropDownProps) {
    const [IsOpen, setIsOpen] = useState(false);
    return (
        <section 
            className="text-sm p-2">
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
            {isLoading && IsOpen ?
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
                        {options.map((option, index) => (
                            <Link 
                                href={`/${uuid.toLowerCase() === 'tasks' ? 'tasks' : 'notes'}/${option.toLowerCase().replace(/\s+/g, '-')}`}
                                key={index} 
                                className={`group w-full px-2 py-1 rounded-lg text-neutral-300
                                    hover:bg-neutral-800 cursor-pointer flex items-center justify-between ${index === 0 && "mt-2"}`}
                            >
                                <span 
                                    // onClick={() => onSelect(option)}
                                    className="w-full flex items-center gap-2">
                                    {itemicon}{option.slice(0, 12) + ' ...'}
                                </span>
                                <span 
                                    className="p-0.5 cursor-pointer hidden group-hover:block 
                                        rounded hover:bg-neutral-700/50">
                                    <EllipsisVertical size={16} />
                                </span> 
                            </Link>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    )
}
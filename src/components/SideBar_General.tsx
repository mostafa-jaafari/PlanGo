"use client";
import { Bubbles, CalendarCheck2, ClipboardList, File, Folder, ListTodo } from "lucide-react";
import { CustomDropDown } from "./UI/CustomDropDown";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/FireBase";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Note {
    title: string;
    content?: string;
    [key: string]: unknown;
}
export function SideBar_General(){
    // TODO: Replace 'any' with a specific type for Notes to avoid using 'any'.
        const [Notes, setNotes] = useState<Note[]>([]);
        const Current_User = useSession().data?.user?.email;
    // TODO: Add 'Current_User' to the dependency array of useEffect to fix the missing dependency warning.
        useEffect(() => {
        if(Current_User){
            const DocRef = doc(db, 'users', Current_User);
            const unsubscribe = onSnapshot(DocRef, (snapshot) => {
                const data = snapshot.data();
                const NotesData = data?.notes || [];
                setNotes(NotesData);
            });
            return () => unsubscribe();
        }

    }, [Current_User]);
    return (
        <section>
            <h1 
                className="font-semibold uppercase px-4 mt-6 text-xs 
                    text-neutral-500">
                General
            </h1>
            <div className="-space-y-2">
                <div className="px-2">
                    <Link 
                        className="group w-full flex items-center 
                            justify-start gap-2 px-4 py-2
                            text-white text-sm hover:underline rounded-lg focus:outline-none focus:ring-1
                            focus:ring-neutral-800 hover:bg-neutral-800"
                        href="/tasks">
                        <ListTodo size={16} /> Tasks
                    </Link>
                </div>
                <CustomDropDown
                    isLoading={Notes.length === 0}
                    itemicon={<File size={16} />}
                    options={Notes.map(note => note.title)}
                    // onSelect={(option) => alert(`Selected: ${option}`)}
                    title="Notes"
                    icon={<Folder size={16} />}
                    uuid={Notes.map(note => String(note.uuid ?? ""))}
                />
            </div>
        </section>
    )
}
"use client";
import { Bubbles, ClipboardList, ListTodo } from "lucide-react";
import { CustomDropDown } from "./UI/CustomDropDown";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/FireBase";
import { useSession } from "next-auth/react";

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
                <CustomDropDown
                    itemicon={<ListTodo size={16} />}
                    options={['task-1', 'task-2', 'task-3']}
                    // onSelect={(option) => alert(`Selected: ${option}`)}
                    title="Tasks"
                    icon={<Bubbles size={16} />}
                    uuid={['task-1', 'task-2', 'task-3']}
                />
                <CustomDropDown
                    isLoading={Notes.length === 0}
                    itemicon={<ClipboardList size={16} />}
                    options={Notes.map(note => note.title)}
                    // onSelect={(option) => alert(`Selected: ${option}`)}
                    title="Notes"
                    icon={<Bubbles size={16} />}
                    uuid={Notes.map(note => String(note.uuid ?? ""))}
                />
            </div>
        </section>
    )
}
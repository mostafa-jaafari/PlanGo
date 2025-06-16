"use client";
import { Bubbles } from "lucide-react";
import { CustomDropDown } from "./UI/CustomDropDown";
import { Fake_Notes } from "../FakeData/Fake_Notes";
import { signIn } from "next-auth/react";


export function SideBar_General(){
    return (
        <section>
            <button
                onClick={() => signIn("google")}
                className="cursor-pointer hover:bg-blue-600/50 px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
                Sign in with Google
            </button>
            <h1 
                className="font-semibold uppercase px-4 mt-6 text-xs 
                    text-neutral-500">
                General
            </h1>
            <div className="-space-y-2">
                <CustomDropDown
                    options={['task-1', 'task-2', 'task-3']}
                    // onSelect={(option) => alert(`Selected: ${option}`)}
                    title="Tasks"
                    icon={<Bubbles size={16} />}
                />
                <CustomDropDown
                    options={Fake_Notes.map(note => note.title)}
                    // onSelect={(option) => alert(`Selected: ${option}`)}
                    title="Notes"
                    icon={<Bubbles size={16} />}
                />
            </div>
        </section>
    )
}
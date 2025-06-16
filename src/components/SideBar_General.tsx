"use client";
import { Bubbles } from "lucide-react";
import { CustomDropDown } from "./UI/CustomDropDown";
import { Fake_Notes } from "../FakeData/Fake_Notes";


export function SideBar_General(){
    return (
        <section>
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
"use client";
import { Bubbles } from "lucide-react";
import { CustomDropDown } from "./UI/CustomDropDown";


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
                    options={["Task-1", "Task-2", "Task-3"]}
                    // onSelect={(option) => alert(`Selected: ${option}`)}
                    title="Tasks"
                    icon={<Bubbles size={16} />}
                />
                <CustomDropDown
                    options={["Note-1", "Note-2", "Note-3"]}
                    // onSelect={(option) => alert(`Selected: ${option}`)}
                    title="Notes"
                    icon={<Bubbles size={16} />}
                />
            </div>
        </section>
    )
}
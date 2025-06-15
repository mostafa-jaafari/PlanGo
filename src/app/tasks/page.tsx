"use client";
import { useRef } from "react";
import Task_Page from "../Pages/Task_Page";

export default function Page({ params }) {
    const Task_Id = params.taskid;

    return (
        <main 
            className="w-full overflow-y-scroll h-full p-10 p-4 
                bg-neutral-800 rounded-lg">
            <Task_Page />
        </main>
    );
}

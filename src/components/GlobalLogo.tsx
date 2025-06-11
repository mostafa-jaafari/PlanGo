import { NotebookPen } from "lucide-react";




export function GlobalLogo(){
    return (
        <div className="flex items-center gap-2">
            <span className="bg-yellow-600 border border-dashed rounded p-1">
                <NotebookPen size={30} />
            </span>
            <span className="flex flex-col">
                <h1 className="text-xl font-bold text-white">
                    Plan<span className="text-yellow-600">Go</span>
                </h1>
                <ins className="text-xs text-neutral-400">
                    Entreprise
                </ins>
            </span>
        </div>
    )
}
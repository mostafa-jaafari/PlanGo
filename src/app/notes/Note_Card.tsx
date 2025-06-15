'use client';
import { FileText } from 'lucide-react';
import Link from 'next/link';

interface NoteCardProps {
    title?: string;
    date?: string;
    id: number;
}
export default function Note_Card({ title, date, hrefid }) {
    return (
        <section
            className="cursor-pointer hover:border-neutral-700 
                hover:shadow shadow-neutral-700/50 hover:scale-102 
                transition-transform duration-200 w-45 h-45 
                overflow-hidden bg-gradient-to-b from-neutral-900 
                to-neutral-800 rounded-xl border border-neutral-800"
            style={{
            background: 'linear-gradient(to bottom, #171717 50%, #262626 50%)'
            }}
        >
            <Link href={`/notes/${title.toLowerCase().replace(/\s+/g, '-')}-${hrefid}`}>
                <div className="relative flex flex-col items-center justify-end h-full w-full pb-4 z-10">
                    <div className="absolute top-2 left-2 w-full flex items-center gap-2">
                        <FileText 
                            size={30}
                            className="text-neutral-500 mb-2"
                        />
                        <span className={`text-xs text-neutral-400`}>
                            {date}
                        </span>
                    </div>
                    <div className="text-center h-16 w-[80%]">
                        {title?.length > 30 ? `${title.slice(0, 30)}...` : title}
                    </div>
                </div>
            </Link>
        </section>
    );
}
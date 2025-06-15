'use client';
import { FileText } from 'lucide-react';

interface NoteCardProps {
    title?: string;
}
export default function Note_Card({ title }) {
    return (
        <section
            className="cursor-pointer hover:border-neutral-700 hover:shadow shadow-neutral-700/50 hover:scale-102 transition-transform duration-200 w-45 h-45 overflow-hidden relative bg-gradient-to-b from-neutral-900 
                to-neutral-800 rounded-xl border border-neutral-800"
            style={{
            background: 'linear-gradient(to bottom, #171717 50%, #262626 50%)'
            }}
        >
            <div className='absolute z-20 top-18 left-4 w-[80%]'>
                <FileText 
                    size={30}
                    className="text-neutral-500"
                />
                {title?.length > 75 ? `${title.slice(0, 75)}...` : title}
            </div>
        </section>
    );
}
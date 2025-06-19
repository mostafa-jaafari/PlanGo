'use client';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from "../../FireBase";
import { useSession } from 'next-auth/react';

interface NoteCardProps {
  title: string;
  date: string;
  hrefid: string;
}

function Note_Card_Style({ title, date, hrefid }: NoteCardProps) {
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
      <Link href={`/notes/${hrefid}`}>
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

interface Note {
  title: string;
  date: string;
}
export default function Note_Card() {
  const { data: session, status } = useSession();
  const [Notes, setNotes] = useState<Note[]>([]);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    const Current_User = session?.user?.email;
    if (!Current_User) return;

    const unsubscribe = onSnapshot(doc(db, "users", Current_User), (snapshot) => {
      const User_Notes = snapshot.data()?.notes || [];
      setNotes(User_Notes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [status, session]);

  if (Loading) return (
    <div>
        {Array(1).fill(0).map((_, idx) => (
            <section
                key={idx}
                className="animate-pulse w-45 h-45 overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-xl border border-neutral-800"
                style={{
                    background: 'linear-gradient(to bottom, #171717 50%, #262626 50%)'
                }}
            >
                <div className="relative flex flex-col items-center justify-end h-full w-full pb-4 z-10">
                    <div className="absolute top-2 left-2 w-full flex items-center gap-2">
                        <div className="bg-neutral-700 rounded-full h-8 w-8 mb-2" />
                        <div className="bg-neutral-700 rounded h-3 w-16" />
                    </div>
                    <div className="flex flex-col justify-center items-center h-16 w-[80%]">
                        <div className="bg-neutral-700 rounded h-4 w-full mb-2" />
                        <div className="bg-neutral-700 rounded h-4 w-2/3" />
                    </div>
                </div>
            </section>
        ))}
    </div>
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Notes?.map((note, index) => {
        const hrefid = `${note.title.replace(/\s+/g, '-').toLowerCase()}-${index + 1}`;
        return (
          <Note_Card_Style
            key={index}
            title={note.title}
            date={note.date}
            hrefid={hrefid}
          />
        );
      })}
    </div>
  );
}

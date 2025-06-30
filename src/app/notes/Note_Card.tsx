'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/FireBase';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

interface NoteCardProps {
  title: string;
  date: string | { seconds: number; nanoseconds?: number };
  isUpdated: boolean;
  hrefid: string;
}

function formatDate(
  dateInput: string | { seconds: number; nanoseconds?: number } | undefined | null
): string {
  let dateObj: Date | null = null;

  if (typeof dateInput === 'object' && dateInput?.seconds) {
    dateObj = new Date(dateInput.seconds * 1000);
  } else if (typeof dateInput === 'string') {
    dateObj = new Date(dateInput);
    if (isNaN(dateObj.getTime())) return dateInput;
  }

  if (!dateObj || isNaN(dateObj.getTime())) return '';

  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}

function NoteCard({ title, date, isUpdated, hrefid }: NoteCardProps) {
    const pathname = usePathname();
  const [PrevPath, setPrevPath] = useState(pathname);
  const [IsLoadingPath, setIsLoadingPath] = useState(false);
  const HandleClickedNoteCard = () => {
    setIsLoadingPath(true);
  }
  useEffect(() => {
    if( pathname !== PrevPath) {
      setPrevPath(pathname);
      setIsLoadingPath(false);
    }
  },[])
  return (
    <section
      className={`cursor-pointer hover:border-neutral-700 
      ${IsLoadingPath ? "card-loading" : "bg-[linear-gradient(to_bottom,#171717_50%,#000000_50%)]"}
      hover:shadow shadow-neutral-700/50 hover:scale-102 
      transition-transform duration-200 w-45 h-45 overflow-hidden 
       rounded-xl 
      border border-neutral-800`}
    >
      <Link 
        onClick={() => HandleClickedNoteCard()}
        href={`/notes/${hrefid}`}>
        <div className="relative group flex flex-col px-2 py-4 items-center justify-between h-full w-full">
          <div className="absolute top-0 left-0 text-xs text-neutral-500 p-2">
            <span className="text-xs text-neutral-600">
              {formatDate(date)} {isUpdated ? '(updated)' : ''}
            </span>
          </div>
          <div className="w-full text-center pt-4">
            <span className="text-neutral-400 group-hover:text-white">
              {title.length > 30 ? `${title.slice(0, 30)}...` : title}
            </span>
          </div>
          <div className="flex justify-center items-center pb-4">
            <FileText size={30} className="text-neutral-400 group-hover:text-white" />
          </div>
        </div>
      </Link>
    </section>
  );
}

interface Note {
  title: string;
  date: string | { seconds: number; nanoseconds?: number };
  uuid: string;
  lastupdate?: { seconds: number; nanoseconds?: number };
}

export default function NoteList() {
  const { data: session, status } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const userEmail = session?.user?.email;
    if (!userEmail) return;

    const unsubscribe = onSnapshot(doc(db, 'users', userEmail), (snapshot) => {
      const userNotes = snapshot.data()?.notes || [];
      setNotes(userNotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [status, session]);

  if (loading) {
    return (
      <div className='w-full grid grid-cols-5 gap-4'>
        {Array(5).fill(0).map((_, index) => (
          <section 
            key={index}
            className="animate-pulse w-45 h-45 bg-gradient-to-b 
              from-neutral-900 to-neutral-800 rounded-xl border 
              border-neutral-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {notes.map((note, index) => {
        const isUpdated = !!note.lastupdate;
        const displayDate = isUpdated ? note.lastupdate : note.date;

        return (
          <NoteCard
            key={index}
            title={note.title}
            date={displayDate}
            hrefid={note.uuid}
            isUpdated={isUpdated}
          />
        );
      })}
    </div>
  );
}

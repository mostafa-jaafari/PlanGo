'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from "@/FireBase";
import { useSession } from 'next-auth/react';

// نوع مخصص للملاحظة الواحدة
interface NoteCardProps {
  title: string;
  date: string | { seconds: number; nanoseconds?: number };
  hrefid: string;
}

// ✅ مكون لتنسيق وعرض بطاقة الملاحظة
function Note_Card_Style({ title, date, hrefid }: NoteCardProps) {
  // 🕒 تنسيق التاريخ (Firestore timestamp أو string)
  function formatDate(
    dateInput: string | { seconds: number; nanoseconds?: number } | undefined | null
  ): string {
    let dateObj: Date | null = null;

    if (
      typeof dateInput === 'object' &&
      dateInput !== null &&
      typeof dateInput.seconds === 'number'
    ) {
      dateObj = new Date(dateInput.seconds * 1000);
    } else if (typeof dateInput === 'string') {
      dateObj = new Date(dateInput);
      if (isNaN(dateObj.getTime())) return dateInput;
    } else {
      return '';
    }

    if (!dateObj || isNaN(dateObj.getTime())) {
      return '';
    }

    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();

    if (diff < 0) return 'in the future';

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

  return (
    <section className="cursor-pointer hover:border-neutral-700 hover:shadow shadow-neutral-700/50 hover:scale-102 transition-transform duration-200 w-45 h-45 overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-xl border border-neutral-800"
      style={{ background: 'linear-gradient(to bottom, #171717 50%, #262626 50%)' }}
    >
      <Link href={`/notes/${hrefid}`}>
        <div 
          className="relative group flex flex-col px-2 py-4 items-center justify-between 
          h-full w-full">
          <div className='absolute top-0 left-0 text-xs text-neutral-500 p-2'>
            <span className="text-xs text-neutral-600">{formatDate(date)}</span>
          </div>
          {/* Title at the top */}
          <div 
            className="w-full text-center pt-4">
            <span className="text-neutral-400 group-hover:text-white">
              {title.length > 30 ? `${title.slice(0, 30)}...` : title}
            </span>
          </div>
          {/* Icon and date below the title */}
          <div className="flex justify-center items-center pb-4">
            <FileText size={30} className="text-neutral-400 group-hover:text-white" />
          </div>
        </div>
      </Link>
    </section>
  );
}

// ✅ مكون رئيسي يعرض كل بطاقات الملاحظات
interface Note {
  title: string;
  date: string;
  uuid: string;
  hrefid: string;
  lastupdate?: { seconds: number, nanoseconds?: number };
}

export default function Note_Card() {
  const { data: session, status } = useSession();
  const [Notes, setNotes] = useState<Note[]>([]);
  const [Loading, setLoading] = useState(true);

  // 📡 الاتصال بـ Firestore وجلب الملاحظات الحية
  useEffect(() => {
    if (status !== "authenticated") return;

    const userEmail = session?.user?.email;
    if (!userEmail) return;

    const unsubscribe = onSnapshot(doc(db, "users", userEmail), (snapshot) => {
      const User_Notes = snapshot.data()?.notes || [];
      setNotes(User_Notes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [status, session]);

  // ⏳ مكون التحميل (skeleton UI)
  if (Loading) return (
    <div>
      {[...Array(1)].map((_, idx) => (
        <section
          key={idx}
          className="animate-pulse w-45 h-45 bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-xl border border-neutral-800"
          style={{ background: 'linear-gradient(to bottom, #171717 50%, #262626 50%)' }}
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
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Notes.map((note, index) => {
        return (
          <Note_Card_Style
            key={index}
            title={note.title}
            date={note?.lastupdate ? note?.lastupdate : note?.date}
            hrefid={note.uuid}
          />
        );
      })}
    </div>
  );
}

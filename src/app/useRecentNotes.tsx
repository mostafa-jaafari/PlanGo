import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/FireBase';
import { useSession } from 'next-auth/react';

export function useRecentNotes(limitCount = 5) {
  const session = useSession();
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.data?.user?.email) {
      setRecentNotes([]);
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);

      if(!session?.data?.user?.email) return;
      try {
        const userDocRef = doc(db, 'users', session?.data?.user?.email); // نستخدم الإيميل كـ ID
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          let notes = userData.notes || [];

          // فلترة حسب الحذف إن كان موجود
          notes = notes.filter((note: any) => !note.deleted);

          // ترتيب حسب lastAccessed
          notes.sort((a: any, b: any) => {
            const aTime = a.lastAccessed?.seconds || 0;
            const bTime = b.lastAccessed?.seconds || 0;
            return bTime - aTime;
          });

          // تطبيق limit
          notes = notes.slice(0, limitCount);

          // تحويل التواريخ
          const parsedNotes = notes.map((note: any) => ({
            ...note,
            lastAccessed: note.lastAccessed?.seconds ? new Date(note.lastAccessed.seconds * 1000) : null,
            createdAt: note.createdAt?.seconds ? new Date(note.createdAt.seconds * 1000) : null,
            updatedAt: note.updatedAt?.seconds ? new Date(note.updatedAt.seconds * 1000) : null
          }));

          setRecentNotes(parsedNotes);
        } else {
          setRecentNotes([]);
        }
      } catch (error) {
        console.error('Error fetching user notes:', error);
        setRecentNotes([]);
      }

      setLoading(false);
    };

    fetchNotes();
  }, [session, status, limitCount]);

  return { recentNotes, loading };
}

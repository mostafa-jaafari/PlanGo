"use client";

import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { doc, onSnapshot, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/FireBase";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { toast, Toaster } from "sonner";

// نوع بيانات الملاحظة
interface Note {
  title: string;
  date: Timestamp;
  uuid: string;
  note_content: string;
  lastupdate?: Timestamp;
}

export default function Note_Page() {
  // المراجع
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputTitleRef = useRef<HTMLInputElement>(null);

  // الجلسة والبيانات
  const session = useSession();
  const Current_User_Email = session?.data?.user?.email;
  const params = useParams();
  const noteId = params?.noteid as string;
  const router = useRouter();

  // الحالات
  const [isFilledTitle, setIsFilledTitle] = useState(false);
  const [SelectedNote, setSelectedNote] = useState<Note>();
  const [title, setTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // ✅ جلب الملاحظة المحددة بشكل مباشر
  useEffect(() => {
    if (!Current_User_Email || !noteId) return;

    const userDocRef = doc(db, "users", Current_User_Email);

    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      const data = snapshot.data();
      const notes: Note[] = data?.notes || [];

      const foundNote = notes.find((note) => note.uuid === noteId);

      if (foundNote) {
        setSelectedNote(foundNote); // ✅ عرض الملاحظة
      } else {
        setSelectedNote(undefined);
        router.replace("/notes/new");
      }
    });

    return () => unsubscribe();
  }, [Current_User_Email, noteId, router]);

  // ✅ تعبئة الحقول عند تغيير الملاحظة المختارة
  useEffect(() => {
    if (SelectedNote) {
      setTitle(SelectedNote.title || "");
      setNoteContent(SelectedNote.note_content || "");
      setIsFilledTitle(!!SelectedNote.title);
    }
  }, [SelectedNote]);

  // ✅ تعديل ارتفاع textarea تلقائياً
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // ✅ انتقال من العنوان إلى النص عند الضغط Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      textareaRef.current?.focus();
    }
  };

  const [IsUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    if(title === SelectedNote?.title && noteContent === SelectedNote?.note_content) {
      setIsUpdated(false);
    } else {
      setIsUpdated(true);
    }
  },[title, noteContent]);

  // ✅ حفظ أو تعديل الملاحظة بناءً على حالة IsUpdated
  async function handleSaveNote() {
    if (!Current_User_Email || (title === '' && noteContent === '')) {
      toast.info('❗ Please fill in the title or content before saving.');
      return;
    }

    const userDocRef = doc(db, "users", Current_User_Email);
    const docSnap = await getDoc(userDocRef);

    let noteUuid = noteId;
    // إذا كانت الملاحظة جديدة (noteId === "new")، أنشئ UUID جديد
    const isNewNote = noteId === "new" || !SelectedNote;
    if (isNewNote) {
      const userName = session?.data?.user?.name?.toLowerCase().replace(/\s+/g, "-") || "user";
      noteUuid = `${userName}-${uuidv4()}`;
    }

    const newNote: Note = {
      uuid: noteUuid,
      title,
      note_content: noteContent,
      date: Timestamp.now(),
    };

    if (!isNewNote) {
      // تحديث الملاحظة فقط إذا لم تكن جديدة
      if (docSnap.exists()) {
      const userData = docSnap.data();
      const notes: Note[] = userData?.notes || [];
      const existingIndex = notes.findIndex((note) => note.uuid === noteUuid);

      if (existingIndex !== -1) {
        notes[existingIndex] = {
        ...notes[existingIndex],
        title,
        note_content: noteContent,
        // لا تغير حقل date، فقط lastupdate
        lastupdate: Timestamp.now(),
        };
        await updateDoc(userDocRef, { notes });
        setIsUpdated(false);
        toast.success("✅ Note updated successfully");
      }
      }
    } else {
      // إنشاء ملاحظة جديدة
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const notes: Note[] = userData?.notes || [];
        notes.push(newNote);
        await updateDoc(userDocRef, { notes });
      } else {
        await setDoc(userDocRef, { notes: [newNote] });
      }
      toast.success("✅ Note created successfully");
      router.push(`/notes/${noteUuid}`);
    }
  }
  return (
    <main>
      <Toaster position="top-center" />
      {/* زر الحفظ */}
      <section className="w-full flex items-center justify-end">
        <button
          disabled={!IsUpdated || title === '' || noteContent === ''}
          onClick={handleSaveNote}
          className={`flex items-center gap-2 
            px-5 py-2 rounded
            shadow-lg transition-all duration-200 focus:outline-none 
            focus:ring-2 focus:ring-yellow-400
            ${!IsUpdated || title === 's' ? "cursor-not-allowed bg-gradient-to-r from-neutral-900 to-neutral-700 hover:from-neutral-900/70 hover:to-neutral-700/70" : "cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800"}`}
        >
          <Save size={20} className="text-white drop-shadow" />
          <span className="text-white font-semibold tracking-wide">
        {noteId === "new" ? "Save Note" : "Update Note"}
          </span>
        </button>
      </section>

      {/* مدخلات الملاحظة */}
      <section className="w-full h-full space-y-8 p-4">
        <input
          className="w-full bg-transparent border-none outline-none 
            px-4 text-white text-4xl font-semibold"
          type="text"
          ref={inputTitleRef}
          placeholder="Type Title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsFilledTitle(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        {/* محتوى الملاحظة */}
        <div
          style={{
            transition: "max-height 0.3s ease, opacity 0.3s ease",
            overflow: "hidden",
            maxHeight: !isFilledTitle ? "0" : undefined,
            opacity: isFilledTitle ? 1 : 0,
          }}
        >
          <textarea
            ref={textareaRef}
            className="w-full border-none outline-none px-4 mt-2 
              resize-none text-neutral-400"
            placeholder="Type Description..."
            onInput={handleInput}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            disabled={!isFilledTitle}
            style={{
              transition: "opacity 0.3s ease",
              opacity: isFilledTitle ? 1 : 0,
            }}
          ></textarea>
        </div>
      </section>
    </main>
  );
}

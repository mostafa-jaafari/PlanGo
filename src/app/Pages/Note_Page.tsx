"use client";
import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { doc, onSnapshot, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/FireBase";
import { Timestamp } from "firebase/firestore";

interface HandleKeyDownEvent {
    key: string;
    preventDefault: () => void;
}
interface Note {
    title: string;
    date: Timestamp;
    uuid: string;
    note_content: string;
}
export default function Note_Page({}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const inputTitleRef = useRef<HTMLInputElement>(null);
    const [isFilledTitle, setisFilledTitle] = useState(false);

    // New states for editable fields
    const [title, setTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };


    const handleKeyDown = (e: HandleKeyDownEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }
    };

    const params = useParams();
    const Current_User = useSession()?.data?.user?.email;
    const [SelectedNote, setSelectedNote] = useState<Note>();

    useEffect(() => {
        if (Current_User && params?.noteid) {
            const DocRef = doc(db, 'users', Current_User);
            const unsubscribe = onSnapshot(DocRef, (snapshot) => {
                const data = snapshot.data();
                const NotesData = data?.notes || [];
                const Selected_Note_Details = NotesData.find((note: Note) => note?.uuid === params?.noteid);
                setSelectedNote(Selected_Note_Details);
            });
            return () => unsubscribe();
        }
    }, [params?.noteid, Current_User]);

    // When SelectedNote changes, update title and noteContent states
    useEffect(() => {
        if (SelectedNote) {
            setTitle(SelectedNote.title || "");
            setNoteContent(SelectedNote.note_content || "");
            setisFilledTitle(!!SelectedNote.title);
        }
    }, [SelectedNote]);

    // useEffect(() => {},[params?.noteid])
    // const HandleCreateNewNote = () => {
    //     if(inputTitleRef.current && inputTitleRef.current.value === '') return;
    //     alert('hello world');
    //     const DocRef = doc(db, 'users', Current_User);
    //     // const DocData = 
    // }
    async function HandleCreateNewNote() {
  if (!Current_User) return;

  const userDocRef = doc(db, "users", Current_User);

  const newNote = {
    uuid: crypto.randomUUID(), // أو uuidv4() لو عندك uuid مثبت
    title: title,
    description: noteContent,
    createdAt: new Date().toISOString(),
  };

  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    // إذا المستخدم موجود، نضيف للمصفوفة
    await updateDoc(userDocRef, {
      notes: arrayUnion(newNote),
    });
  } else {
    // إذا المستخدم غير موجود، ننشئه مع أول ملاحظة
    await setDoc(userDocRef, {
      notes: [newNote],
    });
  }

  alert("تمت إضافة الملاحظة الجديدة ✅");
}
    return (
        <main>
            <section className="w-full flex items-center justify-end">
                <button 
                    onClick={HandleCreateNewNote}
                    className="py-1 px-2 rounded-lg cursor-pointer flex items-center gap-1
                        bg-yellow-600 hover:bg-yellow-600/50 transition-all duration-200">
                    <Save size={20} /> <span className="text-white">Save Note</span>
                </button>
            </section>
            <section className={`w-full h-full space-y-8 p-4`}>
                <input
                    className="w-full bg-transparent border-none outline-none 
                        px-4 text-white text-4xl font-semibold"
                    type="text"
                    ref={inputTitleRef}
                    onChange={e => {
                        setTitle(e.target.value);
                        setisFilledTitle(e.target.value.length > 0);
                    }}
                    onKeyDown={handleKeyDown}
                    value={title}
                    autoFocus
                    placeholder="Type Title..."
                />
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
                        onInput={handleInput}
                        className="w-full border-none outline-none px-4 mt-2 
                        resize-none text-neutral-400"
                        placeholder="Type Description..."
                        style={{
                            transition: "opacity 0.3s ease",
                            opacity: isFilledTitle ? 1 : 0,
                        }}
                        disabled={!isFilledTitle}
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}
                    ></textarea>
                </div>
            </section>
        </main>
    );
}

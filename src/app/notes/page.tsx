import Note_Card from './Note_Card';
import { Fake_Notes } from '../../FakeData/Fake_Notes';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/FireBase';
import { auth } from '@/auth';

async function getInitialNotes() {
    const session = await auth();
    const Current_User = session?.user?.email;
    if(Current_User){
        const DocRef = await getDoc(doc(db, "users", Current_User));
        return DocRef.data()?.notes;
    }
}

export default async function page() {
    const Notes = await getInitialNotes();
    return (
        <main 
            className="w-full px-4 py-10">
            <section className="w-full grid grid-cols-5 place-items-center gap-4 mb-8 ">
                {Notes.map((note, index) => {
                    return (
                        <Note_Card
                            key={index}
                            title={note.title}
                            hrefid={note.id}
                            date={note.date}
                        />
                        )
                })}
            </section>
        </main>
    );
}

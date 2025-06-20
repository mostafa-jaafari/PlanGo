import Note_Card from './Note_Card';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
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

type NoteCardProps = {
    title: string;
    uuid: string;
    date: Timestamp;
};
export default async function page() {
    const Notes: NoteCardProps[] = await getInitialNotes();
    return (
        <main 
            className="w-full px-4 py-10">
            <section className="w-full grid grid-cols-5 place-items-center gap-4 mb-8 ">
                {Notes?.map((note, index) => {
                    return (
                        <Note_Card
                            key={index}
                            title={note?.title}
                            hrefid={note?.uuid}
                            date={note?.date}
                        />
                        )
                })}
            </section>
        </main>
    );
}

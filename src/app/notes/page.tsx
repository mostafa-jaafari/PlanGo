import Note_Card from './Note_Card';
import { Timestamp } from 'firebase/firestore';

type NoteCardProps = {
    title: string;
    uuid: string;
    date: Timestamp;
};
export default async function page() {
    return (
        <main>
           <Note_Card />
        </main>
    );
}

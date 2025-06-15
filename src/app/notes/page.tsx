import Note_Page from '../Pages/Note_Page';
import Note_Card from './Note_Card';
import { Fake_Notes } from '../../FakeData/Fake_Notes';

export default function page({ params }) {
    const Note_Id = params.noteid;

    return (
        <main 
            className="w-full px-4 py-10">
            <section className="w-full grid grid-cols-5 place-items-center gap-4 mb-8 ">
                {Fake_Notes.map((note, index) => {
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

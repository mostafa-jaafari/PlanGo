import Note_Page from '../Pages/Note_Page';
import Note_Card from './Note_Card';

export default function page({ params }) {
    const Note_Id = params.noteid;

    return (
        <main 
            className="w-full px-4 py-10">
            <section className="w-full grid grid-cols-5 place-items-center gap-4 mb-8 ">
                {Array(8).fill(0).map((_, index) => {
                return (
                    <Note_Card
                        key={index}
                        title={`text test text test
                            text test text test
                            text test text test`}
                    />
                    )
                })}
            </section>
        </main>
    );
}

import Note_Page from "../../Pages/Note_Page";



export default function page({ params }){
    const Note_Id = params.noteid;
    return (
        <main
            className="w-full h-full px-10 px-4 pb-4"
        >
            <Note_Page
                Note_Id={Note_Id}
            />
        </main>
    )
}
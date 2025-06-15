import Note_Page from "../../Pages/Note_Page";



export default function page({ params }){
    const Note_Id = params.noteid;
    return (
        <main
            className="w-full h-full p-10 p-4"
        >
            <Note_Page
                Note_Id={Note_Id}
            />
        </main>
    )
}
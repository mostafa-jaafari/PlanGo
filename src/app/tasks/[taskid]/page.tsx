import Task_Page from "../../Pages/Task_Page";



export default function page({ params }){
    const Task_Id = params.taskid;
    return (
        <main>
            <Task_Page
                Task_Id={Task_Id}
            />
        </main>
    )
}
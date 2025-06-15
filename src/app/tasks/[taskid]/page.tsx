



export default function page({ params }){
    const Task_Id = params.taskid;
    return (
        <main>
            {Task_Id}
        </main>
    )
}
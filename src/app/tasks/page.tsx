import Task_Page from "../Pages/Task_Page";
import TasksNavBar from "./TasksNavBar";

export default function Page() {

    return (
        <main 
            className="py-8">
                <TasksNavBar />
                <Task_Page />
        </main>
    );
}

import { ToDoLists } from "@/components/Fake_Data";
import SideBar from "@/components/SideBar";

export default function Home() {
  return (
    <main className="w-full flex gap-4 p-2">
      <SideBar />
      <section>
        <h1>To Do Lists</h1>
        <ul>
          {ToDoLists.map((list) => (
            <li key={list.id}>
              <h2>{list.title}</h2>
              <p>{list.createdAt}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

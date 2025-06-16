import { auth } from "../auth";
import Image from "next/image";


export default async function Header() {
    const Auth = await auth();
  return (
    <header 
        className="w-full flex items-center justify-end p-4 
            text-white">
        <div className='relative w-10 h-10 rounded-full bg-neutral-900'>
            <Image
                src={Auth?.user?.image || "/default-avatar.png"}
                alt="User Avatar"
                fill
                className="object-cover"
            />
        </div>
    </header>
  );
}
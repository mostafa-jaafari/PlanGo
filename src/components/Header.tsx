import { auth } from "../auth";
import Image from "next/image";
import LogOutButton from "./LogOutButton";
import SignInByGoogle from './SignInByGoogle';

export default async function Header() {
    const Auth = await auth();
    if (!Auth?.user) {
        return (
            <header className="w-full flex items-center justify-end p-4 text-white">
                <SignInByGoogle />
            </header>
        );
    }else{
        return (
    <header 
        className="relative w-full flex items-center justify-end p-4 
            text-white gap-3">
        <section className='group w-max flex items-center gap-2'>
            <div 
                className='relative w-10 h-10 rounded-full 
                bg-neutral-900 overflow-hidden'>
                <Image
                    src={Auth?.user?.image || "/default-avatar.png"}
                    alt="User Avatar"
                    fill
                    className="object-cover"
                    />
            </div>
            <div>
                <h1 className="text-lg font-semibold">
                    {Auth?.user?.name || "Guest"}
                </h1>
                <p className="text-xs text-neutral-400 font-normal">
                    {Auth?.user?.email || "Not signed in"}
                </p>
            </div>
            <div 
                className='absolute right-0 w-64 rounded-xl p-2
                    top-full bg-neutral-900 border border-neutral-800/50
                    group-hover:opacity-100 opacity-0
                    group-hover:scale-100 scale-0
                    transition-all duration-300'>
                <LogOutButton />
            </div>
        </section>
    </header>
  );
    }
}
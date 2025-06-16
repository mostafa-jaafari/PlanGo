import { auth } from "../auth";
import HeaderMenu from "./HeaderMenu";
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
        <HeaderMenu
            user={Auth?.user}
        />
    </header>
  );
    }
}
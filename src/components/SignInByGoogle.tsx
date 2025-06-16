'use client';
import { signIn } from 'next-auth/react';


export default function SignInByGoogle() {
    return (
        <button 
            className='bg-blue-800 cursor-pointer w-64 text-[18px] 
                py-1 border border-blue-400/50 hover:bg-blue-800/60 
                font-normal text-white rounded-xl'
            onClick={() => signIn('google')}>
            Login By Google
        </button>
    );
}
'use client';
import { signOut } from 'next-auth/react';

export default function LogOutButton() {
    return (
        <button 
            className='bg-red-800 cursor-pointer w-full text-[18px] 
            py-1 border border-red-400/50 hover:bg-red-800/60 
            font-normal text-white rounded-xl'
            onClick={() => signOut()}>
            Sign Out
        </button>
    );
}
"use client";
import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { doc, onSnapshot, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/FireBase";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { toast, Toaster } from "sonner";

// نوع بيانات الملاحظة
interface Note {
  title: string;
  date: Timestamp;
  uuid: string;
  note_content: string;
  lastupdate?: Timestamp;
}

export default function Task_Page({ Task_Id }) {
  switch (Task_Id) {
    case '1':
      
      return (
        <main>This is : 1</main>
      );
    case '2':
    
    return (
      <main>This is : 2</main>
    );
    default:
    return (
      <main className="w-full text-neutral-400 min-h-[40vh] flex justify-center items-center text-xl">
        Sorry <span className="text-red-400">" {Task_Id} "</span> Not Founded !
      </main>
    );
  }
}

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./FireBase";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ user }) {
            if (!user?.email) return false
            const userRef = doc(db, "users", user.email)
            const userSnap = await getDoc(userRef)
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    createdAt: new Date().toISOString(),
                })
            }
            return true
        },
    },
})
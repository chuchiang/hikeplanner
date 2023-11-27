import { getAuth, signOut } from "firebase/auth";


export const firebaseSignOut = async () => {
    const auth = getAuth();
    const userSignOut = await signOut(auth)
    return userSignOut;

}
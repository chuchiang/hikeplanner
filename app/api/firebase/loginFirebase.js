import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const firebaseLogin = async (data) => {

    // console.log(data);
    const auth = getAuth();
    let {password,email} = data;
    const userSignIn = await signInWithEmailAndPassword(auth, email, password)
    return userSignIn;

}
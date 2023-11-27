import {
    signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from "../firebase/firebase"


//Google 帳號提供
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account"
})
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
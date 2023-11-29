import {doc ,deleteDoc} from 'firebase/firestore';
import { hikeDocRef } from './firebase';


const asyncDeleteData = async (id) =>{
    await deleteDoc(doc(hikeDocRef,id))
}

export default asyncDeleteData;
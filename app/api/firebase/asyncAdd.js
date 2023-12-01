import { addDoc, serverTimestamp, doc,setDoc } from 'firebase/firestore';
import { hikeDocRef } from '../firebase/firebase';

const asyncAddData = async (dataToSave) => {
    if (dataToSave.id) {
        // 尋找同等id的data
        const docOld = doc(hikeDocRef, dataToSave.id);
        await setDoc(docOld, {
            auth: dataToSave.auth,
            userName:dataToSave.userName,
            routeName: dataToSave.routeName,
            shareTrip: dataToSave.shareTrip,
            total: dataToSave.total,
            route: dataToSave.locations,
            recordTime: serverTimestamp(),
            img:dataToSave.img,
        });
        return docOld;
    } else {
        const docRef = await addDoc(hikeDocRef, {
            auth: dataToSave.auth,
            userName:dataToSave.userName,
            routeName: dataToSave.routeName,
            shareTrip: dataToSave.shareTrip,
            total: dataToSave.total,
            route: dataToSave.locations,
            recordTime: serverTimestamp(),
            img:dataToSave.img,

        })
        return docRef;
    }
}

export default asyncAddData;
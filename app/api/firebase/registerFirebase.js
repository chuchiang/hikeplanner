import { db,auth } from "../firebase/firebase"
import { createUserWithEmailAndPassword, updateProfile} from "firebase/auth"

import {
    getFirestore, // 用來創造一個 firestore 實例
    doc, // 用來創造一個 document 實例
    getDoc, // 取得 document data
    setDoc // 設定 document data
} from 'firebase/firestore';


//建立一個 function 用來將登入的使用者資料存入 Firestore
export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {

    if (!userAuth) return;
    // 建立一個 document 實例
    const userDocRef = doc(db, 'users', userAuth.uid);
    // 將 document 實例的資料取出來
    const userSnapshot = await getDoc(userDocRef);
    // console.log(userSnapshot);
    // console.log(userSnapshot.exists());

    // 如果使用者不存在
    if (!userSnapshot.exists()) {
        const { email } = userAuth;
        const { displayName } = additionalInformation; // 使用從 additionalInformation 中傳遞的 displayName
        const createdAt = new Date();
        // 就把資料寫進 Firestore
        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation // 這裡將 additionalInformation 中的所有字段添加到文檔中
            
            });
        } catch (error) {
            console.log('建立使用者失敗' + error.message);
        }
    }

    // 如果使用者存在直接回傳 userDocRef
    return userDocRef;
};



export const createAuthUserWithEmailAndPassword = async (email, password, displayName) => {
    if (!email || !password) return;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // 更新用户的 displayName
    if (displayName) {
        await updateProfile(userCredential.user, {
            displayName: displayName
        });
    }
    return userCredential;
};
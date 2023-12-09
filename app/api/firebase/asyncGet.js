import { getDocs, query, where, orderBy } from 'firebase/firestore';
import { hikeDocRef } from './firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { UseSelector } from 'react-redux';

//取得自己規劃的路線
export const asyncGetMyData = async () => {
    const auth = getAuth();
    const user = await new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user);
        });
    });

    if (user) {
        // 使用者已登入
        const uid = user.uid; // 取得當前使用者的 uid
        const authData = query(hikeDocRef, where("auth", "==", uid),where("recordTime", "!=", null), // 檢查recordTime不為空
        orderBy("recordTime", "desc")); // 按recordTime降序排序) //query(集合的參考,查詢條件)，查詢 auth 等於 uid 的文件

        const querySnapshot = await getDocs(authData);
        const data = [];
        // console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
            const documentData = doc.data();
            // console.log(documentData)
            const documentWithId = { ...documentData, id: doc.id }
            data.push(documentWithId);
        });

        return data;
    } else {
        // 使用者未登入，你可以回傳一個空陣列或是做其他處理
        return [];
    }
}



//取得可分享的路線
export const asyncGetShareData = async () => {
    const shareData = query(hikeDocRef,
        where("shareTrip", "==", true),
        where("recordTime", "!=", null), // 檢查recordTime不為空
        orderBy("recordTime", "desc")); // 按recordTime降序排序
    const querySnapshotShare = await getDocs(shareData);
    // console.log(querySnapshotShare);
    const data = []
    querySnapshotShare.forEach((doc) => {
        const sharePlan = doc.data();
        // console.log(sharePlan)
        data.push(sharePlan);
    })
    return data
}


//取得搜尋的路線
export const asyncGetSearchData = async (searchTerm) => {

    const shareData = query(hikeDocRef, where("shareTrip", "==", true),
        where("routeName", "==", searchTerm));
    const querySnapshotShare = await getDocs(shareData);
    // console.log(querySnapshotShare);
    const data = []
    querySnapshotShare.forEach((doc) => {
        const sharePlan = doc.data();
        // console.log(sharePlan)
        data.push(sharePlan);
    })
    return data
}


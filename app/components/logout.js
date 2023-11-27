import { firebaseSignOut } from '../api/firebase/logoutFirebase';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux'
import { clearUser } from '../slice/authSlice'



const LogOut =()=> {
    const dispatch = useDispatch();
// const router = useRouter();

    const submit = async (e) => {
        e.preventDefault();
        try {
            await firebaseSignOut();
            dispatch(clearUser());//登出
            // router.push('/');
            window.location.href = '/';
            
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        }
    }

    return (
        <>
            <button onClick={submit} className='co-5B6E60 font-medium'>登出</button>
        </>
        )

}

export default LogOut
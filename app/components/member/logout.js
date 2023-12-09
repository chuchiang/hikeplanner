import { firebaseSignOut } from '../../api/firebase/logoutFirebase';
import { useDispatch } from 'react-redux'
import { clearUser } from '../../slice/authSlice'



const LogOut = () => {

    const dispatch = useDispatch();

    const submit = async (e) => {
        e.preventDefault();
        try {
            await firebaseSignOut();
            dispatch(clearUser());//登出
            window.location.href = '/';

        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.log(errorCode);
            // console.log(errorMessage);
        }
    }

    return (
        <>
            <button onClick={submit} className='co-5B6E60 font-medium p-2 hover:font-bold sm:p-0'>登出</button>
        </>
    )
}

export default LogOut
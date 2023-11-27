import { useState } from "react"
import { useRouter } from 'next/navigation';//換頁
import { firebaseLogin } from '../api/firebase/loginFirebase';
import { signInWithGooglePopup } from '../api/firebase/googleFirebase';




const LoginForm = ({ onClose, handleRegisterClick }) => {

    const [error, setError] = useState(null);// 創建 error 以存儲錯誤訊息

    const [data, setData] = useState({
        username: '',
        email: '',
        password: ''
    });


    //Google登入
    const logGoogleUser = async () => {
        try {
            const response = await signInWithGooglePopup();
            console.log(response);
            onClose();

        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            setError("google登入失敗");
        }
    }

    //在input輸入任何內容，要綁定
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setData({ ...data, [name]: value });
        console.log(data)
    }


    const submit = async (e) => {
        e.preventDefault();
        console.log(data);
        try {
            const user = await firebaseLogin(data);
            console.log(user.user)
            onClose();
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            setError("信箱或密碼輸入錯誤");
        }
    }




    return (
        <div className=' fixed inset-0 z-50 bg-gray-500 bg-opacity-25 flex justify-center items-center'>
            <div className='  shadow-md relative flex flex-col items-center pb-10 pt-8 bg-F5F2ED rounded px-5 text-center'>
                <button className=' absolute top-1 right-1' onClick={onClose}><img src='/close.png' /></button>
                <form onSubmit={submit}>
                    <h3 className='text-2xl co-646564 pb-5 font-bold'>登入會員帳號</h3>
                    <input className=' mb-4 w-72 p-2' type='email' name='email' placeholder="請輸入信箱" onChange={handleChange}></input><br />
                    <input className='mb-4 w-72 p-2' type='password' name='password' placeholder="請輸入帳號" onChange={handleChange}></input><br />
                    <button type='submit' className='bg-5B6E60 text-lg text-white w-72 p-2' >登入帳號</button>
                </form>
                <div className='mt-4 mb-4 flex items-center justify-center'>
                    <div className='flex-grow border-t border-gray-400 w-28'></div>
                    <span className='mx-5 text-lg text-gray-400'>or</span>
                    <div className='flex-grow border-t border-gray-400 w-28'></div>
                </div>
                <button onClick={logGoogleUser} className=' border border-blue-500 t-4 w-72 text-lg bg-white flex items-center justify-center text-blue-500 font-medium'><img src='/google.png' className="w-5 mr-2" />Login with Google</button>
                <div className='text-base co-646564 h-8 mt-2'>還沒有帳戶? <button onClick={handleRegisterClick} >註冊帳號</button>
                    {error && <div className="mb-3 text-orange-700">{error}</div>}

                </div>
            </div>
        </div>

    )

}

export default LoginForm
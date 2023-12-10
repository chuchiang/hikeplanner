import { React } from 'react';
import { useState } from "react"
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../api/firebase/registerFirebase';
import { signInWithGooglePopup } from '../../api/firebase/googleFirebase';
import { useRouter } from 'next/navigation';//換頁
import FromLoading from "../loading/fromLoading";
import { useDispatch } from 'react-redux';
import { addUserName } from '../../slice/authSlice'

const RegisterForm = ({ onClose, handleLoginClick }) => {

    const [message, setmessage] = useState(null);// 創建 error 以存儲錯誤訊息
    const [isLoading, setIsLoading] = useState(false);// 創建 error 以存儲錯誤訊息
    const dispatch = useDispatch();


    const [formFields, setFormFields] = useState({
        displayName: '',
        email: '',
        password: ''
    });


    // //登入
    const logGoogleUser = async () => {
        try {
            const response = await signInWithGooglePopup();
            router.push('/planning');
            // console.log(response);
        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            setmessage("google登入失敗");
        }
    }

    const router = useRouter();

    //在input輸入任何內容，要綁定
    const handleChange = (event) => {
        const { name, value } = event.target;
        // console.log(name, value);
        setFormFields({ ...formFields, [name]: value });
        // console.log(formFields)
    }


    //表單提交後做的事情
    const handleSubmit = async (event) => {
        event.preventDefault();
        setmessage()

        setIsLoading(true)
        try {
            const { user } = await createAuthUserWithEmailAndPassword(
                formFields.email,
                formFields.password,
                formFields.displayName
            );
            await createUserDocumentFromAuth(user, { displayName: formFields.displayName });
            dispatch(addUserName(formFields.displayName))
            setFormFields(formFields);
            setmessage("註冊成功，已登入")
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setmessage("信箱已註冊過")
            } else if (error.code === 'auth/weak-password') {
                setmessage("密碼應至少為 6 個字符")
            } else if (error.code === 'auth/invalid-email') {
                setmessage("信箱填寫錯誤")
            } else {
                setmessage("註冊失敗")
            }
            console.log('user creation encountered an error' + error);
        }
        setIsLoading(false)


    };


    return (
        <div className=' fixed inset-0 z-50 bg-gray-500 bg-opacity-25 flex justify-center items-center z-1100'>
            <div className='  shadow-md relative flex flex-col items-center pb-12 pt-8 bg-F5F2ED rounded px-5 text-center'>
                <button className=' absolute top-1 right-1' onClick={onClose}><img src='/close.png' /></button>
                <form onSubmit={handleSubmit}>
                    <h3 className='text-2xl co-646564 pb-5 font-bold'>註冊會員帳號</h3>
                    <input className=' mb-4 w-72 p-2' type='text' name='displayName' placeholder="請輸入使用者姓名" onChange={handleChange} value={formFields.displayName}></input><br />
                    <input className=' mb-4 w-72 p-2' type='email' name='email' placeholder="請輸入信箱" onChange={handleChange} value={formFields.email}></input><br />
                    <input className='mb-4 w-72 p-2' type='password' name='password' placeholder="請輸入帳號" onChange={handleChange} value={formFields.password}></input><br />
                    <button type='submit' className='bg-6C8272 hover:bg-5B6E60 shadow-md hover:shadow-xl text-lg text-white w-72 p-2' >註冊帳號</button>
                </form>
                <div className='mt-4 mb-4 flex items-center justify-center'>
                    <div className='flex-grow border-t border-gray-400 w-28'></div>
                    <span className='mx-5 text-lg text-gray-400'>or</span>
                    <div className='flex-grow border-t border-gray-400 w-28'></div>
                </div>
                <button onClick={logGoogleUser} className=' hover:bg-blue-100 shadow-md hover:shadow-xl border border-blue-500 t-4 w-72 text-lg bg-white flex items-center justify-center text-blue-500 font-medium'><img src='/google.png' className="w-5 mr-2" />Login with Google</button>
                <div className='text-base co-646564 h-8 mt-2'>已經有帳戶? <button onClick={handleLoginClick} className='hover:font-bold' >請登入</button>
                    {isLoading ? <FromLoading /> : (message && <div className="mb-3 text-orange-700">{message}</div>)}
                </div>
            </div>
        </div>

    )

}

export default RegisterForm
import { firebaseLogin } from './app/api/firebase/loginFirebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
  };
});

describe('firebaseLogin', () => {
  it('authenticates the user', async () => {
    const fakeUser = { email: 'test@example.com', uid: '12345' };
    const email = 'test@example.com';
    const password = 'password123';

    // 設置 signInWithEmailAndPassword 的模擬實現
    signInWithEmailAndPassword.mockResolvedValue(fakeUser);

    // 呼叫你的函數
    const user = await firebaseLogin({ email, password });

    // 確保 signInWithEmailAndPassword 被正確調用
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);
    // 檢查函數返回的結果
    expect(user).toEqual(fakeUser);
  });
});



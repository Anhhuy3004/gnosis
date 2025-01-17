import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Login.module.scss'; // Assuming this is where your provided CSS is stored
import googleLogo from '../../assets/images/google1.png'; // Make sure the path is correct
import logo from '../../assets/images/logo1.png'; // Make sure the path is correct
import { login } from '../../redux/action/authActions';
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithGoogleAction } from '../../redux/action/authActions';
// import { checkDuplicateProfile } from '../../redux/action/profileActions';
// import { logout } from '../../redux/action/authActions';


const Login = () => {
    // const { user } = useSelector(state => state.auth); // Giả sử authReducer lưu trữ thông tin người dùng

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);
    const profileComplete = useSelector(state => state.auth.profileComplete);
    const profileCompleteGoogle = useSelector(state => state.auth.profileCompleteGoogle);

    const navigate = useNavigate();
    useEffect(() => {
        if (isLoggedIn) {
            if (!profileComplete && !profileCompleteGoogle) {
                navigate('/createprofile');
            } else {
                navigate('/browsecourse');
            }
        }
    }, [isLoggedIn, profileComplete, profileCompleteGoogle, navigate]);

    const handleLogin = async (e) => {

        e.preventDefault();
        dispatch(login(email, password));


    };
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            await dispatch(loginWithGoogleAction(response.access_token));
            // Sau khi cập nhật trạng thái Redux, kiểm tra xem người dùng đã hoàn thành profile chưa

        },
    });


    return (

        <div className={styles.container}>
            <div className={styles.leftSection}>
                {/* Background image is set via CSS */}
            </div>
            <div className={styles.rightSection}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" />
                </div>
                <p className={styles.textLogin}>Login</p>
                <div className={styles.loginForm}>
                    <form onSubmit={handleLogin}>

                        <div className={styles.formControl}>

                            <input
                                className={styles.input}
                                type="email"
                                value={email}
                                placeholder='Email'
                                onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>
                        <div className={styles.formControl}>

                            <input
                                className={styles.input}
                                type="password"
                                value={password}
                                placeholder='Password'
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p style={{ color: '#FF0000', fontWeight: 'bold', margin: '10px 0', borderRadius: '5px', textAlign: 'center', }}>{error} </p>}
                        <div className={styles.formControl}>
                            <button type="submit" disabled={loading} className={styles.button}>Login</button>
                        </div>
                    </form>
                    <div className={styles.separator}>OR</div>
                    <div className={styles.formControl}>

                        <button onClick={loginWithGoogle}
                            type="button"
                            className={styles.googleSignin}

                        >
                            <img
                                src={googleLogo}
                                alt="Sign in with Google"
                                style={{ marginRight: '1rem' }}
                            />
                            Sign in with Google
                        </button>
                    </div>
                </div>
                <div className={styles.footer}>
                    <p>Not registered? <a href="/register">Create an account</a></p>
                    <div className={styles.trythis}>
                        <a href="/browsecoursenologin">Preview</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
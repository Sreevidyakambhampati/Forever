// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';
import Loading from './common/Loading';
import { backendUrl } from './App';
import ServerError from './common/ServerError';
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';



const Layout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [loading, setLoading] = useState(true);
    let [errors, setErrors] = useState('');
    let isLoggedIn = useSelector(state => state?.auth?.loggedIn);

    useEffect(() => {
        let TRIES_LEFT = 5;
        async function isAuthenticated() {
            setLoading(true);
            try {
                // eslint-disable-next-line no-undef
                let response = await axios.get(`${backendUrl}/auth/verify`, { withCredentials: true });
                dispatch(login(response?.data));
                setLoading(false);
                setErrors('');
            } catch (err) {
                TRIES_LEFT--;
                if (err?.response?.status === 401) {
                    setTimeout(() => {
                        toast.error('UnAuthorized User! Please SIGN IN');
                    }, 2000);
                    setTimeout(() => {
                        dispatch(logout());
                        navigate('/login');
                    }, 3000);
                } else {
                    if (TRIES_LEFT) {
                        await isAuthenticated();
                    } else {
                        setLoading(false);
                        setErrors(err?.message);
                    }
                }
            }
        }
        if (!isLoggedIn) {
            isAuthenticated();
        }
        // eslint-disable-next-line
    }, [])
    return (
        <div className='layout-container'>
            {loading && <Loading />}
            {!loading && errors && <ServerError errors={errors} />}
            {!loading && !errors && (
                <>
                    <div className='bg-gray-50 min-h-screen'>
                        <ToastContainer />
                        <Navbar />
                        <hr />
                        <div className='flex w-full'>
                            <Sidebar />
                            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Layout;
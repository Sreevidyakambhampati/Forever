// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import LottieFile from '../assets/lottie/page_not_found.json';
import { toast } from 'react-toastify';

const PageNotFound = () => {
    useEffect(() => {
        toast.warn('Requested Page Not Found');
        // eslint-disable-next-line
    }, [])
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50vw',
            height: '30vh',
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
            <div>
                <h3 style={{ fontSize: '31px' }}>Page Not Found</h3>
                <Link to={"/"}>
                    <button
                        className="bg-transparent border border-gray-400 text-black text-lg mt-12 ml-12 py-2 hover:bg-red-100 cursor-pointer p-3 rounded-sm"
                    >
                        Home Page ➺
                    </button>

                </Link>
            </div>
        </div>
    );
}

export default PageNotFound;
// eslint-disable-next-line no-unused-vars
import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/lottie/server_error.json';

// eslint-disable-next-line react/prop-types
const ServerError = ({ errors }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '70%'
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '40%',
                    height: '40%'
                }}
            />
            <h1 style={{ color: 'red' }}>There is an issue with site access</h1>
            <span style={{ fontSize: '17px', color: 'red' }}>{errors}</span>
            <button
                style={{
                    fontSize: '17px',
                    padding: '3px',
                    aspectRatio: '3/1.7',
                    width: '100px',
                    border: '1px solid #010101',
                    marginTop: '20px',
                    borderRadius: '3px'
                }}
                onClick={() => {
                    window.location.href = '/';
                }}
            >
                Try Again
            </button>
        </div>
    );
}

export default ServerError;
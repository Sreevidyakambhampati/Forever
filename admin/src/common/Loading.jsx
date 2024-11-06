// eslint-disable-next-line no-unused-vars
import React from 'react';
import Lottie from 'lottie-react';
import LottieFile from '../assets/lottie/loading.json';
const Loading = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '300px',
            marginLeft: '40%'
        }}>
            <Lottie
                animationData={LottieFile}
                loop={true}
                autoplay={true}
                style={{
                    width: '100%',
                }}
            />
            <h1>Loading...</h1>
        </div>
    );
}

export default Loading;
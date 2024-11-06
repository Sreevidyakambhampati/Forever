// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const Navbar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const onLogout = async () => {
		const confirmed = window.confirm(`Are you sure to "LOGOUT" ?`);
		if (!confirmed) return
		toast.info('Logging Out...');
		try {
			// eslint-disable-next-line no-undef
			await axios.delete(`${backendUrl}/auth/logout`, { withCredentials: true });
			toast.done('Logged Out Successfully!');
			setTimeout(() => {
				dispatch(logout());
				navigate('/login');
			}, 1500);
		} catch (err) {
			console.log(err);
			toast.error('Error occurred while Logging Out, please try again');
		}
	}

	return (
		<div className='flex items-center py-2 px-[4%] justify-between'>
			<img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
			<button onClick={onLogout} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
		</div>
	)
}

export default Navbar
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { FaEdit, FaTrashAlt, FaCrown } from 'react-icons/fa';

const User = ({ user, onEdit, onDelete }) => {
    return (
        <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <div className="relative">
                <img
                    src={user?.profileImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzlTu-srPhZVHmio1kxjSNoL9og-408rtJqg&s'}
                    alt={user?.name}
                    referrerPolicy='no-referrer'
                    className="w-full h-40 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                        onClick={() => onEdit(user)}
                        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition duration-300"
                    >
                        <FaEdit className="text-blue-600" />
                    </button>
                    <button
                        onClick={() => onDelete(user?._id)}
                        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition duration-300"
                    >
                        <FaTrashAlt className="text-red-600" />
                    </button>
                </div>
            </div>
            <div className="p-4 flex flex-col justify-between">
                <div className='flex'>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.name}</h2>
                    {user?.role === 'admin' && <FaCrown className="text-yellow-500 ml-2 mt-2" title="Admin" />}
                </div>
                <p className="text-gray-600 text-sm mb-1">{user?.email}</p>
                <p className="text-gray-500 italic text-sm mb-4">{user?.role}</p>
            </div>
        </div>
    );
};

export default User;
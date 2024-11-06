/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const UserForm = ({ user, onClose, onUpdateUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('seller');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (user) {
                await axios.put(`${backendUrl}/admin/user/${user?._id}`, { name, email, role }, { withCredentials: true });
                toast.success('User updated successfully!');
                onUpdateUser(prevUsers => prevUsers.map((u) => (u?._id === user?._id ? { ...u, name, email, role } : u)))
            } else {
                let response = await axios.post(`${backendUrl}/admin/user`, { name, email, role }, { withCredentials: true });
                toast.success('User created successfully!');
                onUpdateUser(prevUsers => [...prevUsers, { name, email, role, _id: response?.data?._id }]);
            }
            onClose();
        } catch (error) {
            toast.error(error?.message || 'Error while saving the user!');
            if (error?.response?.status === 401) {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-4">{user ? 'Edit User' : 'Create User'}</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                >
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-300">
                {user ? 'Update User' : 'Create User'}
            </button>
        </form>
    );
};

export default UserForm;
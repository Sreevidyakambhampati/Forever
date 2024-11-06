// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { backendUrl } from '../App';
import User from '../components/User';
import UserForm from '../components/UserForm';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import PageNotFound from '../common/PageNotFound';
import { FaHourglassHalf } from "react-icons/fa6";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const userRole = useSelector(state => state?.auth?.userInfo?.role);
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${backendUrl}/admin/users`, { withCredentials: true });
                setUsers(response.data);
            } catch (error) {
                if (error?.response?.status === 401) {
                    window.location.href = '/login';
                }
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if(isAdmin){
            fetchUsers();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggleModal = () => {
        setShowModal((prev) => !prev);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        handleToggleModal();
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm(`Are you sure you want to delete this user?`);

        if (confirmed) {
            try {
                console.log(userId);
                await axios.delete(`${backendUrl}/admin/user/${userId}`, {
                    withCredentials: true,
                });
                setUsers(users.filter(user => user._id !== userId));
                toast.success('User deleted successfully!');
            } catch (error) {
                toast.error(error?.message || 'Error while deleting the user!');
                if (error?.response?.status === 401) {
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 3000);
                }
            }
        }
    };

    if(!isAdmin){
        return <PageNotFound />
    }

    if (loading) {
        return <div className="text-center text-blue-600 font-semibold text-lg inline-flex items-center justify-center">
        <FaHourglassHalf className="mr-1" /> Loading...
      </div>
    }

    if (error) {
        return <div className="text-center text-red-500 font-semibold text-lg py-8">{error}</div>
    }

    if (Array.isArray(users) && users.length === 0) {
        return <div className="text-center text-gray-500 font-semibold text-lg py-8">No Users!</div>;
    }


    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-semibold">Users</h1>
                <button
                    onClick={() => {
                        setEditingUser(null);
                        handleToggleModal();
                    }}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-300"
                >
                    Add User
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                {users.map((user) => (
                    <User key={user._id} user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />
                ))}
            </div>

            {showModal && (
                <Modal onClose={handleToggleModal}>
                    <UserForm user={editingUser} onClose={handleToggleModal} onUpdateUser={setUsers} />
                </Modal>
            )}
        </div>
    );
};

export default Users;
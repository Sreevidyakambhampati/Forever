// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FiCheckCircle } from "react-icons/fi";
import { TbXboxX } from "react-icons/tb";
import { backendUrl } from '../App';
import PageNotFound from '../common/PageNotFound';
import { FaHourglassHalf } from "react-icons/fa6";
import { MdPendingActions } from "react-icons/md";
import { toast } from 'react-toastify';

const UserRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userRole = useSelector(state => state?.auth?.userInfo?.role);
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if(isAdmin){
            fetchRequests();
        }
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/admin/requests`, { withCredentials: true });
            toast.success('Fetched User Requests!')
            setLoading(false);
            setRequests(response?.data || []);
        } catch (err) {
            setLoading(false);
            toast.error(err?.response?.data?.message || err?.message || 'Failed to fetch User Requests')
            if (err?.response?.status === 401) {
                window.location.href = '/login';
            }
            setError(err?.response?.data?.message || err?.message);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const apiName = status === 'approved' ? `approveRequest` : `rejectRequest`;
           let response = await axios.get(`${backendUrl}/admin/${apiName}/${id}`, { withCredentials: true });

            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req._id === id ? { ...req, status } : req
                )
            );

            toast.success(response?.data?.message || `Request ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || 'Failed to update request status')
            if (err?.response?.status === 401) {
                window.location.href = '/login';
            }
        }
    };

    if (!isAdmin) {
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

    if (Array.isArray(UserRequests) && UserRequests.length === 0) {
        return <div className="text-center text-gray-500 font-semibold text-lg py-8">No User Requests!</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">User Requests</h2>
            <div className="space-y-4">
                {requests.map((request) => (
                    <div
                        key={request._id}
                        className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-800">{request.email}</span>
                            <span
                                className={`px-2 py-1 rounded-full text-sm font-semibold ${request.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : request.status === 'approved'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600'
                                    }`}
                            >
                                {request.status === 'pending' && (
                                    <MdPendingActions className="inline h-4 w-4 text-yellow-600 mr-1" />
                                )}
                                {request.status === 'approved' && (
                                    <FiCheckCircle className="inline h-4 w-4 text-green-600 mr-1" />
                                )}
                                {request.status === 'rejected' && (
                                    <TbXboxX className="inline h-4 w-4 text-red-600 mr-1" />
                                )}
                                {request.status.charAt(0).toUpperCase() +
                                    request.status.slice(1)}
                            </span>
                        </div>
                        {request.status === 'pending' && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => updateStatus(request._id, 'approved')}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => updateStatus(request._id, 'rejected')}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserRequests;
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Provider } from 'react-redux'
import Layout from './Layout';
import store from './store';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from "react-router-dom";
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import PageNotFound from './common/PageNotFound'
import Login from './pages/Login';
import Users from './pages/Users';
import UserRequests from './pages/UserRequests';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹'

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path="/" element={<Layout />}>
				<Route index element={
					<></>
				} />
				<Route path="add" element={
					<Add />
				} />
				<Route path="list" element={
					<List />
				} />
				<Route path="orders" element={
					<Orders />
				} />
				<Route path="users" element={
					<Users />
				} />
				<Route path="userRequests" element={
					<UserRequests />
				} />
				<Route path='*' element={
					<PageNotFound />
				} />
			</Route>
			<Route path="login" element={
				<Login />
			} />
		</Route>
	)
);

export default function App() {
	return (
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	);
}
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { FaHourglassHalf } from "react-icons/fa6";

const Orders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAllOrders = async () => {

    try {
      setLoading(true);
      const response = await axios.post(backendUrl + '/api/order/list', {}, { withCredentials: true })
      setLoading(false);
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch Orders');
      toast.error(err.message)
      if (err?.response?.status === 401) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    }


  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { withCredentials: true })
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || error?.message)
      if (error?.response?.status === 401) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  if (loading) return <div className="text-center text-blue-600 font-semibold text-lg inline-flex items-center justify-center">
  <FaHourglassHalf className="mr-1" /> Loading...
</div>
  if (error) return <div className="text-center text-red-500 font-semibold text-lg py-8">{error}</div>;
  if (Array.isArray(orders) && orders.length === 0) return <div className="text-center text-gray-500 font-semibold text-lg py-8">No Orders</div>;


  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='mix-blend-darken hover:scale-110 transition ease-in-out max-w-full max-h-full object-cover' src={order?.items[0]?.image[0] || assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                    }
                    else {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>
                    }
                  })}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
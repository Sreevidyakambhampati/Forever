// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios';
import { FaHourglassHalf } from "react-icons/fa6";


const List = () => {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + '/api/product/seller/list', { withCredentials: true })
      setLoading(false);
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch Orders');
      console.log(err)
      toast.error(err.message)
      if (err?.response?.status === 401) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    }
  }

  const removeProduct = async (id) => {
    try {

      const confirmed = window.confirm("Are you sure to remove the item ? ");

      if (!confirmed) return

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { withCredentials: true })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
      if (error?.response?.status === 401) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  if (loading) return <div className="text-center text-blue-600 font-semibold text-lg inline-flex items-center justify-center">
    <FaHourglassHalf className="mr-1" /> Loading...
  </div>
  if (error) return <div className="text-center text-red-500 font-semibold text-lg py-8">{error}</div>;
  if (Array.isArray(list) && list.length === 0) return <div className="text-center text-gray-500 font-semibold text-lg py-8">No Products!</div>;


  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='mix-blend-darken hover:scale-110 transition ease-in-out w-20 object-cover rounded-md' src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }

      </div>
    </>
  )
}

export default List
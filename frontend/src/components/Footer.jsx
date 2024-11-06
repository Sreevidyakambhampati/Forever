import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
            Forever is more than a shop, it&apos;s the celebration of quality and style that transcends time. From the day we opened our doors until today, we have stood by our commitment to give only the best products we can find, chosen for staying power. From the same tradition of craftsmanship and excellence from the early printing industry, comes our history that stretches back to the 1500s. At Forever, we believe every item we offer is a piece of art worthy of being treasured. Come join us as we redefine shopping with a focus on timeless elegance and lasting value.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <Link to={'/'}>Home</Link>
                <Link to={'/about'}>About us</Link>
                <Link to={'/contact'}>Contact</Link>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+91 96182 42005</li>
                <li>contact@forever.com</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ forever.com - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer

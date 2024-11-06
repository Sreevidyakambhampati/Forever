/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={`/product/${id}`}
      className="text-gray-700 cursor-pointer w-48"
    >
      <div className="h-72 flex flex-col justify-between border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="w-full h-48 overflow-hidden flex justify-center items-center">
          <img
            src={image[0]}
            alt={name}
            className="hover:scale-110 transition ease-in-out max-w-full max-h-full object-cover"
          />
        </div>
        <div className="p-3 text-center">
          <p className="pb-1 text-sm">{name}</p>
          <p className="text-sm font-medium">{currency}{price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
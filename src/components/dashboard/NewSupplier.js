"use client";

import React from "react";
import Image from "next/image";
import UserImage from "../../../public/user.png";

const NewSupplier = () => {
  const suppliers = [
    "Supplier 1",
    "Supplier 2",
    "Supplier 3",
    "Supplier 4",
    "Supplier 5",
  ];
  const createdAt = [
    "Nov 10, 2024",
    "Nov 11, 2024",
    "Nov 12, 2024",
    "Nov 13, 2024",
    "Nov 14, 2024",
  ];
  const status = ["Active", "Active", "Active", "Active", "Active"];
  const avatar = [UserImage, UserImage, UserImage, UserImage, UserImage];
  return (
    <div className="w-full h-full p-4 rounded-xl bg-[#fff] border-[1px] border-gray-300">
      <div className="mb-4">
        <span className="font-semibold text-lg">New Supplier</span>
      </div>
      {suppliers.map((supplier, index) => (
        <div key={index} className="flex justify-between mb-4">
          <div className="flex gap-2">
            <Image
              src={avatar[index]}
              alt={`Avatar of ${supplier}`}
              className="rounded-full w-[50px] h-[50px]"
            />
            <div>
              <div className="font-semibold text-[14px] xl:text-lg">{supplier}</div>
              <div className="text-gray-400 text-[10px] xl:text-lg">{createdAt[index]}</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-green-600 px-2 rounded-full text-white text-sm">
              {status[index]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default NewSupplier;

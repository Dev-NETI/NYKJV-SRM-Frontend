"use client";

import React from "react";
import Image from "next/image";
import UserImage from "../../../public/user.png";
import axios from "@/lib/axios";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const NewSupplier = () => {
  const [suppliers, setSuppliers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchNewAddedSupplier = async () => {
    try {
      const response = await axios.get("/api/supplier/new_added_supplier");
      setSuppliers(response.data.new_added_suppliers);
      // console.log(
      //   "Succesfully fetched new added suppliers",
      //   response.data.new_added_suppliers
      // );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching new added supplier from backend", error);
    }
  };

  React.useEffect(() => {
    fetchNewAddedSupplier();
  }, []);

  return (
    // <div className="w-full h-full p-4 rounded-xl bg-[#fff] border-[1px] border-gray-300">
    //   <div className="mb-4">
    //     <span className="font-semibold text-lg">New Supplier</span>
    //   </div>
    //   {suppliers.map((supplier, index) => (
    //     <div key={index} className="flex justify-between mb-4">
    //       <div className="flex gap-2">
    //         <Image
    //           src={UserImage}
    //           alt={`Avatar of ${supplier}`}
    //           className="rounded-full w-[50px] h-[50px]"
    //         />
    //         <div>
    //           <div className="font-semibold text-[14px] xl:text-lg">
    //             {supplier.name}
    //           </div>
    //           <div className="text-gray-400 text-[10px] xl:text-lg">
    //             {supplier.created_at}
    //           </div>
    //         </div>
    //       </div>
    //       <div className="flex items-center">
    //         {supplier.is_active == "Active" ? (
    //           <div className="bg-green-600 px-2 rounded-full text-white text-sm">
    //             {supplier.is_active}
    //           </div>
    //         ) : (
    //           <div className="bg-red-600 px-2 rounded-full text-white text-sm">
    //             {supplier.is_active}
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   ))}
    // </div>
    <>
      {loading ? (
        <div className="w-full h-full p-4 rounded-xl bg-[#fff] border-[1px] border-gray-300">
          <Box sx={{ width: "100%", p: 4 }}>
            <div>
              {Array.from({ length: 7 }).map((_, index) => (
                <div className="flex justify-between w-full mt-5" key={index}>
                  <div className="flex gap-2 w-full h-auto">
                    <div>
                      <Skeleton
                        variant="circular"
                        width={50}
                        height={50}
                        animation="wave"
                      />
                    </div>
                    <div>
                      <div>
                        <Skeleton animation="wave" width={100} height={20} />
                      </div>
                      <div>
                        <Skeleton animation="wave" width={100} height={20} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Skeleton animation="wave" width={100} height={20} />
                  </div>
                </div>
              ))}
            </div>
          </Box>
        </div>
      ) : (
        <div className="w-full h-full p-4 rounded-xl bg-[#fff] border-[1px] border-gray-300">
          <div className="mb-4">
            <span className="font-semibold text-lg">New Supplier</span>
          </div>
          {suppliers.map((supplier, index) => (
            <div key={index} className="flex justify-between mb-4">
              <div className="flex gap-2">
                <Image
                  src={UserImage}
                  alt={`Avatar of ${supplier}`}
                  className="rounded-full w-[50px] h-[50px]"
                />
                <div>
                  <div className="font-semibold text-[14px] xl:text-lg">
                    {supplier.name}
                  </div>
                  <div className="text-gray-400 text-[10px] xl:text-lg">
                    {supplier.created_at}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {supplier.is_active == "Active" ? (
                  <div className="bg-green-600 px-2 rounded-full text-white text-sm">
                    {supplier.is_active}
                  </div>
                ) : (
                  <div className="bg-red-600 px-2 rounded-full text-white text-sm">
                    {supplier.is_active}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default NewSupplier;

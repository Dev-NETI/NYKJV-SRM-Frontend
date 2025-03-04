import React from "react";
import OtherLink from "./OtherLink";

function Footer() {
  return (
    <div
      className="fixed bottom-0 left-0 w-full  flex flex-col
    bg-gray-200 p-4"
    >
      <OtherLink />
      <div className="flex items-center justify-center">
        <p
          className="text-stone-900 font-semibold 
                     text-sm hover:text-lg hover:font-bold hover:text-stone-950 
                     md:text-md lg:text-md"
        >
          © NYK-JV SRM 2024. All Rights Reserved
        </p>
      </div>
    </div>
  );
}

export default Footer;

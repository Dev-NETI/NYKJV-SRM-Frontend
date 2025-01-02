import React from "react";

function Footer() {
  return (
    <div className="fixed bottom-0 left-0 w-full flex items-center justify-center custom-bg-nyk-50 p-4">
      <p
        className="text-stone-900 font-semibold 
                     text-sm hover:text-lg hover:font-bold hover:text-stone-950 
                     md:text-md lg:text-md"
      >
        © NYK-JV SRM 2024
      </p>
    </div>
  );
}

export default Footer;

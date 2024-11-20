"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function SrmLogo() {
  return (
    <motion.div
      className="px-5 py-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="w-64 sm:w-48 md:w-40 lg:w-64">
        <Image
          src="/SRM.png"
          width={250}
          height={250}
          alt="SRM Logo"
          className="w-full h-auto"
        />
      </div>
    </motion.div>
  );
}

export default SrmLogo;

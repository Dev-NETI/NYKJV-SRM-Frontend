"use client";
import React from "react";
import LoginLinks from "@/app/LoginLinks";
import { motion } from "framer-motion";

function WelcomeLabel() {
  const label = "Welcome to NYK-JV Supplier Relationship Management System";

  const textAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="basis-6/12 flex flex-col gap-2 p-10 ">
      <motion.p
        className="text-stone-800 font-bold text-5xl"
        variants={textAnimation}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      >
        {label}
      </motion.p>

      <LoginLinks />
    </div>
  );
}

export default WelcomeLabel;

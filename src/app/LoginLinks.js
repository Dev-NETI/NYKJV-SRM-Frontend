"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { motion } from "framer-motion";

const LoginLinks = () => {
  const { user } = useAuth({ middleware: "guest" });

  return (
    <>
      {user ? (
        <div className="flex p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.2 }}
              onHoverStart={(event) => {}}
              onHoverEnd={(event) => {}}
              whileTap={{ scale: 0.9, rotate: 3 }}
            >
              <Link
                href="/dashboard"
                className="bg-stone-950 hover:bg-purple-700 text-slate-50 
                rounded-full 
                text-sm md:text-lg lg:text-lg 
                py-2 md:py-3 lg:py-3 
                px-5 md:px-8 lg:px-8"
              >
                Dashboard
              </Link>
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.2 }}
              onHoverStart={(event) => {}}
              onHoverEnd={(event) => {}}
              whileTap={{ scale: 0.9, rotate: 3 }}
            >
              <Link
                href="/login"
                className="bg-stone-950 hover:bg-purple-700 text-slate-50 
                rounded-full 
                text-sm md:text-lg lg:text-lg 
                py-2 md:py-3 lg:py-3 
                px-5 md:px-8 lg:px-8"
              >
                Login
              </Link>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                color: "#2563EB",
                textDecoration: "underline",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* <Link
                href="/register"
                className="text-stone-950 font-semibold 
                text-sm md:text-lg lg:text-lg 
                py-1 md:py-3 lg:py-3"
              >
                Don't have an account? Click here to get started!
              </Link> */}
            </motion.div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default LoginLinks;

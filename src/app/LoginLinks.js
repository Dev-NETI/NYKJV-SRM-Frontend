"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { motion } from "framer-motion";

const LoginLinks = () => {
  const { user } = useAuth({ middleware: "guest" });

  return (
    <div className="flex justify-end items-end">
      {user ? (
        <div className="flex p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/dashboard"
              className="bg-stone-800 text-slate-50 
              rounded-full text-lg py-3 px-8"
            >
              Dashboard
            </Link>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/login"
              className="bg-stone-800 text-slate-50 
              rounded-full text-lg py-3 px-8"
            >
              Login
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/register"
              className="bg-stone-800 text-slate-50 
              rounded-full text-lg py-3 px-8"
            >
              Register
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoginLinks;

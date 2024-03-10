"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import AuthContext from "@/context/AuthContext";
import { Button } from "./button";
import { jwtDecode } from "jwt-decode";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {


  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {

  interface DecodedToken {
    username: string
  }

  const {authTokens, logoutUser} = useContext(AuthContext)

  const [ isAuthenticated, setIsAuthenticated ] = useState<boolean | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authTokens') : null;

  let username = ''

  if (token) {
    const decoded: DecodedToken = jwtDecode(token);
    username = decoded.username;
  }

  useEffect(() => {
    setIsAuthenticated(!authTokens);
  }, [authTokens])

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="top-0 border-[1px] bg-[#0000003f] backdrop-blur w-full fixed border-white/[0.2] flex py-4">
      <div className="flex justify-center gap-5 flex-1"> {/* flex-1 для того чтобы children занимал всю доступную ширину */}
        {children}
      </div>
      <div className="flex items-center justify-end pr-4 gap-4 absolute right-4"> 
      {!isAuthenticated === null ? (
        <p></p>
      ) : !isAuthenticated && username != '' ? (
        <>
          <p className="text-white">{username}</p>
          <p className="text-white cursor-pointer" onClick={logoutUser}>Logout</p>
        </>
      ) : (
        <>
          <Link className="text-white" href="/login">Login</Link>
          <Link className="text-white" href="/sign-up">Sign Up</Link>
        </>
      )}
      </div>
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"/>
      <div>
        <h4 className="text-xl font-bold mb-1  text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-200 hover:text-[#c2c2c2] "
    >
      {children}
    </Link>
  );
};

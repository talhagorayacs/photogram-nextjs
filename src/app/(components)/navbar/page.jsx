"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useDispatch,useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const dispatch = useDispatch()
  useEffect(() => {
    if (session) {
      dispatch(setUser({ userInfo:session.user }));

      console.log("Session in Navbar:", session);
    } else {
      console.log("No session found");
    }
  }, [session, dispatch]);

  const userInfo = useSelector((state) => state.auth.userInfo);

console.log("i am user info from store",userInfo);

  
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

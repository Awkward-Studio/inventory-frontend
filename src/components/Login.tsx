"use client";

import React, { use, useState } from "react";
import Image from "next/image";
import loader from "../../public/loader.gif";

import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/ui/PrimaryButton";

type Props = {};

function Login({}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("hhhh");
  const [password, setPassword] = useState("fffff");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isUserPresent, setIsUserPresent] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const login = async () => {
    setIsSigningIn(true);
    setIsUserPresent(true);
    try {
      let redirectURL = "/inventory";
      router.push(redirectURL);
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      {/* Overlay to disable page */}
      {isSigningIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Image src={loader} width={100} height={100} alt="Loading" />
        </div>
      )}
      <div className="flex flex-col justify-center items-center space-y-5 mt-10">
        <div className="text-gray-800 font-semibold text-3xl">
          Login to your Account
        </div>
        <div className="text-gray-500 font-semibold text-lg">
          Welcome back ! Please enter your details.
        </div>
      </div>
      <div className="flex flex-col w-full justify-center items-center mt-10 space-y-5">
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter your Email"
          className="border-2 border-gray-400 bg-transparent placeholder-gray-400 p-3 w-[80%] lg:w-1/4 rounded-xl"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your Password"
          className="border-2 border-gray-400 bg-transparent placeholder-gray-400 p-3 w-[80%] lg:w-1/4 rounded-xl"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <div className="flex flex-col justify-center items-center w-full mt-10 space-y-4">
        <PrimaryButton
          title={"Sign In"}
          handleButtonPress={login}
          isLoading={isSigningIn}
        />
        {isUserPresent ? (
          <></>
        ) : (
          <>
            <div className="text-red-600">{errorMessage}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;

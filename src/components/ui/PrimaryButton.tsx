"use client";

import React from "react";
import Image from "next/image";
import loader from "../../../public/loader.gif";

type Props = {};

function PrimaryButton({ title, handleButtonPress, isLoading }: any) {
  return (
    <button
      className={`bg-red-500 rounded-xl h-14 flex flex-row justify-center items-center w-1/4 text-white font-bold ${
        isLoading ? "opacity-50" : ""
      }`}
      onClick={handleButtonPress}
    >
      {title}
      {isLoading && <Image src={loader} width={50} height={50} alt="Logo" />}
    </button>
  );
}

export default PrimaryButton;

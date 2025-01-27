"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/Logomark.png";
import loader from "../../public/loader.gif";
// import { Home01Icon, Layers01Icon, Logout04Icon } from "hugeicons-react";
import {
  Car,
  ClipboardList,
  House,
  Layers3,
  LogOut,
  Menu,
  PlusIcon,
  UserRoundCog,
} from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Sidebar({ home }: any) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();

  console.log("THIS IS THE HOME - ", home);

  const logout = async () => {
    router.push("/");
  };

  const pathname = usePathname();

  return (
    <>
      <div className="sm:flex lg:hidden z-10 absolute top-5 right-5">
        <Drawer>
          <DrawerTrigger>
            <Menu color="#EF4444" size={38} />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex justify-center">
                <Image src={logo} width={50} height={50} alt="Logo" />
              </DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button
                  className="flex justify-between p-4 border-b w-full"
                  onClick={() => router.push(home)}
                >
                  <House />
                  <div>Home</div>
                </Button>
              </DrawerClose>
              <Button
                onClick={logout}
                className="flex justify-between p-4 border-b"
              >
                {isLoggingOut ? (
                  <Image src={loader} width={50} height={50} alt="Logo" />
                ) : (
                  <>
                    <LogOut />
                    <div>Logout</div>
                  </>
                )}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="hidden lg:flex sticky top-0 shadow-xl p-6 flex-col h-dvh bg-gray-50 min-w-[80px] items-center py-8">
        <div className="mb-10">
          <Image src={logo} width={50} height={50} alt="Logo" />
        </div>
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col space-y-5">
            <Link className="border-2 rounded-md shadow-md p-3" href={home}>
              <House />
            </Link>
            <Link
              className="border-2 rounded-md shadow-md p-3"
              href={`/inventory/create-item`}
            >
              <PlusIcon />
            </Link>
            <Link
              className="border-2 rounded-md shadow-md p-3"
              href={`/inventory/create-invoice`}
            >
              <ClipboardList />
            </Link>
          </div>
          <div>
            <button
              onClick={logout}
              className={`border-2 rounded-md shadow-md ${
                isLoggingOut ? "opacity-50 p-1" : "p-3"
              }`}
            >
              {isLoggingOut ? (
                <Image src={loader} width={50} height={50} alt="Logo" />
              ) : (
                <LogOut />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

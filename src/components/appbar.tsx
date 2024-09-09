"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useClerk,
  UserButton,
} from "@clerk/nextjs";
import { Bird } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

function Appbar() {
  const { signOut, closeSignIn } = useClerk();
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 border-b flex items-center py-3 px-7 z-50 bg-background h-16">
      <div className=" flex justify-between items-center w-full">
        <div
          className="flex justify-center items-center text-orange-600 gap-x-1 hover:cursor-pointer"
          onClick={() => router.push("/browse")}
        >
          <Bird height={25} width={25} />
          <div className="text-2xl text-extrabold">Skillify</div>
        </div>
        <div className="flex gap-x-2 items-center">
          <SignedOut>
            <Button asChild>
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            {/* <SignOutButton redirectUrl="/browse"> */}
            <Button variant={"destructive"} onClick={() => signOut()}>
              Sign Out
            </Button>
            {/* </SignOutButton> */}
          </SignedIn>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default Appbar;

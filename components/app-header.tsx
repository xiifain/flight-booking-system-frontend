"use client";

import { deleteCookie, getCookie } from "cookies-next";
import { useAuthorizedUser } from "@/api-client/users/me";
import { createAvatarName, createFullName } from "@/utils/create-full-name";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const { data } = useAuthorizedUser();

  const router = useRouter();

  const signOut = () => {
    const cookie = getCookie("jwt_token");

    if (cookie) {
      deleteCookie("jwt_token");
    }

    router.push("/login");
  };

  const goToPayments = () => {
    router.push("/payments");
  };

  const goToHome = () => {
    router.push("/");
  };

  const goToBookings = () => {
    router.push("/bookings");
  };

  return (
    <>
      <div className="h-14 flex justify-end">
        {data && (
          <Menubar className="items-center m-5 p-0 rounded-full space-x-0 border-none">
            <MenubarMenu>
              <MenubarTrigger className="bg-transparent rounded-full p-0 m-0">
                <h2 className="hidden md:block mx-2 font-medium px-1">
                  {createFullName(data.profile)}
                </h2>
                <Avatar>
                  <AvatarImage src={data.profile.image} />
                  <AvatarFallback>
                    {createAvatarName(data.profile)}
                  </AvatarFallback>
                </Avatar>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={goToHome}>Home</MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={goToBookings}>Bookings</MenubarItem>
                <MenubarItem onClick={goToPayments}>
                  Payment Methods
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={signOut}>Sign out</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>
    </>
  );
}

"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

const UserAccountNav = () => {
  return (
    <Button onClick={() => signOut()} variant="destructive">
      Kijelentkezés
    </Button>
  );
};
export default UserAccountNav;

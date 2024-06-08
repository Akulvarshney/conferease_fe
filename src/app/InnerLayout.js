"use client";

import Navbar from "@/components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const InnerLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div>
      <Navbar pathName={pathname} router={router} />
      {children}
    </div>
  );
};

export default InnerLayout;

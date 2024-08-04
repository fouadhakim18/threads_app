import Link from "next/link";
import Image from "next/image";
import React from "react";
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Topbar = () => {
  return (
    <nav className="topbar">
      <Link href={"/"} className="flex items-center gap-4">
        <Image
          src={"/assets/Threads Logo.svg"}
          alt="logo"
          width={28}
          height={28}
        />
        <Image
          src={"/assets/threads.svg"}
          alt="logo"
          width={85}
          height={85}
          className="max-xs:hidden"
        />
      </Link>
      <div className="flex items-center gap-1">
        <div className="block  md:hidden"></div>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Topbar;

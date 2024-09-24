/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Separator } from "../ui/separator";

export const Navbar = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-4xl">TarkovFlipper</h1>
        <div className="flex gap-2">
          <Link
            href="https://discord.gg/hZAGZ7XDGR"
            target="_blank"
            className="flex items-center gap-1 transition-all duration-100 hover:text-gray"
          >
            <img
              src="/discordLogo.png"
              alt="Discord logo"
              className="h-6 w-6"
            />
            <h1>Discord server</h1>
          </Link>
          <Link
            href="https://github.com/8auu/tarkov-flipper"
            target="_blank"
            className="flex items-center gap-1 transition-all duration-100 hover:text-gray"
          >
            <img src="/githubLogo.png" alt="Github logo" className="h-6 w-6" />
            <h1>GitHub</h1>
          </Link>
        </div>
      </div>
      <Separator className="bg-lightGray" />
    </div>
  );
};

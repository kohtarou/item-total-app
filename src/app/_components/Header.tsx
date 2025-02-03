"use client";
import { PrismaClient } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFish } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const prisma = new PrismaClient();

const Header: React.FC = () => {
  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-2xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white"
          )}
        >
          <div>
            <Link href="/">
              <FontAwesomeIcon icon={faFish} className="mr-1" />
              MyBlogApp
            </Link>
          </div>
          <div className="flex gap-x-6">
            <Link href="/about">About</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

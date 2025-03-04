"use client";
import React from "react";
import Image from "next/image";

export default function BlogHeader() {
  return (
    <div className="bg-gradient-overlay relative">
      <Image
        src="/blogHeader.webp"
        alt="Background"
        width={1440}
        height={250}
        className="object-cover w-full h-[350px] hidden lg:block"
      />
      <Image
        src="/blogHeader.webp"
        alt="Background"
        width={720}
        height={240}
        className="object-cover block h-[240px] w-full lg:hidden"
      />
      <div className="absolute inset-0 flex items-center justify-center px-6 lg:px-0  ">
        <div className="flex flex-col justify-between text-center pt-16 lg:pt-0 ">
          <p className="text-2xl lg:text-5xl text-white font-bold">
            Welcome to Zikoro blog
          </p>
          <p className="text-white text-sm lg:text-base mt-2 font-normal">
            Explore the Latest Trends, Tips, and Updates in Event planning and
            execution
          </p>
        </div>
      </div>
    </div>
  );
}

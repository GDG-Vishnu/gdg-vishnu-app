"use client";

import React from "react";
import { Button3D as MagneticButton } from "@/components/ui/3d-button";

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        {/* Code brackets */}
        <div className="absolute top-20 left-10 text-yellow-400 text-6xl font-mono opacity-20">
          {"{ }"}
        </div>

        {/* Binary numbers */}
        <div className="absolute top-32 right-20 text-purple-300 text-sm font-mono opacity-30 rotate-12">
          <div>01001</div>
          <div>11010</div>
        </div>

        {/* Function symbol */}
        <div className="absolute bottom-32 left-20 text-green-400 text-3xl font-mono opacity-20">
          ()
        </div>

        {/* @ symbol */}
        <div className="absolute bottom-20 right-32 text-blue-400 text-4xl opacity-20">
          @
        </div>

        {/* More binary */}
        <div className="absolute bottom-40 right-10 text-yellow-300 text-xs font-mono opacity-25">
          <div>1010</div>
          <div>0110</div>
        </div>

        {/* Code tags */}
        <div className="absolute top-40 right-40 text-purple-400 text-2xl opacity-20">
          {"</>"}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header */}

        {/* Main heading with Google colors */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-mono leading-tight">
            <div className="mb-2">
              <span className="text-black">Google </span>
              <span className="text-black relative">
                Developer
                {/* Yellow highlight circle */}
                <div className="absolute -inset-2 border-4 border-yellow-400 rounded-full opacity-60 transform rotate-3"></div>
              </span>
            </div>
            <div className="text-black">Groups</div>
            <div className="text-2xl md:text-3xl font-semibold text-gray-600 font-mono tracking-wider mt-2">
              On Campus
            </div>
          </h1>

          <h3 className="text-3xl md:text-4xl font-bold text-blue-600 font-mono tracking-wide">
            Vishnu Bhimavaram
          </h3>
        </div>

        {/* Subtitle */}
        {/* <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-gray-500 font-medium font-mono tracking-wide">
            Converting Ideas Into Reality!
          </p>
        </div> */}

        {/* Coming soon message */}
        <div className="text-center mb-8">
          <MagneticButton className="px-12">Coming Soon</MagneticButton>
        </div>

        {/* Description */}

        {/* Google-colored decorative elements */}
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-8 text-blue-500 opacity-30">
        <div className="w-8 h-8 border-2 border-current transform rotate-45"></div>
      </div>

      <div className="absolute top-1/3 right-8 text-red-500 opacity-30">
        <div className="w-6 h-6 bg-current rounded-full"></div>
      </div>

      <div className="absolute bottom-1/3 left-16 text-green-500 opacity-30">
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-current"></div>
      </div>
    </div>
  );
};

export default ComingSoonPage;

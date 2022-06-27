import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const OnBoarding = () => {
  const [show, setShow] = useState(false)
  return (
    <div className="bg-gray-100">
      <nav className="w-full">
        <div className="py-5 container mx-auto px-6 flex items-center justify-between">
          <div aria-label="logo" role="img">
            <Image
              alt="Foodpals Logo"
              src="/tempLogo.svg"
              width={52.5}
              height={48}
            />
          </div>
          <Link href="/login">
            <button className="focus:outline-none lg:text-lg lg:font-bold focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-transparent transition duration-150 ease-in-out hover:bg-gray-200 rounded border border-indigo-700 text-indigo-700 px-4 sm:px-8 py-1 sm:py-3 text-sm">
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      <div className="bg-gray-100">
        <div className="container mx-auto flex flex-col items-center py-12 sm:py-24">
          <div className="w-11/12 sm:w-2/3 lg:flex justify-center items-center flex-col  mb-5 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-gray-800 font-black leading-7 md:leading-10">
              <span className="text-indigo-700">Cheaper</span>, faster,
              <span className="text-indigo-700"> decentralised </span>
              food delivery.
            </h1>
            <p className="mt-5 sm:mt-10 lg:w-3/4 text-gray-400 font-normal text-center text-sm sm:text-lg">
              We know how it feels like to never have the most desirable food
              delivery, and to always be broke from all your Shopee and clothing
              hauls
            </p>
            <p className="sm:mt-5 lg:w-2/3 text-gray-400 font-normal text-center text-sm sm:text-lg">
              Foodpals delivers you the best food options around you at a low
              price, by using deliverers just like you who happen to be at the
              place and are willing to make a small detour to your location.
            </p>
            <p className="sm:mt-5 lg:w-3/4 text-gray-400 font-normal text-center text-sm sm:text-lg">
              Never go hungry or broke again.
            </p>
          </div>
          <div className="flex justify-center items-center mb-52">
            <Link href="/register">
              <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 lg:text-xl lg:font-bold  rounded text-white px-4 sm:px-10 border border-indigo-700 py-2 sm:py-4 text-sm">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

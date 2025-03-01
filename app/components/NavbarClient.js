"use client";
import React, { useState, useRef, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { Search, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";

const NavbarClient = ({ session }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full text-white">
      {session && session.user ? (
        <div className="w-full">
          <div className="flex justify-between items-center">
            <button onClick={() => router.push("/")} className="text-2xl font-semibold">
              ResiDine
            </button>

            <div className="hidden md:flex items-center justify-between w-full ml-10">
              <div className="flex items-center space-x-6">
                <button onClick={() => router.push("/")} className="hover:text-gray-300">
                  Home
                </button>
                <button onClick={() => router.push("/hotel/new")} className="hover:text-gray-300">
                  Add Hotels
                </button>
                <button onClick={() => router.push("/my-hotels")} className="hover:text-gray-300">
                  My Hotels
                </button>
                <button onClick={() => router.push("/my-bookings")} className="hover:text-gray-300">
                  My Bookings
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <SearchInput />
               
                
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                      {/* Hi, Username Section */}
                      <div className="px-4 py-2 text-sm text-gray-900 font-semibold flex items-center space-x-2 border-b">
                        <User className="w-5 h-5 text-gray-600" />
                        <span>Hi, {session?.user?.name}</span>
                      </div>

                      <button onClick={() => router.push(`/user/${session?.id}`)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        My Profile
                      </button>
                      <button onClick={() => router.push("/my-bookings")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        My Bookings
                      </button>
                      <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button className="p-2 text-gray-400">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 ml-2 text-gray-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-gray-800 mt-2 py-2 rounded-lg">
              <div className="px-4 py-2">
                <SearchInput />
         

                {/* Profile Dropdown for Mobile */}
                <div className="bg-gray-700 p-3 rounded-md mt-3">
                  <div className="flex items-center space-x-2 text-white mb-2 border-b pb-2">
                    <User className="w-5 h-5" />
                    <span className="text-lg font-medium">Hi, {session?.user?.name}</span>
                  </div>
                  <nav className="flex flex-col space-y-3">
                    <button onClick={() => router.push("/")} className="hover:text-gray-300">
                      Home
                    </button>
                    <button onClick={() => router.push("/hotel/new")} className="hover:text-gray-300">
                      Add Hotels
                    </button>
                    <button onClick={() => router.push("/my-hotels")} className="hover:text-gray-300">
                      My Hotels
                    </button>
                    <button onClick={() => router.push(`/user/${session?.id}`)} className="hover:text-gray-300">
                      My Profile
                    </button>
                    <button onClick={() => router.push("/my-bookings")} className="hover:text-gray-300">
                      My Bookings
                    </button>
                    <button onClick={() => signOut()} className="hover:text-gray-300 text-left">
                      Sign Out
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <button onClick={() => router.push("/")} className="text-2xl font-semibold">
            ResiDine
          </button>
          <div className="flex gap-5">
            <button onClick={() => router.push("/")} className="hover:text-gray-300">
              Home
            </button>
            <button onClick={() => router.push("/about")} className="hover:text-gray-300">
              About
            </button>
            <button onClick={() => signIn("google")} className="hover:text-gray-300">
              Sign In
            </button>
            <button onClick={() => router.push("/signup")} className="hover:text-gray-300">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarClient;
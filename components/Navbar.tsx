"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/client";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { useState } from "react";

const Navbar = ({ userId, userName }: { userId: string; userName: string }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
  try {
    await signOut(auth); // wait for logout to complete
    console.log("Signed out!");

    // Wait for redirect to complete
router.push("/sign-in");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  const handleDeleteAccount = async () => {
    try {
      // Delete all interviews
      const interviewsRef = collection(db, "users", userId, "interviews");
      const interviewDocs = await getDocs(interviewsRef);
      const deletePromises = interviewDocs.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Delete user profile from Firestore
      await deleteDoc(doc(db, "users", userId));

      // Delete Firebase Auth account (optional)
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.delete();
      }

      // Sign out and redirect
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Account deletion failed:", error);
    }
  };

  return (
    <nav className="bg-gray-900 shadow-lg py-4 px-4 sm:px-6 font-mona-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
       <Link
  href="/"
  className="text-2xl font-bold text-white flex items-center transition-transform"
  aria-label="PrepWise Home"
>
  <Image
    src="/logo.svg"
    alt="PrepWise Logo"
    className="me-2"
    width={44}
    height={36}
    priority
  />
  <div className="flex flex-col leading-tight">
    <span>Mockrithm</span>
    <span className="text-sm font-normal text-gray-300">Face the Machine</span>
  </div>
</Link>


        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-200 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-colors duration-200"
            aria-label="Home Page"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-200 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-colors duration-200"
            aria-label="About Page"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-200 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-colors duration-200"
            aria-label="Contact Page"
          >
            Contact
          </Link>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-200 hover:text-white flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 px-3 py-2 rounded-md transition-colors duration-200"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              aria-label={`User menu for ${userName}`}
            >
              {userName}
              <svg
                className="w-4 h-4 ml-2 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
  <button
    onClick={handleLogout}
    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
  >
    Logout
  </button>
  <button
    onClick={handleDeleteAccount}
    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600"
  >
    Delete My Account
  </button>
</div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 bg-gray-800 rounded-md shadow-lg">
          <div className="flex flex-col space-y-2 p-4">
            <Link
              href="/"
              className="text-gray-200 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Home Page"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-200 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="About Page"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-200 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Contact Page"
            >
              Contact
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-gray-200 hover:bg-red-500 hover:text-white hover:backdrop-blur-sm px-3 py-2 rounded-md transition-colors duration-200"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

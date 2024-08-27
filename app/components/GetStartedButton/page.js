'use client';

import Link from 'next/link';
import { useAuth } from "@clerk/nextjs";

export default function GetStartedButton() {
  const { isSignedIn } = useAuth();

  return (
    <Link href={isSignedIn ? "/chatbot" : "/sign-up"} className="bg-blue-500 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-600 transition duration-300">
      Get Started
    </Link>
  );
}
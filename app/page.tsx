import Image from 'next/image';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton  } from "@clerk/nextjs";
import GetStartedButton from './components/GetStartedButton/page.js';

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold">ProfessorPulse</div>
        <div>
        <SignedOut>

          <SignUpButton mode="modal">
            <button className="bg-white text-black px-4 py-2 rounded-md mr-2">
              Sign Up
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="bg-transparent border border-white px-4 py-2 rounded-md">
              Login
            </button>
          </SignInButton>
          </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        </div>
      </nav>

      <main className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-20">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to <span className="text-blue-500">ProfessorPulse</span></h1>
            <p className="text-xl mb-8">Looking for the perfect professor to help you excel in your studies? Our intelligent chatbot is here to assist you!</p>
            <GetStartedButton />
          </div>
          <div className="md:w-1/2">
            <Image src="/student-studying.png" alt="Student studying" width={500} height={500} className="rounded-lg shadow-lg" />
          </div>
        </div>
        {/* <div className="py-20">
          <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">1. Ask Your Question</h3>
              <p>Simply type in what you are looking for—whether it is a professor who specializes in a specific subject, has high ratings, or any other preference.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">2. Get Tailored Recommendations</h3>
              <p>Our chatbot will analyze your query and provide you with the top 3 professors who best match your criteria.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">3. Make an Informed Choice</h3>
              <p>Review the detailed profiles and ratings of the recommended professors to find the ideal match for your academic needs.</p>
            </div>
          </div>
        </div> */}
      </main>

      {/* <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>Designed by Navya</div>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-blue-500"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="text-white hover:text-blue-500"><i className="fab fa-github"></i></a>
            <a href="#" className="text-white hover:text-blue-500"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
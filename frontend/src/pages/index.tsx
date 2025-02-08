import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";
import { useInfiniteQuery } from '@tanstack/react-query';
import { initializeSolanaProgram } from '../lib/solana';

const programId = new PublicKey("7UbWZFM1N9aT3VXn1x5qC1JsLWdyksybfP2nmwzwtZ5L"); // 프로그램 ID
const network = "https://api.devnet.solana.com"; // Devnet URL
const connection = new Connection(network, "confirmed");

const Home = () => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log("token: ", session);
  }, [session]);

  const handleProgramCall = async () => {
    try {
      const signature = await initializeSolanaProgram(20);
      console.log("Transaction successful:", signature);
      alert(`Transaction successful! Hash: ${signature}`);
    } catch (error) {
      console.error("Program call error:", error);
      alert(`Program call failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow rounded p-6 w-72 text-center">
        {session ? (
          <>
            <p className="text-gray-700">Hello, {session.user?.name || 'User'}!</p>
            <button
              onClick={() => signOut()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Sign Out
            </button>
            <button
              onClick={handleProgramCall}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              Call Solana Program (Store 1)
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-700">You are not logged in.</p>
            <button
              onClick={() => signIn('google')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

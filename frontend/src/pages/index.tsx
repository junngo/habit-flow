
import { useSession, signIn, signOut } from 'next-auth/react';

const Home = () => {
  const { data: session } = useSession();

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

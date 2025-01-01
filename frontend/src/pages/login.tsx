import { useEffect } from "react";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAuthCompleted, clearAuthCompleted, setAuthCompleted } from "@/utils/authFlag";

const LoginPage = () => {
  const { status, data: session } = useSession();
  const router = useRouter();

  // 이미 로그인된 상태일 때 메인 페이지로 리다이렉트
  useEffect(() => {
    const verifyAndSignIn = async () => {
      if (
        status === "authenticated" &&
        session?.firebaseToken &&
        !isAuthCompleted()
      ) {
        // 구글 로그인 인증 완료, Firbase 동기화전 상태
        try {
          // 1. 로그인 후 우리 서버로 토큰 검증 요청
          const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";
          const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.firebaseToken}`, // Firebase 토큰 헤더에 추가
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to verify token: ${response.status}`);
          }

          const data: { customToken: string } = await response.json();

          try {
            // 2. 서버 검증 완료 후 Firebase 커스텀 토큰으로 동기화
            if (!auth.currentUser) {
              const userCredential = await signInWithCustomToken(
                auth,
                data.customToken
              );
              console.log("userCredential: ", userCredential);
            }
          } catch (error) {
            console.error("Error logging in with custom token:", error);
            throw error; // 외부 catch 블록으로 에러 전달
          }

          // 인증 완료 플래그 설정
          setAuthCompleted();

          // 메인 페이지로 리다이렉트
          router.replace("/");
        } catch (err) {
          console.error("Authentication error:", err);
        }
      } else if (status === "authenticated" && isAuthCompleted()) {
        // 이미 인증이 완료된 경우 메인 페이지로 리다이렉트
        router.replace("/");
      } else if (status === "unauthenticated") {
        // 인증되지 않은 상태일 때 플래그 초기화
        clearAuthCompleted();
      }
    };

    verifyAndSignIn();
  }, [status, router, session?.firebaseToken]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-slate-800 min-h-screen flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/* 로고 & Sign In Slug  */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="habitflow-logo"
          // src="https://www.dexlab.space/assets/symbol_withtext.5e81c415.svg"
          className="mx-auto w-48 h-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Welcome, HabitFlow!<br />Sign in to your account
        </h2>
      </div>

      {/* Google 로그인 버튼 */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <button
          onClick={() => signIn('google')}
          className="w-full flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

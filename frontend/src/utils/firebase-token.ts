import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// 초기화 상태 플래그와 대기 큐
let isAuthReady = false;
let authReadyPromiseResolver: (() => void) | null = null;

// Promise로 초기화 대기
const authReadyPromise = new Promise<void>((resolve) => {
  authReadyPromiseResolver = resolve;
});

// Firebase Auth 초기화 상태 확인 및 플래그 설정
onAuthStateChanged(auth, (user) => {
  isAuthReady = !!user;
  console.log("Auth state changed. User ready:", isAuthReady);

  // 초기화가 완료되었음을 알림
  if (authReadyPromiseResolver) {
    authReadyPromiseResolver();
    authReadyPromiseResolver = null; // 한 번만 실행되도록 설정
  }
});

export async function getFirebaseToken(): Promise<string | null> {
  // Firebase Auth 초기화를 기다림
  if (!isAuthReady) {
    console.warn("Waiting for Firebase Auth to initialize...");
    await authReadyPromise; // 초기화 완료될 때까지 대기
    console.log("Firebase Auth is now ready.");
  }

  const currentUser = auth.currentUser;

  // 유저가 없는 경우 null 반환
  if (!currentUser) {
    console.error("No current user found in Firebase Auth.");
    return null;
  }

  try {
    const maxRetries = 3;
    let retries = 0;
    let firebaseToken: string | null = null;

    while (retries < maxRetries) {
      // Firebase ID Token 가져오기
      firebaseToken = await currentUser.getIdToken(true);
      if (firebaseToken) {
        console.log("Firebase Token fetched successfully: ", firebaseToken);
        break;
      }
      console.warn(`Retrying to fetch token... (${retries + 1}/${maxRetries})`);
      retries++;
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms 대기
    }

    if (!firebaseToken) {
      console.error("Failed to fetch Firebase Token after retries.");
      return null;
    }

    return firebaseToken;
  } catch (error) {
    console.error("Error fetching Firebase ID Token:", error);
    return null;
  }
}

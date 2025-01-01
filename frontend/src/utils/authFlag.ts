export const AUTH_FLAG_KEY = "firebaseAuthCompleted";

/**
 * 인증 완료 플래그를 확인
 * @returns {boolean} 인증이 완료면 true, 아니면 false
 */
export const isAuthCompleted = (): boolean => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_FLAG_KEY) === "true";
  }
  return false;
};

/**
 * 인증 완료 플래그를 설정
 */
export const setAuthCompleted = (): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_FLAG_KEY, "true");
  }
};

/**
 * 인증 완료 플래그를 초기화
 */
export const clearAuthCompleted = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_FLAG_KEY);
  }
};

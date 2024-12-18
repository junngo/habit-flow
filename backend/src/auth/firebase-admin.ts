import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export const initializeFirebase = (configService: ConfigService) => {
  console.log('🚀 Initializing Firebase...'); // 로그 추가
  const serviceAccountJson = configService.get<string>('FIREBASE_SERVICE_ACCOUNT');

  if (!serviceAccountJson) {
    throw new Error('❌ FIREBASE_SERVICE_ACCOUNT 환경 변수가 설정되지 않았습니다.');
  }

  let serviceAccount: Record<string, any>;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    throw new Error('❌ Firebase 서비스 계정 JSON을 파싱하는 데 실패했습니다.');
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase가 성공적으로 초기화되었습니다.');
  }
};

export default admin;

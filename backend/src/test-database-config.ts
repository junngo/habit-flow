import { DataSourceOptions } from 'typeorm';

export const testDatabaseConfig: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:', // 메모리 기반 SQLite 데이터베이스
  synchronize: true, // 자동으로 스키마를 생성
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // 엔티티 경로
};

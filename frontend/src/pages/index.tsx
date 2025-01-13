import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";

const programId = new PublicKey("7UbWZFM1N9aT3VXn1x5qC1JsLWdyksybfP2nmwzwtZ5L"); // 프로그램 ID
const network = "https://api.devnet.solana.com"; // Devnet URL
const connection = new Connection(network, "confirmed");

const Home = () => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log("token: ", session);
  }, [session]);

  const handleProgramCall = async () => {
    if (!window.solana) {
      alert("지갑을 설치해 주세요!");
      return;
    }

    try {
      // 1. 지갑 연결
      const response = await window.solana.connect();
      const walletPublicKey = new PublicKey(response.publicKey.toString());
      console.log("지갑 주소:", walletPublicKey.toString());

      // 2. Anchor 프로그램의 "initialize" 메서드 discriminator (8바이트 고유 식별자)
      const discriminator = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);

      // 3. count 값 설정 (u64 형식, 8바이트)
      const countBuffer = Buffer.alloc(8);      // 8바이트 길이의 버퍼 생성
      countBuffer.writeBigUInt64LE(BigInt(20)); // count 값을 little-endian 방식으로 기록 (u64 타입)

      // 4. 트랜잭션 데이터 구성: [discriminator + countBuffer]
      const data = Buffer.concat([discriminator, countBuffer]); // 메서드 식별자와 count 값을 하나의 Buffer로 합침

      // 5. 트랜잭션 생성 및 Instruction 추가
      const transaction = new Transaction().add({
        keys: [
          { pubkey: walletPublicKey, isSigner: true, isWritable: true },            // 호출자의 지갑 주소 (서명 및 쓰기 권한 필요)
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },  // 시스템 프로그램 (지갑 생성 및 기본 기능 제공)
        ],
        programId,  // 호출할 프로그램의 ID (declare_id!에 정의된 프로그램 ID와 동일해야 함)
        data,       // 트랜잭션에 포함할 데이터 (discriminator + count)
      });

      // 6. 트랜잭션 수수료 지불 및 블록해시 설정
      transaction.feePayer = walletPublicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // 7. 트랜잭션 서명 및 전송
      const signature = await window.solana.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature, "confirmed");

      console.log("트랜잭션 성공:", signature);
      alert(`트랜잭션 성공! 해시: ${signature}`);

    } catch (error) {
      console.error("프로그램 호출 오류:", error);
      alert(`프로그램 호출 실패: ${error.message}`);
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

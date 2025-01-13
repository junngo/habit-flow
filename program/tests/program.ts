import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HabitRewards } from "../target/types/habit_rewards";  // 프로그램 타입 가져오기
import assert from "assert";  // 내장된 검증 모듈 사용

describe("habit_rewards", () => {
  const provider = anchor.AnchorProvider.env();  // Anchor 환경 설정
  anchor.setProvider(provider);

  const program = anchor.workspace.HabitRewards as Program<HabitRewards>;

  it("Saves the count value!", async () => {
    const user = provider.wallet.publicKey;  // 지갑 주소 가져오기
    const rewardAccount = anchor.web3.Keypair.generate();  // 새로운 계정 생성
    const countValue = new anchor.BN(42);  // 저장할 값

    const tx = await program.methods
      .initialize(countValue)  // 함수 호출
      .accounts({
        rewardAccount: rewardAccount.publicKey,
        user: user,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([rewardAccount])
      .rpc();

    console.log("Transaction signature:", tx);

    // 저장된 값 가져오기
    const accountData = await program.account.rewardAccount.fetch(rewardAccount.publicKey);
    console.log("Stored count value:", accountData.count.toString());

    // 검증
    assert.strictEqual(accountData.count.toNumber(), 42, "count 값이 42가 아님!");
  });
});

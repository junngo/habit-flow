use anchor_lang::prelude::*;

declare_id!("7UbWZFM1N9aT3VXn1x5qC1JsLWdyksybfP2nmwzwtZ5L");  // 프로그램 ID

#[program]
pub mod habit_rewards {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, count: u64) -> Result<()> {
        // 숫자를 로그에 저장 (블록체인에 로그로 남겨 저장)
        msg!("저장된 숫자: {}", count);  // 블록체인 트랜잭션 로그에 출력
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,  // 호출자 지갑 (트랜잭션 수수료 지불)
    pub system_program: Program<'info, System>,  // 시스템 프로그램
}

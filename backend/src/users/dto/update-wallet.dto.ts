import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UpdateWalletDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^([1-9A-HJ-NP-Za-km-z]{32,44})$/, {
    message: 'Invalid wallet address format',
  })
  walletAddress: string;
}

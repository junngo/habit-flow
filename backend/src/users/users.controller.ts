import { Controller, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Patch('wallet')
  @UseGuards(FirebaseAuthGuard)
  async updateWallet(@Body() updateWalletDto: UpdateWalletDto, @Request() req) {
    const { email, username } = req.user; // Extract info from Firebase JWT
    const updatedUser = await this.usersService.upsertUser(email, username, updateWalletDto.walletAddress);
    return {
      message: 'Wallet address updated successfully',
      walletAddress: updatedUser.walletAddress,
    };
  }
}

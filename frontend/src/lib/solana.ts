import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";

// Constants
export const programId = new PublicKey("7UbWZFM1N9aT3VXn1x5qC1JsLWdyksybfP2nmwzwtZ5L");
const network = "https://api.devnet.solana.com";
export const connection = new Connection(network, "confirmed");

export const initializeSolanaProgram = async (count: number = 20) => {
  if (!window.solana) {
    throw new Error("Solana wallet not found! Please install a wallet.");
  }

  // 1. Connect wallet
  const response = await window.solana.connect();
  const walletPublicKey = new PublicKey(response.publicKey.toString());
  
  // 2. Initialize method discriminator
  const discriminator = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]);

  // 3. Set count value
  const countBuffer = Buffer.alloc(8);
  countBuffer.writeBigUInt64LE(BigInt(count));

  // 4. Compose transaction data
  const data = Buffer.concat([discriminator, countBuffer]);

  // 5. Create transaction
  const transaction = new Transaction().add({
    keys: [
      { pubkey: walletPublicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });

  // 6. Set fee payer and blockhash
  transaction.feePayer = walletPublicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  // 7. Sign and send transaction
  const signature = await window.solana.signAndSendTransaction(transaction);
  await connection.confirmTransaction(signature, "confirmed");

  return signature;
}; 
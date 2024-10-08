import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import dotenv from "dotenv";
import fs from "fs"; // 导入文件系统模块

// 加载环境变量
dotenv.config();

// 定义程序 ID
const programId = new PublicKey("5DBFd6y14vp7ZpAx3CCURMG9w6t23uvgXXxJf2sgWChK");
// 创建与 Solana 本地集群的连接
const connection = new Connection("http://127.0.0.1:8899");

// 定义一个异步函数 sayHello
export const sayHello = async (payer: Keypair): Promise<string> => {
  // 创建新的交易对象
  const transaction = new Transaction();
  // 创建交易指令，使用指定的程序ID
  const instruction = new TransactionInstruction({
    keys: [],// 若有需要关联的账户，可以在此添加
    programId,// 指定程序ID
  });
  // 将指令添加到交易中
  transaction.add(instruction);
  // 返送并确认交易，返回交易签名
  return sendAndConfirmTransaction(connection, transaction, [payer]);
};

// 生成获取读取付款人的密钥对
const getPayer = ()=>{
  const keypairFilePath = '/Users/xukui/.config/solana/id.json';

  // 如果密钥对文件存在，则读取
  if (fs.existsSync(keypairFilePath)) {
    const secretKeyString = fs.readFileSync(keypairFilePath, 'utf-8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
  } else {
    // 手动生成付款人的密钥对并保存
    const payer = Keypair.generate();
    fs.writeFileSync(keypairFilePath, JSON.stringify(Array.from(payer.secretKey)));
    console.log(`已生成并保存付款人密钥对：${payer.publicKey.toString()}`);
    return payer;
  }
}

// 主程序逻辑
try {
  const payer = getPayer();// 获取付款人的密钥对
  console.log(`Public Key: ${payer.publicKey.toString()}`);//打印公钥
  // 调用sayHello函数并获取交易签名
  const transactionSignature = await sayHello(payer);
  // 打印交易链接
  console.log(`Transaction: http://127.0.0.1:8899/tx/${transactionSignature}`);
  console.log("Finished successfully");
} catch (error) {
  if (error instanceof Error) {
    throw new Error(`An error occurred: ${error.message}`);
  } else {
    throw new Error("An unknown error occurred");
  }
}
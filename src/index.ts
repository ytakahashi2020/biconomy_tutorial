import { config } from "dotenv";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";

config();

const bundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const provider = new providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai"
);
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);

const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
  signer: wallet,
  chainId: ChainId.POLYGON_MUMBAI,
  bundler: bundler,
};

async function createAccount() {
  let biconomySmartAccount = new BiconomySmartAccount(
    biconomySmartAccountConfig
  );
  biconomySmartAccount = await biconomySmartAccount.init();
  console.log("owner: ", biconomySmartAccount.owner);
  console.log("address: ", await biconomySmartAccount.getSmartAccountAddress());
  return biconomySmartAccount;
}

async function createTransaction() {
  console.log("creating account");

  const smartAccount = await createAccount();

  const transaction = {
    to: "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD",
    data: "0x",
    value: ethers.utils.parseEther("0.01"),
  };

  const userOp = await smartAccount.buildUserOp([transaction]);
  userOp.paymasterAndData = "0x";

  const userOpResponse = await smartAccount.sendUserOp(userOp);

  const transactionDetail = await userOpResponse.wait();

  console.log("transaction detail below");
  console.log(transactionDetail);
}

createTransaction();

import { Address, BigInt, Bytes, store } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/London/ERC20";
import { Token, TokenMint, TokenOwnership } from "../generated/schema";
import { BIGINT_ONE, BIGINT_ZERO, LONDON_TOKEN_ID, ZERO_ADDRESS } from "./constants";
import { getTokenType } from "./utils";

export function handleTransferSingle(event: Transfer): void {
    transferBase(
        event.address,
        event.params.from,
        event.params.to,
        event.params.value,
        event.block.timestamp,
        event.transaction.gasPrice,
    );
}

function transferBase(tokenAddress: Address, from: Address, to: Address, value: BigInt, timestamp: BigInt, gasPrice: BigInt): void {

  // if (to == ZERO_ADDRESS) {
  //     // burn token
  //     hash.removedAt = timestamp;
  //     hash.save();
  // }

  if (from == ZERO_ADDRESS) {
    let token = Token.load(LONDON_TOKEN_ID) 
    if (token == null) {
      token = new Token(LONDON_TOKEN_ID);
      token.totalSupply = BIGINT_ZERO;
      token.tokenAddress = tokenAddress;
    }

    let mintId = gasPrice.toString();
    let mint = TokenMint.load(mintId);
    if (mint == null) {
      mint = new TokenMint(mintId);
      mint.gasPrice = gasPrice;
      mint.numMints = BIGINT_ZERO;
    }
    mint.numMints = mint.numMints.plus(BIGINT_ONE);
    mint.save(); 
    token.totalSupply = token.totalSupply.plus(value);
    token.save();
  }

    if (from != ZERO_ADDRESS) {
      updateHashOwnership(from, BIGINT_ZERO.minus(value));
    }
    updateHashOwnership( to, value);
}

export function updateHashOwnership(owner: Address, deltaQuantity: BigInt): void {
  let ownershipId = owner.toHexString();
  let ownership = TokenOwnership.load(ownershipId);
  if (ownership == null) {
    ownership = new TokenOwnership(ownershipId);
    ownership.token = LONDON_TOKEN_ID;
    ownership.owner = owner;
    ownership.quantity = BIGINT_ZERO;
  }

  let newQuantity = ownership.quantity.plus(deltaQuantity);

  if (newQuantity.lt(BIGINT_ZERO)) {
    throw new Error("Negative token quantity")
  }

  if (newQuantity.isZero()) {
    store.remove('TokenOwnership', ownershipId);
  } else {
    ownership.quantity = newQuantity;
    ownership.save();
  }
}
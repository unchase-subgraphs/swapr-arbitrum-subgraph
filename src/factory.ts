/* eslint-disable prefer-const */
import { Pair, Token } from "../generated/schema";
import { Pair as PairTemplate } from "../generated/templates";
import { PairCreated } from "../generated/Factory/Factory";
import {
  ZERO_BD,
  ZERO_BI,
  fetchTokenSymbol,
  fetchTokenName,
  fetchTokenDecimals,
} from "./utils";

export function handlePairCreated(event: PairCreated): void {
  let token0 = Token.load(event.params.token0.toHex());
  if (token0 === null) {
    token0 = new Token(event.params.token0.toHex());
    token0.name = fetchTokenName(event.params.token0);
    token0.symbol = fetchTokenSymbol(event.params.token0);
    let decimals = fetchTokenDecimals(event.params.token0);
    if (decimals === null) {
      return;
    }
    token0.decimals = decimals;
    token0.save();
  }

  let token1 = Token.load(event.params.token1.toHex());
  if (token1 === null) {
    token1 = new Token(event.params.token1.toHex());
    token1.name = fetchTokenName(event.params.token1);
    token1.symbol = fetchTokenSymbol(event.params.token1);
    let decimals = fetchTokenDecimals(event.params.token1);
    if (decimals === null) {
      return;
    }
    token1.decimals = decimals;
    token1.save();
  }

  let pair = new Pair(event.params.pair.toHex()) as Pair;
  pair.token0 = token0.id;
  pair.token1 = token1.id;
  pair.reserve0 = ZERO_BD;
  pair.reserve1 = ZERO_BD;
  pair.token0Price = ZERO_BD;
  pair.token1Price = ZERO_BD;
pair.syncAtTimestamp = ZERO_BI;
  pair.createdAtBlockNumber = event.block.number;
  pair.createdAtTimestamp = event.block.timestamp;
  pair.save();

  PairTemplate.create(event.params.pair);
}
/* eslint-disable prefer-const */
import { log } from "@graphprotocol/graph-ts";
import {
  Pair,
  Token
} from '../generated/schema'
import { Pair as PairContract, Sync } from '../generated/templates/Pair/Pair'
import {
  convertTokenToDecimal,
  ZERO_BD,
} from './utils'

export function handleSync(event: Sync): void {
  let pair = Pair.load(event.address.toHex())
  if (!pair) {
    log.debug("sync event, but pair doesn't exist: {}", [event.address.toHex()])
    return
  }

  let token0 = Token.load(pair.token0)
  if (!token0) {
    log.debug("sync event, but token0 doesn't exist: {}", [pair.token0])
    return
  }

  let token1 = Token.load(pair.token1)
  if (!token1) {
    log.debug("sync event, but token1 doesn't exist: {}", [pair.token1])
    return
  }
  
  pair.syncAtTimestamp = event.block.timestamp;
  pair.reserve0 = convertTokenToDecimal(event.params.reserve0, token0.decimals)
  pair.reserve1 = convertTokenToDecimal(event.params.reserve1, token1.decimals)

  if (pair.reserve1.notEqual(ZERO_BD)) pair.token0Price = pair.reserve0.div(pair.reserve1)
  else pair.token0Price = ZERO_BD
  if (pair.reserve0.notEqual(ZERO_BD)) pair.token1Price = pair.reserve1.div(pair.reserve0)
  else pair.token1Price = ZERO_BD

  pair.save()
  token0.save()
  token1.save()
}
import crypto from "crypto";

function allocUnsafe(size: number) {
  if (Buffer.allocUnsafe) return Buffer.allocUnsafe(size);
  return new Buffer(size);
}

export function safeCompare(stringA: string, stringB: string) {
  const strA = String(stringA);
  const strB = String(stringB);
  const aLen = Buffer.byteLength(strA);
  const bLen = Buffer.byteLength(strB);
  if (aLen !== bLen) return false;
  const bufferA = allocUnsafe(aLen);
  bufferA.write(strA);
  const bufferB = allocUnsafe(bLen);
  bufferB.write(strB);
  return crypto.timingSafeEqual(bufferA, bufferB) && aLen === bLen;
}

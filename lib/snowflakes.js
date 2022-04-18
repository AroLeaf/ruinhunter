const epoch = 1641233793721n;
let inc = 0n;

export default function snowflake() {
  const t = BigInt(Date.now()) - epoch;
  inc = (inc+1n) & 0xFn;
  return ((t<<4n) + inc).toString(16);
}
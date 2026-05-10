const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

const W = 180, H = 180;

const rows = [];
for (let y = 0; y < H; y++) {
  const row = Buffer.alloc(1 + W * 4);
  row[0] = 0;
  for (let x = 0; x < W; x++) {
    row[1 + x * 4]     = 22;
    row[1 + x * 4 + 1] = 163;
    row[1 + x * 4 + 2] = 74;
    row[1 + x * 4 + 3] = 255;
  }
  rows.push(row);
}

const compressed = zlib.deflateSync(Buffer.concat(rows), { level: 9 });

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 6;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', compressed),
  chunk('IEND', Buffer.alloc(0)),
]);

const out = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');
fs.writeFileSync(out, png);
console.log(`Generated apple-touch-icon.png (${W}x${H} solid #16A34A)`);

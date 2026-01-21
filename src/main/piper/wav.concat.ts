import fs from 'fs';

function silence(ms: number, sampleRate = 22050): Buffer {
  const samples = Math.floor((ms / 1000) * sampleRate);
  return Buffer.alloc(samples * 2);
}

export function concatWavPureJS(
  inputs: string[],
  output: string
): void {
  if (!inputs.length) {
    throw new Error('No input WAV files');
  }

  const buffers = inputs.map(f => fs.readFileSync(f));
  const header = Buffer.from(buffers[0].subarray(0, 44));

  const data = buffers.flatMap((b, i) => {
    if (b.length < 44) throw new Error('Invalid WAV');
    const audio = b.subarray(44);
    return i === 0 ? [audio] : [silence(120), audio];
  });

  const totalLen = data.reduce((s, b) => s + b.length, 0);
  const out = Buffer.concat([header, ...data]);

  out.writeUInt32LE(36 + totalLen, 4);
  out.writeUInt32LE(totalLen, 40);

  fs.writeFileSync(output, out);
}

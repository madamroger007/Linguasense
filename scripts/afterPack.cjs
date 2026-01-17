const fs = require('fs');
const path = require('path');

exports.default = async (context) => {
  const base = path.join(
    context.appOutDir,
    'resources',
    'app.asar.unpacked',
    'resources'
  );

  const bins = [
    path.join(base, 'piper', 'piper'),
    path.join(base, 'whisper', 'bin', 'whisper-cli'),
  ];

  for (const bin of bins) {
    if (fs.existsSync(bin)) {
      fs.chmodSync(bin, 0o755);
    }
  }
};

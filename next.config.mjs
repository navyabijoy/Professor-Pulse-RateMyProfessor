import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  webpack: (config, { isServer }) => {
    // Add a rule for .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
      exclude: /onnxruntime-node/,
    });

    // Exclude onnxruntime-node from being processed by webpack
    config.externals.push({
      'onnxruntime-node': 'commonjs onnxruntime-node',
    });

    // Resolve the correct onnxruntime-node binary for the current platform
    config.resolve.alias['onnxruntime-node'] = resolve(
      __dirname,
      'node_modules/onnxruntime-node'
    );

    return config;
  },
  // Add other Next.js config options here
};

export default config;
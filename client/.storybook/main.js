module.exports = {
  stories: ["../src/**/*.stories.js"],
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-actions",
    "@storybook/addon-links",
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.node = {
      fs: 'empty',
      child_process: 'empty',
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      global: true,
    }
    config.module.rules.push({
      test: /\.wasm$/,
      // Tells WebPack that this module should be included as
      // base64-encoded binary file and not as code
      loaders: ["base64-loader"],
      // Disables WebPack's opinion where WebAssembly should be,
      // makes it think that it's not WebAssembly
      //
      // Error: WebAssembly module is included in initial chunk.
      type: "javascript/auto",
    });
    config.module = { ...config.module, noParse: /\.wasm$/ };

    // Return the altered config
    return config;
  },
};

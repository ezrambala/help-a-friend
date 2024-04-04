module.exports = {
  // other webpack configuration...
  resolve: {
    fallback: {
      assert: require.resolve("assert/"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      "crypto": require.resolve("crypto-browserify"),

    },
  },
};

const
  path = require('path'),
  {getDefaultConfig} = require('metro-config')


module.exports = (async () => {
  const {resolver: {sourceExts, assetExts}} = await getDefaultConfig()

  return {
    resolver: {
        extraNodeModules: {
            ...require('node-libs-react-native'),
            $: path.join(path.resolve(__dirname), 'src'),
        },

        assetExts: assetExts.filter(ext => ext !== 'svg'),

        sourceExts: [...sourceExts, 'svg'],
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),

        babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
  }
})();

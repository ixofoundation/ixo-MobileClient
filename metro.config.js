const path = require('path')


module.exports = {
    resolver: {
        extraNodeModules: {
            ...require('node-libs-react-native'),
            $: path.join(path.resolve(__dirname), 'src'),
        },
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
};

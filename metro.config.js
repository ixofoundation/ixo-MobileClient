const path = require('path')


module.exports = {
    resolver: {
        extraNodeModules: {
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

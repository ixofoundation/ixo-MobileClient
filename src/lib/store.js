const
    {inspect} = require('util'),
    debug = require('debug')('store'),
    create = require('zustand').default,
    {persist: persistMw} = require('zustand/middleware'),
    asyncStorage = require('@react-native-async-storage/async-storage').default


const logMw = (logKey, conf) => (set, get, api) => conf(args => {
    debug(logKey, ': Applying patch:\n', inspect(args, {depth: 10}))
    set(args)
}, get, api)


const
    makeStore = (key, conf) => create(logMw(key, conf)),

    makePersistentStore = (key, conf) =>
        create(
            logMw(
                key,

                persistMw(conf, {
                    name: key,
                    getStorage: () => asyncStorage,
                }),
            ),
        )


module.exports = {
    makeStore,
    makePersistentStore,
}

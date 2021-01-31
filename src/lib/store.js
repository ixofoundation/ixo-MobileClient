const
    debug = require('debug')('store'),
    create = require('zustand').default,
    keychain = require('react-native-keychain')


const logMw = (key, conf) => (set, get, api) => conf(args => {
    debug(key, ': Applying patch', args)
    set(args)
    debug(key, ': New state', get())
}, get, api)


const securePersistMw = (key, conf) => (set, get, api) => {
    const store = conf((updater, shouldOverwrite) => {
        const nextState = {
            ...(shouldOverwrite ? {} : get()),
            ...(typeof updater === 'function' ? updater(get()) : updater),
        }

        return keychain.setGenericPassword(
            'ixouser',
            JSON.stringify(nextState),
            {service: 'ixoWallet-' + key},
        )
            .then(() => {
                debug(key, ': Persisted the new state in the secure data store')
                set(nextState, true)
            })
    }, get, api)

    api.loaded =
        keychain.getGenericPassword({service: 'ixoWallet-' + key})
            .then(({password}) => {
                debug(key, ': Initializing from secure data store', password)

                if (password)
                    set(JSON.parse(password))
            })

    return store
}


const
    makeStore = (key, conf) => create(logMw(key, conf)),

    makeSecurePersistentStore = (key, conf) =>
        makeStore(key, securePersistMw(key, conf))


module.exports = {
    makeStore,
    makeSecurePersistentStore,
}

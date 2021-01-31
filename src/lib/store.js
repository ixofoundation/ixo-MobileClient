// TODO: Document. Very elegant but some parts need explanations or at least
// clearer namings.

const
    {inspect} = require('util'),
    debug = require('debug')('store'),
    create = require('zustand').default,
    keychain = require('react-native-keychain')


const logMw = (key, conf) => (set, get, api) => conf(args => {
    debug(key, ': Applying patch:\n', inspect(args, {depth: 10}))
    set(args)
}, get, api)


const makePersistMw = (getter, setter) => (key, conf) => (set, get, api) => {
    const store = conf(async (updater, shouldOverwrite) => {
        const nextState = {
            ...(shouldOverwrite ? {} : get()),
            ...(typeof updater === 'function' ? updater(get()) : updater),
        }

        await setter(key, JSON.stringify(nextState))
        debug(key, ': Persisted the new state in the data store')
        set(nextState, true)
    }, get, api)

    api.loaded =
        getter(key)
            .then(value => {
                if (!value) return

                debug(key, ': Initializing from data store')
                set(JSON.parse(value))
            })

    return store
}


const securePersistMw = makePersistMw(
    key =>
        keychain.getGenericPassword({service: 'ixoWallet-' + key})
            .then(({password}) => password),

    (key, value) =>
        keychain.setGenericPassword(
            'ixouser',
            value,
            {service: 'ixoWallet-' + key},
        ),
)


const
    makeStore = (key, conf) => create(logMw(key, conf)),

    makeSecurePersistentStore = (key, conf) =>
        makeStore(key, securePersistMw(key, conf))


module.exports = {
    makeStore,
    makeSecurePersistentStore,
}

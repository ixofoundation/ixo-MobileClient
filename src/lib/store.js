// TODO: Document. Very elegant but some parts need explanations or at least
// clearer namings.

const
    {inspect} = require('util'),
    debug = require('debug')('store'),
    create = require('zustand').default,
    keychain = require('react-native-keychain'),
    asyncStorage = require('@react-native-async-storage/async-storage').default,
    produce = require('immer')


const immerMw = conf => (set, get, api) =>
    conf(
        updater =>
            set(typeof updater === 'function' ? produce(updater) : updater),
        get,
        api,
    )


const logMw = (logKey, conf) => (set, get, api) => conf(args => {
    debug(logKey, ': Applying patch:\n', inspect(args, {depth: 10}))
    set(args)
}, get, api)


const makePersistMw =
    (load, save) =>
        (storageKey, conf, {
            serialize = JSON.stringify,
            deserialize = JSON.parse,
            onLoad = () => {},
        } = {}) =>
            (set, get, api) => {
                const store = conf(async (updater, shouldOverwrite) => {
                    const nextState = {
                        ...(shouldOverwrite ? {} : get()),

                        ...(typeof updater === 'function'
                            ? updater(get())
                            : updater),
                    }

                    await save(storageKey, serialize(nextState))
                    debug(storageKey, ': Persisted the new state in the data store') // eslint-disable-line max-len
                    set(nextState, true)
                }, get, api)

                const loadPromise =
                    load(storageKey)
                        .then(value => {
                            if (!value) return

                            const deserializedValue = deserialize(value)

                            debug(storageKey, ': Initializing from data store')
                            set(deserializedValue)

                            return onLoad(deserializedValue)
                        })

                api.loaded = loadPromise

                return store
            }


const persistMw = makePersistMw(asyncStorage.getItem, asyncStorage.setItem)


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
    makeStore = (key, conf) => create(logMw(key, immerMw(conf))),

    makePersistentStore = (key, conf, opts) =>
        makeStore(key, persistMw(key, conf, opts)),

    makeSecurePersistentStore = (key, conf, opts) =>
        makeStore(key, securePersistMw(key, conf, opts))


module.exports = {
    makeStore,
    makePersistentStore,
    makeSecurePersistentStore,
}

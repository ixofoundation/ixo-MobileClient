const
    AsyncStorage = require('@react-native-community/async-storage').default,
    WalletConnect = require('@walletconnect/client').default


const
    defaultConnectionOpts = {
        bridge: process.env.WALLETCONNECT_BRIDGE,

        clientMeta: {
            description: 'IXO Wallet',
            url: 'https://ixo.world',
            icons: ['https://ixo.world/favicon.ico'],
            name: 'IXO Wallet',
        },
    },

    wcStorageKey = 'walletConnectSession',

    log = (...args) => console.log('walletconnect:', ...args)


let wc

const init = connectionOpts => {
    wc = new WalletConnect({...defaultConnectionOpts, ...connectionOpts})

    log('init', wc.session)

    setupEvents(wc)

    if (wc.connected) {
        reduxStore.dispatch(handleWCConnection(wc.session))
        return Promise.resolve(wc.session)
    }

    return new Promise((resolve, reject) =>
        wc.on('session_request', (err, payload) => {
            log(payload || err)

            if (err) {
                reduxStore.dispatch(handleWCError(err))
                reject(err)
                return
            }

            const sessionInfo = payload.params[0]

            resolve(sessionInfo)
            reduxStore.dispatch(handleWCConnection(sessionInfo))
        })
    )
}

const setupEvents = wc => {
    wc.on('connect', withErrHandling(() => {
        AsyncStorage.setItem(wcStorageKey, JSON.stringify(wc.session))
            .catch(e =>
                reduxStore.dispatch(handleWCError(e)))
    }))

    wc.on('call_request', withErrHandling(payload => {
        if (payload.method === 'ixo_signTransaction')
            rootNavigation.navigate('WalletConnectQuery', payload)
        else
            console.error('Don\'t know how to handle call request:', payload)
    }))

    wc.on('disconnect', withErrHandling(() => {
        reduxStore.dispatch(handleWCDisconnection())
        AsyncStorage.removeItem(wcStorageKey)
    }))
}

// Error handling decorator for event handlers:
const withErrHandling = handler => (err, payload) => {
    log(payload || err)

    if (err)
        return reduxStore.dispatch(handleWCError(err))

    return handler(payload)
}

module.exports = new Proxy({init}, {
    get: (target, prop) => {
        const val = target[prop] || wc[prop]
        return val instanceof Function ? val.bind(wc) : val
    },
})

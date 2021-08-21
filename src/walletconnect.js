const
    debug = require('debug')('walletconnect'),
    {Alert} = require('react-native'),
    {sign} = require('$/wallet'),
    WalletConnect = require('@walletconnect/client').default,
    {useWalletConnect} = require('./stores')


let wc // WalletConnect client

const getWalletConnectClient = () => wc

const initWalletConnect = connectionOpts => {
    wc = new WalletConnect(connectionOpts)

    debug('init', wc.session)

    setupEvents(wc)

    if (wc.connected) {
        useWalletConnect.getState().setSession(wc.session)
        return Promise.resolve(wc.session)
    }

    return new Promise((resolve, reject) =>
        wc.on('session_request', (err, payload) => {
            debug('session request', err || payload)

            if (err) {
                useWalletConnect.getState().setError(wc.session)
                reject(err)
                return
            }

            resolve(wc)
        }),
    )
}

const setupEvents = wc => {
    wc.on('connect', withErrHandling(() =>
        useWalletConnect.getState().setSession(wc.session)))

    wc.on('call_request', withErrHandling(payload => {
        debug('call request', payload)

        if (payload.method !== 'ixo_signTransaction')
            return debug('Don\'t know how to handle call request:', payload)

        const
            {data, walletType} = payload.params[0],
            parsedData = JSON.parse(data)

        Alert.alert(
            'WalletConnect',
            data,
            [{
                text: 'Cancel',
                style: 'cancel',
                onPress: () =>
                    wc.rejectRequest({
                        id: payload.id,
                        error: 'user rejected',
                    }),
            }, {
                text: 'Sign',
                style: 'default',
                onPress: async () =>
                    wc.approveRequest({
                        id: payload.id,
                        result: (await sign(walletType, parsedData)),
                    }),
            }],
        )
    }))

    wc.on('disconnect', withErrHandling(() => {
        useWalletConnect.getState().setSession(null)
    }))
}

// Error handling decorator for event handlers:
const withErrHandling = handler => (err, payload) => {
    debug(payload || err)

    if (err)
        return useWalletConnect.getState().setError(err)

    return handler(payload)
}


module.exports = {initWalletConnect, getWalletConnectClient}

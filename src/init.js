const
    debug = require('debug')('init'),
    {useWallet} = require('./stores')


const init = async nav => {
    await useWallet.loaded

    const ws /*wallet store*/ = useWallet.getState()

    if (!ws.secp) {
        debug('No identity found, navigating to the id creation scene')
        return nav.navigate('createId')
    }

    initForExistingWallet(nav)
}

const initForExistingWallet = async nav => {
    const ws /*wallet store*/ = useWallet.getState()

    if (await ws.isDidRegistered(ws.agent.did)) {
        debug('The DID is registered, navigating to the project listing scene')
        return nav.navigate('projects')
    }

    debug('The DID is not registered, checking for account balance')

    const
        account = await ws.getSecpAccount(),

        uixoBalance =
            !account
                ? 0
                : account.balance.find(tok => tok.denom === 'uixo').amount

    if (uixoBalance < 100) {
        debug('Too little account balance, navigating to the credit scene')
        return nav.navigate('credit')
    }

    debug('Navigating to the registration scene')
    nav.navigate('register')
}


module.exports = {
    init,
    initForExistingWallet,
}

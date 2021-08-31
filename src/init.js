const
    debug = require('debug')('init'),
    {setClient, getClient} = require('./ixoCli'),
    {loadWallet, setWallet} = require('./wallet'),
    {initWalletConnect} = require('./walletconnect'),
    {useWalletConnect} = require('./stores')


const init = async nav => {
    const wallet = await loadWallet()

    if (!wallet) {
        debug('No identity found, navigating to the id creation scene')
        return nav.navigate('createId')
    }

    setClient(wallet)

    initForExistingWallet(nav, wallet)
}

const initForExistingWallet = async (nav, wallet) => {
    const
        ixoCli = getClient(),
        {error: didError} = await ixoCli.getDidDoc(wallet.agent.did)

    if (!didError) {
        initWalletConnect_()

        debug('The DID is registered, navigating to the project listing scene')
        return nav.navigate('projects')
    }

    debug('The DID is not registered, checking for account balance')

    const {balance: {amount: uixoBalance}} =
        await ixoCli.balances('secp', 'uixo')

    if (uixoBalance < 100) {
        debug('Too little account balance, navigating to the credit scene')
        return nav.navigate('credit')
    }

    debug('Navigating to the registration scene')
    nav.navigate('register')
}

const initWalletConnect_ = () => {
    const existingWcSession = useWalletConnect.getState().session

    if (existingWcSession) {
        debug('WalletConnect session found, initializing')
        initWalletConnect({session: existingWcSession})
    }
}


module.exports = {
    init,
    initForExistingWallet,
}

// Singleton ixo wallet

const
    debug = require('debug')('wallet'),
    {makeWallet} = require('@ixo/client-sdk'),
    {omit} = require('lodash-es'),
    {keychainStorage} = require('./lib/util')


let wallet

const loadWallet = async () => {
    const
        serializedWallet = (await keychainStorage.getItem('wallet')) || 'null',
        serializableWallet = JSON.parse(serializedWallet)

    debug('Loading wallet:', serializableWallet)

    if (!serializableWallet)
        return null

    wallet = makeWallet(serializableWallet)

    return wallet
}

const setWallet = async newWallet => {
    wallet = newWallet

    const serializableWallet =
        newWallet
            ? omit(wallet.toJSON(), ['secp.mnemonic', 'agent.mnemonic'])
            : null
    // we don't want the mnemonic to be stored, users are responsible with
    // storing it themselves elsewhere.

    await keychainStorage.setItem('wallet', JSON.stringify(serializableWallet))

    debug('SAVED WALLET', serializableWallet)

    return wallet
}

const getWallet = () => wallet


module.exports = {loadWallet, setWallet, getWallet}

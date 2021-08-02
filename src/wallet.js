// Singleton ixo wallet

const
    {makeWallet} = require('@ixo/client-sdk'),
    {keychainStorage} = require('./lib/util')


let wallet

const loadWallet = async () => {
    const serializedWallet = await keychainStorage.getItem('wallet')

    if (!serializedWallet)
        return null

    wallet = makeWallet(JSON.parse(serializedWallet))

    return wallet
}

const setWallet = async newWallet => {
    wallet = newWallet
    await keychainStorage.setItem('wallet', JSON.stringify(wallet))
    return wallet
}

const getWallet = () => wallet


module.exports = {loadWallet, setWallet, getWallet}

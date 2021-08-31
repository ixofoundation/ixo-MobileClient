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

    wallet = await makeWallet(serializableWallet)

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

    debug('Saved wallet', serializableWallet)

    return wallet
}

const getWallet = () => wallet

// @param enum targetWalletType: "secp" or "agent"
// @param any data: A value of any kind
//
// @returns {type, created, creator, publicKkey, signatureValue}
//   This format comes from the legacy KeySafe browser extension that
//   was being used for signatures. We dare not change it to not break
//   anything.
const sign = async (targetWalletType, data) => {
    const
        targetWallet = getWallet()[targetWalletType],
        [account] = await targetWallet.getAccounts(),
        {signature: {signature, pub_key}} =
            await targetWallet.signAmino(account.address, data)

    return {
        type: account.algo,
        created: new Date(),
        creator: getWallet().agent.did,
        publicKey: pub_key.value,
        signatureValue: signature,
    }
}


module.exports = {loadWallet, setWallet, getWallet, sign}

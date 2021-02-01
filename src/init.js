const
    debug = require('debug')('init'),
    ixo = require('./ixoClient'),
    {useId} = require('./stores')


const init = async nav => {
    await useId.loaded

    const {id} = useId.getState()

    if (!id) {
        debug('No identity found, navigating to the id creation scene')
        return nav.navigate('createId')
    }

    initForExistingId(nav, id)
}

const initForExistingId = async (nav, id) => {
    const {didDoc: {did}, address} = id

    if (await isDidRegistered(did)) {
        debug('The DID is registered, navigating to the project listing scene')
        return nav.navigate('projects')
    }

    const uixoBalance = await getAccountBalance(address)

    if (uixoBalance < 100) {
        debug('Too little account balance, navigating to the credit scene')
        return nav.navigate('credit', {uixoBalance, address})
    }

    debug('Navigating to the registration scene')
    nav.navigate('register')
}

const isDidRegistered = did =>
    ixo.sync.getDidDoc('did:ixo:' + did)
        .then(({body: {did}}) => !!did)

const getAccountBalance = async (address, denom = 'uixo') => {
    const
        {body: {result: tokenBalanceList}} =
            await ixo.chain.raw('/api/bank/balances/' + address),

        targetTokenRecord = tokenBalanceList.find(item => item.denom === denom)

    return targetTokenRecord ? targetTokenRecord.amount : 0
}


module.exports = {
    init,
    initForExistingId,
}

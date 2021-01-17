const
    ixo = require('./ixoClient'),
    {useId} = require('./stores')


const init = async nav => {
    await useId.loaded

    const {id} = useId.getState()

    if (!id)
        return nav.navigate('createId')

    initForExistingId(nav, id)
}

const initForExistingId = async (nav, id) => {
    const {didDoc: {did}, address} = id

    if (await isDidRegistered(did))
        return nav.navigate('projects')

    const uixoBalance = await getAccountBalance(address)

    if (uixoBalance < 100)
        return nav.navigate('credit', {uixoBalance, address})

    nav.navigate('register')
}

const isDidRegistered = did =>
    ixo.sync.getDidDoc('did:ixo:' + did)
        .then(({body: {did}}) => !!did)

const getAccountBalance = async (address, denom = 'uixo') => {
    const
        {body: {result: tokenBalanceList}} =
            await ixo.chain.raw('/bank/balances/' + address),

        targetTokenRecord = tokenBalanceList.find(item => item.denom === denom)

    return targetTokenRecord ? targetTokenRecord.amount : 0
}


module.exports = {
    init,
    initForExistingId,
}

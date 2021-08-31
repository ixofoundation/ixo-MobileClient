const
    {without} = require('lodash-es'),
    {makePersistentStore} = require('$/lib/store')


const useProjects = makePersistentStore('projects', set => ({
    items: [], // project DIDs

    connect: projDid =>
        set(({items}) => ({items: [...items, projDid]})),

    disconnect: projDid =>
        set(({items}) => ({items: without(items, projDid)})),
}))


const useWalletConnect = makePersistentStore('walletconnect', set => ({
    session: null,
    error: null,

    setSession: session => set({session}),
    setError: error => set({error}),
}))


module.exports = {
    useProjects,
    useWalletConnect,
}

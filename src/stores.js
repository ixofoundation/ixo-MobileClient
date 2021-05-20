const {makeSecurePersistentStore, makePersistentStore} = require('$/lib/store'),
    {makeWallet, makeClient} = require('@ixo/client-sdk'),
    {capitalize} = require('lodash-es')

const ixoClientOpts = {
        dashifyUrls: true,
    },
    ixoSDKInstances = {
        wallet: null,
        client: makeClient(null, ixoClientOpts),
    }

const useWallet = makeSecurePersistentStore(
    'Wallet',
    (set) => ({
        secp: null,
        agent: null,

        reset: () => {
            ixoSDKInstances.wallet = null
            ixoSDKInstances.client = makeClient(null, ixoClientOpts)

            set({secp: null, agent: null})
        },

        make: async (walletSrc) => {
            const wallet = await makeWalletAndUpdateInstances(walletSrc),
                walletState = wallet.toJSON()

            // We don't want to save the mnemonic
            walletState.secp.secret = null
            walletState.agent.secret = null

            set(walletState)
        },

        isDidRegistered: async () => {
            const did = ixoSDKInstances.wallet.agent.did,
                resp = await ixoSDKInstances.client.getDidDoc('did:ixo:' + did)

            return !resp.error
        },

        getSecpAccount: () => ixoSDKInstances.client.getSecpAccount(),
        getAgentAccount: () => ixoSDKInstances.client.getAgentAccount(),
        register: () => ixoSDKInstances.client.register(),
        // These has to be lazy, as ixoSDKInstances.client can be updated
    }),
    {
        onLoad: (walletState) =>
            makeWalletAndUpdateInstances(
                walletState.secp ? walletState : undefined,
            ),
    },
)

const makeWalletAndUpdateInstances = async (walletSrc) => {
    const wallet = await makeWallet(walletSrc)

    ixoSDKInstances.wallet = wallet
    ixoSDKInstances.client = makeClient(wallet, ixoClientOpts)

    return wallet
}

const useProjects = makePersistentStore('projects', (set) => ({
    items: {
        /* [projId]: projRecord, ... */
    },

    connect: async (projDid) => {
        const projRec = await ixoSDKInstances.client.getProject(projDid)
        set(({items}) => {
            items[projDid] = projRec
        })
    },

    disconnect: (projDid) => set(({items}) => delete items[projDid]),

    uploadFile: (...args) => ixoSDKInstances.client.createEntityFile(...args),
    getTemplate: (...args) => ixoSDKInstances.client.getTemplate(...args),
    createClaim: (...args) => ixoSDKInstances.client.createClaim(...args),
    listClaims: (...args) => ixoSDKInstances.client.listClaims(...args),
    getProject: (...args) => ixoSDKInstances.client.getProject(...args),
    // These has to be lazy, as ixoSDKInstances.client can be updated
}))

const useStaking = makePersistentStore('staking', (set, get) => ({
    validators: {},
    getValidatorDetail: async (addr) => {
        const {staking} = ixoSDKInstances.client
        const [
            {result: validator},
            {result: pool},
            {
                body: {result: distribution},
            },
            {
                body: {result: availabeStake},
            },
        ] = await Promise.all([
            staking.getValidator(addr),
            staking.pool(),
            staking.validatorDistrubution(addr),
            staking.availableStake(),
        ])

        const [
            {result: delegation},
            {
                body: {result: rewards},
            },
            {result: delegations},
            {result: unboundingDelegations},
        ] = await Promise.all([
            staking.delegation(distribution.operator_address, addr),
            staking.delegetorRewards(distribution.operator_address),
            staking.delegatorDelegations(distribution.operator_address),
            staking.delegatorUnboundingDelegations(
                distribution.operator_address,
            ),
        ])

        const avatarUrl = await staking.validatorAvatarUrl(
            validator.description.identity,
        )

        return {
            validator,
            pool,
            delegation,
            rewards,
            delegations,
            unboundingDelegations,
            availabeStake,
            avatarUrl,
        }
    },

    listValidators: async (...args) => {
        const response = await ixoSDKInstances.client.staking.listValidators(
            ...args,
        )
        set((s) => {
            s.validators = response.result
            return s
        })
    },

    myDelegations: () => ixoSDKInstances.client.staking.myDelegations(),
}))

module.exports = {
    useWallet,
    useProjects,
    useStaking,
}

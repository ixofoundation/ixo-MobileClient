const {makeSecurePersistentStore, makePersistentStore} = require('$/lib/store'),
    {makeWallet, makeClient} = require('@ixo/client-sdk'),
    {sum, sumBy} = require('lodash-es')

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

        getWallet: async () => {
            const {client} = ixoSDKInstances
            const {staking} = client
            const [
                secpAccount,
                agentAccount,
                {result: validators},
                {result: delegations},
                {
                    body: {result: bonds},
                },
            ] = await Promise.all([
                client.getSecpAccount(),
                client.getAgentAccount(),
                staking.listValidators(),
                staking.myDelegations(),
                client.bonds.list(),
            ])

            // Account
            const account = []
            const ixo =
                sum(
                    secpAccount.balance
                        .filter(({denom}) => denom === 'uixo')
                        .map(({amount}) => amount),
                ) /
                10 ** 6
            account.push({
                asset: 'uixo',
                amount: ixo,
                name: 'IXO',
                icon: 'ixo',
            })
            // TODO: other assets be in here added (BTC, $, € etc.)

            // Portfolio
            const bondsMap = Object.fromEntries(
                bonds.map((bond) => {
                    const {
                        supply: {denom},
                    } = bond
                    return [denom, bond]
                }),
            )
            const portfolioPromise = agentAccount.balance
                .filter(({denom}) => !!bondsMap[denom])
                .map(async ({amount, denom}) => {
                    const {
                        body: {result: bond},
                    } = await client.bonds.byId(bondsMap[denom].did)
                    return {bond, amount, denom}
                })

            // Stakes
            const validatorMap = Object.fromEntries(
                validators.map((data) => [data.operator_address, data]),
            )
            const stakesPromise = delegations.map(
                async ({validator_address, ...rest}) => {
                    const validator = validatorMap[validator_address]
                    validator.image_url = await staking.validatorAvatarUrl(
                        validator.description.identity,
                    )
                    return {validator, ...rest}
                },
            )

            const [portfolio, stakes] = await Promise.all([
                Promise.all(portfolioPromise),
                Promise.all(stakesPromise),
            ])

            const accountTotal = sumBy(account, ({amount}) => Number(amount))
            const portfolioTotal = sumBy(portfolio, ({amount}) =>
                Number(amount),
            )
            const stakesTotal = sumBy(stakes, ({balance: {amount}}) =>
                Number(amount),
            )
            const total = Number(accountTotal + portfolioTotal + stakesTotal)

            return {
                account,
                portfolio,
                stakes,
                accountTotal,
                portfolioTotal,
                stakesTotal,
                total,
            }
        },

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

    myDelegations: () =>
        ixoSDKInstances.client.staking
            .myDelegations()
            .then(({result}) => result),
}))

module.exports = {
    useWallet,
    useProjects,
    useStaking,
}

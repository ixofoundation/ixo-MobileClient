const
    React = require('react'),
    {View, Text} = require('react-native'),
    {useQuery} = require('react-query'),
    {sum, sumBy, keyBy} = require('lodash-es'),
    {getClient} = require('$/ixoCli'),
    {spacing, fontSizes} = require('$/theme'),
    AssistantLayout = require('$/AssistantLayout'),
    MenuLayout = require('$/MenuLayout'),
    {Loadable} = require('$/lib/ui'),
    {validatorAvatarUrl} = require('$/lib/util'),
    WalletList = require('./WalletList'),
    WalletItem = require('./WalletItem'),
    WalletSectionHeader = require('./WalletSectionHeader')


const parsePortfolio = ({
    bond: {value: {name}},
    amount,
}) => ({
    name,
    amount: Number(amount),
})

const parseStakes = ({
    balance: {amount},
    validator: {
        description: {moniker},
        image_url,
    },
}) => ({
    amount: Number(amount),
    name: moniker,
    ...(image_url ? {image: {uri: image_url}} : {}),
})

const Wallet = () => {
    const walletQuery = useQuery({
        queryKey: ['wallet-mixed'],
        queryFn: getWallet,
    })

    return <AssistantLayout><MenuLayout>
        <Loadable
            data={walletQuery.data}
            error={walletQuery.error}
            loading={walletQuery.isLoading}
            render={({stakes, account, portfolio, accountTotal, total}) =>
                <View style={styles.root}>
                    <View style={styles.headerContainer}>
                        <Text
                            style={styles.title}
                            children="ACCOUNT VALUE"
                        />

                        <View style={styles.headerInfoSection}>
                            <Text
                                style={styles.dollarText}
                                children="€"
                            />
                            <Text
                                style={styles.dollarAmount}
                                children={total.toFixed(2)}
                            />
                        </View>
                    </View>

                    {/* <WalletChart /> */}
                    <View style={styles.listContainer}>
                        <WalletSectionHeader
                            title="Account"
                            amount={accountTotal}
                        />

                        {account.map(
                            ({amount, asset, icon, name}, key) => (
                                <WalletItem
                                    key={asset + key}
                                    name={name}
                                    amount={amount}
                                    icon={icon}
                                    onPress={() => console.log(asset)}
                                />
                            ),
                        )}

                        <WalletList
                            title="Portfolio"
                            items={portfolio.map(parsePortfolio)}
                            onItemPress={item => console.log('portfolio', item)}
                        />

                        <WalletList
                            title="Stakes"
                            items={stakes.map(parseStakes)}
                            onItemPress={item => console.log('stake', item)}
                        />
                    </View>
                </View>
            }
        />
    </MenuLayout></AssistantLayout>
}

const getWallet = async () => {
    const ixoCli = getClient()

    const [
        {balances: secpBalances},
        {balances: agentBalances},
        {result: validators},
        {result: delegations},
        {result: bonds},
    ] =
        await Promise.all([
            ixoCli.balances('secp'),
            ixoCli.balances('agent'),
            ixoCli.staking.listValidators(),
            ixoCli.staking.myDelegations(),
            ixoCli.bonds.list(),
        ])

    // Account
    const account = []
    const ixo =
        sum(
            secpBalances
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
    const portfolioPromise = agentBalances
        .filter(({denom}) => !!bondsMap[denom])
        .map(async ({amount, denom}) => {
            const {result: bond} = await ixoCli.bonds.byId(bondsMap[denom].did)
            return {bond, amount, denom}
        })

    // Stakes
    const validatorsByAddr = keyBy(validators, 'operator_address')

    const stakesPromise = delegations.map(async d => {
        const validator = validatorsByAddr[d.delegation.validator_address]

        validator.image_url =
            await validatorAvatarUrl(validator.description.identity)

        return {...d, validator}
    })

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
}

const styles = {
    root: {
        flex: 1,
        paddingVertical: spacing(1),
        backgroundColor: '#002233',
    },
    headerContainer: {alignItems: 'center'},
    title: {color: '#5A879D', fontSize: fontSizes.caption},
    headerInfoSection: {flexDirection: 'row'},
    dollarText: {color: 'white', fontSize: 20},
    dollarAmount: {color: 'white', fontSize: fontSizes.numbersLarge},
    listContainer: {flex: 1, paddingHorizontal: spacing(2)},
}


module.exports = Wallet

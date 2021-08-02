const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    {sum, sumBy} = require('lodash-es'),
    {getClient} = require('$/ixoCli'),
    {spacing, fontSizes} = require('$/theme'),
    AssistantLayout = require('$/AssistantLayout'),
    Loadable = require('$/lib/ui/Loadable'),
    {useAsyncData, validatorAvatarUrl} = require('$/lib/util'),
    WalletList = require('./WalletList'),
    MenuLayout = require('$/MenuLayout'),
    WalletItem = require('./WalletItem'),
    WalletSectionHeader = require('./WalletSectionHeader')

const parsePortfolio = ({
    bond: {
        value: {name},
    },
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
    const {data, error, loading} = useAsyncData(getWallet)

    return (
        <AssistantLayout>
            <MenuLayout>
                <Loadable
                    data={data}
                    error={error}
                    loading={loading}
                    render={({
                        stakes,
                        account,
                        portfolio,
                        accountTotal,
                        total,
                    }) => {
                        return (
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
                                                onPress={() =>
                                                    console.log(asset)
                                                }
                                            />
                                        ),
                                    )}

                                    <WalletList
                                        title="Portfolio"
                                        items={portfolio.map(parsePortfolio)}
                                        onItemPress={(item) =>
                                            console.log('portfolio', item)
                                        }
                                    />

                                    <WalletList
                                        title="Stakes"
                                        items={stakes.map(parseStakes)}
                                        onItemPress={(item) =>
                                            console.log('stake', item)
                                        }
                                    />
                                </View>
                            </View>
                        )
                    }}
                />
            </MenuLayout>
        </AssistantLayout>
    )
}

const getWallet = async () => {
    const ixoCli = getClient()

    const [
        secpAccount,
        agentAccount,
        {result: validators},
        {result: delegations},
        {body: {result: bonds}},
    ] = await Promise.all([
        ixoCli.getSecpAccount(),
        ixoCli.getAgentAccount(),
        ixoCli.staking.listValidators(),
        ixoCli.staking.myDelegations(),
        ixoCli.client.bonds.list(),
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
            } = await ixoCli.bonds.byId(bondsMap[denom].did)
            return {bond, amount, denom}
        })

    // Stakes
    const validatorMap = Object.fromEntries(
        validators.map((data) => [data.operator_address, data]),
    )
    const stakesPromise = delegations.map(
        async ({validator_address, ...rest}) => {
            const validator = validatorMap[validator_address]
            validator.image_url = await validatorAvatarUrl(
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
}

const styles = StyleSheet.create({
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
})

module.exports = Wallet

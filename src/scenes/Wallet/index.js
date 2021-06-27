const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    AssistantLayout = require('$/AssistantLayout'),
    Loadable = require('$/lib/ui/Loadable'),
    {useAsyncData} = require('$/lib/util'),
    {useWallet} = require('$/stores'),
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
    const {getWallet} = useWallet()

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

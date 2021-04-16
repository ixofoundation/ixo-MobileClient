
const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    ExchangeRateText = require('./ExchangeRateText'),
    WalletChart = require('./WalletChart'),
    WalletList = require('./WalletList')

 
const walletAccountItems = [
    {
        assetName: 'IXO',
        assetImageUrl: 'someimageurl',
        assetAmount: 230,
        amount: 3,
        exchangeRate: 0.06,
        rate: 0.000258,
        rateName: 'BTC',
    },
    {
        assetName: 'xEUR',
        assetImageUrl: 'someimageurl',
        assetAmount: 390.82,
        amount: 0,
        exchangeRate: -0.09,
        rate: 0,
        rateName: 'ETH',
    },
    {
        assetName: 'xEUR',
        assetImageUrl: 'someimageurl',
        assetAmount: 390.82,
        amount: 0,
        exchangeRate: -0.09,
        rate: 0,
        rateName: 'ETH',
    },
]

const Wallet = () => {
    return (
        <View style={styles.root}>
            <View style={styles.headerContainer}>
                <Text style={styles.title} children='ACCOUNT VALUE'/>
                
                <View style={styles.headerInfoSection}>
                    <Text style={styles.dollarText} children='$'/>
                    <Text style={styles.dollarAmount} children='6,00'/>
                </View>

                <ExchangeRateText change={0.12}/>
            </View>
            <WalletChart/>
            <View style={styles.listContainer}>
                <WalletList items={walletAccountItems} title='Accounts'/>
                <WalletList items={walletAccountItems} title='Portfolio'/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingVertical: spacing(1),
        backgroundColor: '#002233',
    },
    headerContainer: {alignItems: 'center'},
    title: {color: '#5A879D', fontSize: fontSizes.p2},
    headerInfoSection: {flexDirection: 'row'},
    dollarText: {color: 'white', fontSize: fontSizes.h4},
    dollarAmount: {color: 'white', fontSize: fontSizes.h2},
    listContainer: {flex: 1, paddingHorizontal: spacing(2)},
})

module.exports = Wallet
const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    {fontSizes} = require('$/theme')

const WalletSectionHeader = ({title, amount}) => (
    <View style={styles.header}>
        <Text style={styles.title} children={title} />
        <Text style={styles.totalAmount} children={'€' + amount.toFixed(2)} />
    </View>
)

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    title: {
        color: 'white',
        fontSize: fontSizes.h5,
    },
    totalAmount: {
        color: 'white',
        fontSize: fontSizes.h4,
        fontWeight: 'bold',
    },
})

module.exports = WalletSectionHeader

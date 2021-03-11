const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    Icon = require('$/lib/ui/Icon'),
    Card = require('$/lib/ui/Card'),
    {spacing, fontSizes} = require('$/theme')


const ClaimPayment = ({amount, count, currency, status='received'}) => {
    return <Card style={{marginBottom: spacing(2)}}>
        <View style={style.amountContainer}>
            <Text style={style.amountCurrencyText}>{currency} </Text>
            <Text style={style.amountText}>{amount} </Text>
            {statuses[status]}
        </View>
        <View style={style.countContainer}>
            <Text style={style.countNumber}>{count} </Text>
            <Text style={style.countText}>claims </Text>
            <Text style={style.countText}>({currency} </Text>
            <Text style={style.countNumber}>{amount / count} </Text>
            <Text style={style.countText}>per claim)</Text>
        </View>
    </Card>
}

const style = StyleSheet.create({
    amountContainer: {flexDirection: 'row', alignItems: 'flex-end'},
    amountCurrencyText: {color: '#83D9F2', fontSize: fontSizes.h5},
    amountText: {color: 'white', fontSize: fontSizes.h5},
    countText: {color: '#83D9F2', fontSize: fontSizes.caption},
    countNumber: {color: 'white', fontSize: fontSizes.caption},
    countContainer: {flexDirection: 'row'},
    pending: {color: '#ED9526', fontSize: fontSizes.p1},
    received: {color: '#85AD5C', fontSize: fontSizes.p1},
    receivedContainer: {flexDirection: 'row', alignItems: 'center'},
})


const statuses = {
    received: <View style={style.receivedContainer}>
        <Text style={style.received} children='received'/>
        <Icon name='web' width='16' fill='#85AD5C'/>
    </View>,
    pending: <Text style={style.pending} children='pending'/>,
}

module.exports = ClaimPayment
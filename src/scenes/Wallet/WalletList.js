const {spacing, fontSizes} = require('$/theme')
const React = require('react'),
    {View, Text, StyleSheet, Pressable, FlatList} = require('react-native'),
    ExchangeRateText = require('./ExchangeRateText')

 
const WalletItem = ({
    exchangeRate = 0,
    rate = 0,
    rateName = 0,
    amount = 0,
    assetAmount = 0,
    assetName,
    // assetImageUrl,
    onPress,
}) => {
    return <Pressable
        onPress={onPress} 
        style={itemStyles.root}
    >
        <View style={itemStyles.leftContent}>
            <View 
                style={itemStyles.image}
            />
            <View style={{marginRight: spacing(4)}}>
                <Text
                    style={{
                        color: 'white',
                        fontSize: fontSizes.p1,
                        fontWeight: 'bold',
                    }} 
                    children={assetName}
                />
                <Text
                    style={{
                        color: '#5A879D',
                        fontSize: fontSizes.p2,
                    }} 
                    children={assetAmount}
                />
            </View>
        </View>
        
        
        <ExchangeRateText change={exchangeRate}/>
        

        <View style={styles.rightContent}>
            <Text
                style={{
                    color: 'white',
                    fontSize: fontSizes.p1,
                    fontWeight: 'bold',
                }} 
                children={'$' + amount.toFixed(2)}
            />
            <Text
                style={{
                    color: '#5A879D',
                    fontSize: fontSizes.p2,
                }} 
                children={rate.toFixed(6) + ' ' + rateName}
            />
        </View>
    </Pressable>
}

const itemStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#012639',
        borderRadius: 4,
        padding: spacing(2),
        marginTop: spacing(2),
    },
    image: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        marginRight: spacing(2),
    },
    leftContent: {flexDirection: 'row', alignItems: 'flex-start'},
    rightContent: {alignItems: 'flex-end'},

})

const WalletList = ({title, items, onItemPress}) => {
    return <View style={styles.root}>
        <View 
            style={styles.header}
        >
            <Text 
                style={styles.title}
                children={title}
            />
            <Text 
                style={styles.totalAmount} 
                children={'$' + items.reduce(
                    (acc, item) => acc + item.amount, 0,
                )}
            />
        </View>
        <FlatList
            data={items}
            renderItem={({
                item,
            }) => <WalletItem 
                assetName={item.assetName}
                assetImageUrl={item.assetImageUrl}
                assetAmount={item.assetAmount}
                amount={item.amount}
                exchangeRate={item.exchangeRate}
                rate={item.rate}
                rateName={item.rateName}
                onPress={() => onItemPress(item)}
            />
            }
        />
    </View>
}

const styles = StyleSheet.create({
    root: {flex: 1},
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

module.exports = WalletList
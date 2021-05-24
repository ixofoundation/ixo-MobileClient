const React = require('react'),
    {View, StyleSheet, FlatList} = require('react-native'),
    WalletItem = require('./WalletItem'),
    WalletSectionHeader = require('./WalletSectionHeader'),
    {sumBy} = require('lodash-es')

const WalletList = ({title, items, onItemPress}) => {
    return (
        <View style={styles.root}>
            <WalletSectionHeader
                title={title}
                amount={sumBy(items, 'amount')}
            />
            <FlatList
                data={items}
                keyExtractor={(item, index) => item.name + index}
                renderItem={({item, index}) => (
                    <WalletItem
                        key={item.name + index}
                        name={item.name}
                        amount={item.amount}
                        image={item.image}
                        onPress={() => onItemPress(item)}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {},
})

module.exports = WalletList

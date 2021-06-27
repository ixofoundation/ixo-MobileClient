const Icon = require('$/lib/ui/Icon')
const {spacing, fontSizes} = require('$/theme')
const React = require('react'),
    {View, Text, StyleSheet, Pressable, Image} = require('react-native')

const WalletItem = ({amount = 0, name, image = null, icon = null, onPress}) => {
    return (
        <Pressable onPress={onPress} style={styles.root}>
            <View style={styles.leftContent}>
                {image && <Image style={styles.image} source={image} />}
                {icon && (
                    <Icon
                        name={icon}
                        width={24}
                        height={24}
                        style={styles.icon}
                    />
                )}
                <View style={styles.nameContainer}>
                    <Text style={styles.name} children={name} />
                </View>
            </View>

            <View style={styles.rightContent}>
                <Text style={styles.amount} children={amount.toFixed(2)} />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    icon: {marginRight: spacing(2)},
    name: {
        color: 'white',
        fontSize: fontSizes.body,
        fontWeight: '700',
    },
    amount: {
        color: 'white',
        fontSize: fontSizes.body,
        fontWeight: '700',
    },
    nameContainer: {marginRight: spacing(4)},
    leftContent: {flexDirection: 'row', alignItems: 'center'},
    rightContent: {alignItems: 'flex-end'},
})

module.exports = WalletItem

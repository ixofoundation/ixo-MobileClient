const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    {Icon, Button} = require('$/lib/ui'),
    {spacing, fontSizes} = require('$/theme'),
    {memoize} = require('lodash')

const contents = {
    success: {
        message: 'Your claim has been successfully submitted',
        info: 'Your claim is awaiting evaluation. Please check back soon.',
        icon: 'check',
        color: '#85AD5C',
    },
    warning: {
        message: 'Your claim has not been submitted now',
        info: 'Your claim has been saved. Please try again later.',
        icon: 'alertCircle',
        color: '#ED9526',
    },
    danger: {
        message: 'There has been an error submitting your claim',
        info: 'Your claim submission appears to be invalid.',
        icon: 'close',
        color: '#AD245C',
    },
}

const NewClaimResult = ({type = 'success', onNew, onEdit}) => {
    const content = contents[type]
    const higlightStyle = getHiglightStyle(content.color)
    return (
        <View style={style.container}>
            <View style={style.root}>
                <View style={style.content}>
                    <View>
                        <View style={higlightStyle.root}>
                            <Icon
                                name={content.icon}
                                width={24}
                                height={24}
                                fill="white"
                            />
                        </View>
                        <Text
                            style={style.message}
                            children={content.message}
                        />
                    </View>
                    <View style={style.divider} />
                    <Text style={style.extraInfo} children={content.info} />
                </View>
                {type === 'danger' && (
                    <Button
                        text="Edit Claim"
                        type="outlined"
                        style={style.newClaimBtn}
                        onPress={onEdit}
                    />
                )}
                <Button
                    text="New Claim"
                    type="contained"
                    textStyle={style.newClaimBtnText}
                    style={style.newClaimBtn}
                    onPress={onNew}
                />
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing(3),
        backgroundColor: '#F0F3F9',
    },
    root: {
        backgroundColor: 'white',
        padding: spacing(4),
        borderRadius: 8,
        height: '75%',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing(2),
    },
    message: {
        fontSize: fontSizes.h5,
        fontWeight: 'bold',
        color: '#333333',
    },
    extraInfo: {
        fontSize: fontSizes.p1,
        color: '#878F9F',
    },
    divider: {
        borderWidth: 1,
        borderColor: '#E3E7EF',
        marginVertical: spacing(1),
    },
    newClaimBtn: {
        alignItems: 'center',
        padding: spacing(2),
        marginBottom: spacing(2),
    },
    newClaimBtnText: {
        color: 'white',
    },
})

const getHiglightStyle = memoize((color) =>
    StyleSheet.create({
        root: {
            position: 'absolute',
            padding: spacing(2),
            backgroundColor: color,
            borderTopEndRadius: 4,
            borderBottomEndRadius: 4,
            left: -spacing(9),
        },
    }),
)

module.exports = NewClaimResult

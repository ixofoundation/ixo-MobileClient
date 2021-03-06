const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    Icon = require('$/lib/ui/Icon'),
    Button = require('$/lib/ui/Button'),
    {spacing, fontSizes} = require('$/theme')

const ClaimListHeader = ({title, onFilterPress}) => {
    return <View style={style.root}>
        <Text style={style.title}>{title}</Text>
        <Button
            onPress={onFilterPress}
            type='outlined'
            color='primary' 
            prefix={<Icon name='filter' fill='#83D9F2'/>}
            text='Filter'
            style={style.btn}
        />
    </View>
}

const style = StyleSheet.create({
    root: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: spacing(2),
    },
    title:{color: 'white', fontSize: fontSizes.h4},
    btn: {borderRadius: 24},
})

module.exports = ClaimListHeader
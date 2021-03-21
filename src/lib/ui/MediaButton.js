const
    React = require('react'),
    {View, StyleSheet} = require('react-native'),
    {spacing} = require('$/theme'),
    Icon = require('$/lib/ui/Icon')


const MediaButton = () => {
    return <View style={recordBtnStyle.root}>
        <View style={recordBtnStyle.innerContainer}>
            <Icon name='web' width={48} height={48} fill='#00D2FF'/>
        </View>
    </View>
}

const recordBtnStyle = StyleSheet.create({
    root: {
        borderRadius: 48,
        padding: spacing(1),
        backgroundColor: '#F0F3F9',
        
    },
    innerContainer: {
        borderRadius: 48,
        borderColor: '#D0D6DE',
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing(3),
    },
})

module.exports = MediaButton
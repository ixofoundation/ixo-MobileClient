const React = require('react'),
    {Text, StyleSheet} = require('react-native'),
    Card = require('$/lib/ui/Card'),
    Highlight = require('$/lib/ui/Highlight'),
    {fontSizes} = require('$/theme')

const Statistic = ({label, value, highlight}) => {
    return <Card style={style.root}>
        {highlight && <Highlight color={highlight}/>}
        <Text 
            style={style.stat} 
            children={value}
        />
        <Text 
            style={style.label} 
            children={label}
        />
    </Card>
}

const style = StyleSheet.create({
    root: {flex: 1},
    stat: {
        color: 'white', 
        fontSize: fontSizes.h4,
        alignSelf: 'center',
    },
    label: {
        color: '#83D9F2', 
        fontSize: fontSizes.p1, 
        alignSelf: 'center',
    },
})

module.exports = Statistic
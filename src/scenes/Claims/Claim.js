const React = require('react'),
    {Text, StyleSheet} = require('react-native'),
    Highlight = require('$/lib/ui/Highlight'),
    Card = require('$/lib/ui/Card'),
    {spacing, fontSizes} = require('$/theme'),
    moment = require('moment')

const Claim = ({highlight, name, did, savedAt}) => <Card 
    style={style.root}
>
    <Text 
        style={style.name}
        children={name}
    />
    <Text 
        style={style.did}
        children={did}
    />
    <Text 
        style={style.saved}
        children={`Saved ${moment(savedAt).format('dddd, MMMM Do YYYY')}`}
    />
    {highlight && <Highlight color={highlight}/>}
</Card>

const style = StyleSheet.create({
    root: {
        marginBottom: spacing(2),
    },
    name: {
        color: 'white', 
        fontSize: fontSizes.h5, 
        marginBottom: spacing(1),
    },
    did: {
        color: 'white', 
        fontSize: fontSizes.p1, 
        marginBottom: spacing(1),
    },
    saved: {
        color: '#A5ADB0', 
        fontSize: fontSizes.p2, 
        marginBottom: spacing(1),
    },
})

module.exports = Claim
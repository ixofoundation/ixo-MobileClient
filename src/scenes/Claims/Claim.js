const React = require('react'),
    {Text, StyleSheet, Pressable} = require('react-native'),
    Highlight = require('$/lib/ui/Highlight'),
    Card = require('$/lib/ui/Card'),
    {spacing, fontSizes} = require('$/theme'),
    moment = require('moment')

const highlightByStatus = {
    0: '#ED9526',
    1: '#85AD5C',
    2: '#AD245C',
    3: '#E2223B',
}

const Claim = ({
    status,
    name, did, savedAt,
    onPress,
}) => <Pressable onPress={onPress}>
    <Card 
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
        {status && <Highlight color={highlightByStatus[status]}/>}
    </Card>
</Pressable>

const style = StyleSheet.create({
    root: {
        marginBottom: spacing(2),
        marginLeft: spacing(2),
        marginRight: spacing(2),
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

const
    React = require('react'),
    {Text, StyleSheet, Pressable} = require('react-native'),
    Card = require('$/lib/ui/Card'),
    {spacing, fontSizes} = require('$/theme'),
    moment = require('moment')


const ClaimTpl = ({name, description, startDate, endDate, onPress}) =>
    <Pressable onPress={onPress}>
        <Card
            style={style.root}
        >
            <Text style={style.name} children={name} />
            <Text style={style.description} children={description} />
            <Text
                style={style.saved}
                children={
                    moment(startDate).format('D MMM \'YY') + ' - ' +
                    moment(endDate).format('D MMM \'YY')
                }
            />
        </Card>
    </Pressable>

const style = StyleSheet.create({
    root: {
        marginBottom: spacing(2),
        marginLeft: spacing(2),
        marginRight: spacing(2),
        backgroundColor: '#002B3F',
    },
    name: {
        color: 'white',
        fontSize: fontSizes.h5,
        marginBottom: spacing(1),
    },
    description: {
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


module.exports = ClaimTpl

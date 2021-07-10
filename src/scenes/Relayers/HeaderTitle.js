const React = require('react'),
    {Text, StyleSheet} = require('react-native'),
    {spacing, fontSizes} = require('$/theme')

const HeaderTitle = ({text}) => <Text style={styles.root} children={text} />

const styles = StyleSheet.create({
    root: {
        color: 'white',
        fontSize: 14,
        marginLeft: spacing(1),
        fontWeight: '700',
    },
})

module.exports = HeaderTitle

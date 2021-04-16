const React = require('react'),
    {Text, StyleSheet} = require('react-native'),
    {spacing, fontSizes} = require('$/theme')


const HeaderTitle = ({text}) => <Text style={styles.root} children={text}/>


const styles = StyleSheet.create({
    root: {
        color: 'white',
        fontSize: fontSizes.p1,
        marginLeft: spacing(1),
        fontWeight: 'bold',
    },
    
})

module.exports = HeaderTitle
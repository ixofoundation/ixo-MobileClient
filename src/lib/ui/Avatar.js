const {memoize} = require('lodash')
const React = require('react'),
    {Image, StyleSheet} = require('react-native')


const Avatar = ({uri, size, styles: overrideStyles}) => {
    return <Image 
        source={{uri}}
        style={StyleSheet.compose(styles(size).root, overrideStyles)}   
    />
}   

const styles = memoize((size) => {
    return StyleSheet.create({
        root: { 
            width: 8 * size,
            height: 8 * size,
            borderRadius: (8 * size) / 2,
        },
    })
})

module.exports = Avatar
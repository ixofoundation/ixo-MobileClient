import React from 'react'
import {Text, TouchableHighlight} from 'react-native'


const Button = ({text, onPress}) =>
    <TouchableHighlight onPress={onPress}>
        <Text>{text}</Text>
    </TouchableHighlight>


export default Button

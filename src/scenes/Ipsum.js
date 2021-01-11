const
    React = require('react'),
    {View, Text, TouchableHighlight} = require('react-native'),
    {withNav} = require('../lib/nav')


const Ipsum = ({nav}) =>
    <View>
        <Text>ipsum</Text>

        <TouchableHighlight
            onPress={() => nav.stateNavigator.navigateBack(1)}
        >
            <Text>Go back!</Text>
        </TouchableHighlight>
    </View>

module.exports = withNav(Ipsum)

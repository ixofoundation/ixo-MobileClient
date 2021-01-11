const
    React = require('react'),
    {View, Text, TouchableHighlight} = require('react-native'),
    {withNav} = require('$/lib/nav')


const Lorem = ({nav}) =>
    <View>
        <Text>lorem</Text>

        <TouchableHighlight
            onPress={() => nav.stateNavigator.navigate('ipsum')}
        >
            <Text>Press me</Text>
        </TouchableHighlight>
    </View>


module.exports = withNav(Lorem)

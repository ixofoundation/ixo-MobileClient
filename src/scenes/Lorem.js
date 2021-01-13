const
    {useState, ...React} = require('react'),
    {View, Text, TouchableHighlight} = require('react-native'),
    {withNav} = require('$/lib/nav'),
    {entropyToMnemonic} = require('bip39'),
    {randomBytes} = require('react-native-randombytes')


const Lorem = ({nav}) => {
    const [mm, setMm] = useState('')

    return (
        <View>
            <Text>Mnemonic: {mm}</Text>

            <TouchableHighlight
                onPress={() => setMm(entropyToMnemonic(randomBytes(16)))}
            >
                <Text>Generate Mnemonic</Text>
            </TouchableHighlight>

            <TouchableHighlight
                onPress={() => nav.stateNavigator.navigate('ipsum')}
            >
                <Text>Press me</Text>
            </TouchableHighlight>
        </View>
    )
}


module.exports = withNav(Lorem)

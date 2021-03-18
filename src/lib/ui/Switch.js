const {Switch: RNSwitch} = require('react-native')

const Switch = ({onChange, ...rest}) => 
    <RNSwitch onValueChange={onChange} {...rest}/>

module.exports = Switch

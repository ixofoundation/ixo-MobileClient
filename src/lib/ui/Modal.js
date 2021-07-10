const React = require('react'),
    {Modal, SafeAreaView} = require('react-native')

const SafeAreaModal = ({children, ...props}) => (
    <Modal
        {...props}
        children={<SafeAreaView children={children} style={{flex: 1}} />}
    />
)

module.exports = SafeAreaModal

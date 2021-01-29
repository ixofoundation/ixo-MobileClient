const
    React = require('react'),
    {Text, Button} = require('$/lib/ui'),
    AssistantLayout = require('$/AssistantLayout')


const Credit = () =>
    <AssistantLayout
        initMsg='I want to credit my account'
    >
        <Text children='testing falan filans' />

        <Button text='Continue' onPress={console.log} />
    </AssistantLayout>


module.exports = Credit

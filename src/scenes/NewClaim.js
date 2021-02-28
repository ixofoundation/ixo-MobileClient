const
    React = require('react'),
    {createElement, useContext, useState} = React,
    {View, Text, Modal} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {Heading, ButtonGroup, Button, TextInput, Select} = require('$/lib/ui')


const NewClaim = ({projectDid, templateDid}) => {
    const
        {stateNavigator: nav} = useContext(NavigationContext),
        [formShown, toggleForm] = useState(false)

    return <MenuLayout><AssistantLayout>
        <Heading children='Submit a Claim' />

        <Text>
            Thank you for being interested in our project. In order to complete
            the claims on this project you'll need to complete the following:
        </Text>

        <Text children='Fill in a short answer' />
        <Text children='Choose between options' />
        <Text children='Upload an image' />
        <Text children='Upload audio' />
        <Text children='Upload a file / document' />
        <Text children='Give a detailed answer' />
        <Text children='Select an image' />
        <Text children='Upload video' />
        <Text children='Scan a QR code' />

        <ButtonGroup items={[{
            type: 'outlined',
            text: 'Come back later',
            onPress: () => nav.navigateBack(1),
        }, {
            type: 'contained',
            text: 'Submit a Claim',
            onPress: () => toggleForm(true),
        }]} />

        <Modal
            visible={formShown}
            onRequestClose={() => toggleForm(false)}
            children={<ClaimForm onClose={() => toggleForm(false)} />}
        />
    </AssistantLayout></MenuLayout>
}

const ClaimForm = ({onClose}) => {
    const
        [currentStepIdx, setCurrentStep] = useState(0),
        currentStep = claimFormSteps[currentStepIdx],
        [formState, setFormState] = useState({}),
        [formError, setFormError] = useState(null)

    console.log('form state', formState)

    return <View>
        <Button type='contained' text='Close' onPress={onClose} />

        {createElement(currentStep.comp, {
            value: formState[currentStep.id],
            onChange: val =>
                setFormState(fs => ({...fs, [currentStep.id]: val})),
        })}

        {formError === 'required' &&
            <Text children='Field is required' style={{color: 'red'}} />}

        {currentStepIdx > 0 &&
            <Button
                text='Prev'
                type='outlined'
                onPress={() => setCurrentStep(s => s - 1)}
            />}

        {currentStepIdx < claimFormSteps.length - 1 &&
            <Button
                text='Next'
                type='contained'
                onPress={() => {
                    const emptyVals = ['null', 'undefined', '']

                    if (emptyVals.includes(String(formState[currentStep.id])))
                        return setFormError('required')

                    setFormError(null)
                    setCurrentStep(s => s + 1)
                }}
            />}
    </View>
}

const FillInShortAnswer = ({value, onChange}) => <>
    <TextInput
        placeholder='Fill in a short answer'
        value={value}
        onChangeText={onChange}
    />
</>

const ChooseBetweenOptions = ({value, onChange}) => <>
    <Text children='choose between options' />

    <Select
        multiple
        opts={['lorem', 'ipsum', 'dolor']}
        value={value}
        onChange={onChange}
    />
</>

const UploadImage = ({value, onChange}) =>
    <Text children='upload image' />

const UploadAudio = ({value, onChange}) =>
    <Text children='upload audio' />

const UploadDoc = ({value, onChange}) =>
    <Text children='upload doc' />

const GiveDetailedAnswer = ({value, onChange}) =>
    <Text children='give detailed answer' />

const SelectImage = ({value, onChange}) =>
    <Text children='select image' />

const UploadVideo = ({value, onChange}) =>
    <Text children='upload video' />

const ScanQRCode = ({value, onChange}) =>
    <Text children='scan QR code' />

const claimFormSteps = [
    {id: 'shortAnswer',  comp: FillInShortAnswer},
    {id: 'chosenOption', comp: ChooseBetweenOptions},
    {id: 'img',          comp: UploadImage},
    {id: 'audio',        comp: UploadAudio},
    {id: 'doc',          comp: UploadDoc},
    {id: 'longAnswer',   comp: GiveDetailedAnswer},
    {id: 'selectedImg',  comp: SelectImage},
    {id: 'video',        comp: UploadVideo},
    {id: 'qr',           comp: ScanQRCode},
]


module.exports = NewClaim

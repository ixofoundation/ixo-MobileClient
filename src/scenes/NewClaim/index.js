const
    React = require('react'),
    {createElement, useContext, useState} = React,
    {View, ScrollView, Text, Image} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {readFile} = require('react-native-fs'),
    {noop} = require('lodash-es'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {
        Heading, ButtonGroup, Button, TextInput, Select, AudioInput, ImageInput,
        DocumentInput, QRCodeInput, DateInput, VideoInput, LocationInput, Modal,
    } = require('$/lib/ui'),
    {selectFile} = require('$/lib/util'),
    catPic1 = require('./assets/cat1.jpg'),
    catPic2 = require('./assets/cat2.jpg'),
    catPic3 = require('./assets/cat3.jpg'),
    catPic4 = require('./assets/cat4.jpg')


const claimFormSteps = [
    {
        id: 'shortAnswer',
        title: 'Fill in a short answer',
        comp: TextInput,
    },
    {
        id: 'chosenOption',
        title: 'Choose between options',
        comp: Select,
        props: {
            multiple: true,
            opts: ['lorem', 'ipsum', 'dolor'],
        },
    },
    {
        id: 'img',
        title: 'Upload an image',
        comp: ImageInput,
    },
    {
        id: 'audio',
        title: 'Upload an audio',
        comp: AudioInput,
    },
    {
        id: 'doc',
        title: 'Upload a document',
        comp: DocumentInput,
    },
    {
        id: 'longAnswer',
        title: 'Give a detailed answer',
        comp: TextInput,
    },
    {
        id: 'selectedImg',
        title: 'Select an image',
        comp: Select,
        props: {
            opts: [
                ['cat1', catPic1],
                ['cat2', catPic2],
                ['cat3', catPic3],
                ['cat4', catPic4],
            ].map(([value, source]) => ({
                value,
                title: <Image source={source} style={{width: 120}} />,
            })),
        },
    },
    {
        id: 'video',
        title: 'Upload a Video',
        comp: VideoInput,
    },
    {
        id: 'qr',
        title: 'Scan a QR Code',
        comp: QRCodeInput,
    },
    {
        id: 'date',
        title: 'Select a date',
        comp: DateInput,
    },
    {
        id: 'rating',
        title: 'Give a rating',
        comp: Select,
        props: {
            opts: [1, 2, 3, 4, 5],
        },
    },
    {
        id: 'location',
        title: 'Select a location',
        comp: LocationInput,
    },
]

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

        {claimFormSteps.map(({id, title}) =>
            <Text key={id} children={'- ' + title} />)}

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
            children={
                <ClaimForm
                    onClose={() => toggleForm(false)}
                />}
        />
    </AssistantLayout></MenuLayout>
}

const ClaimForm = ({onClose = noop, onSubmit = noop}) => {
    const
        [currentStepIdx, setCurrentStep] = useState(0),
        currentStep = claimFormSteps[currentStepIdx],
        [formState, setFormState] = useState({}),
        [formError, setFormError] = useState(null)

    console.log('form state', formState)

    return <View>
        <Button type='contained' text='Close' onPress={onClose} />

        <Text
            children={
                (currentStepIdx + 1)
                + '/'
                + (claimFormSteps.length)
                + ': '
                + currentStep.title
            }
            style={{fontWeight: 'bold'}}
        />

        {createElement(currentStep.comp, {
            value: formState[currentStep.id],

            onChange: val =>
                setFormState(fs => ({...fs, [currentStep.id]: val})),

            ...currentStep.props,
        })}

        {formError === 'required' &&
            <Text children='Field is required' style={{color: 'red'}} />}

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {currentStepIdx > 0 &&
                <Button
                    text='Prev'
                    type='outlined'
                    onPress={() => {
                        setFormError(null)
                        setCurrentStep(s => s - 1)
                    }}
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
    </View>
}

const uploadFileToCellNode = async (
    ps,
    projectDid,
    fileMimeType,
    localFilePath,
) => {
    const
        base64Content = await readFile(localFilePath, 'base64'),

        serviceEndpoint =
            dashedHostname(
                ps.items[projectDid].data.nodes.items
                    .find(i => i['@type'] === 'CellNode')
                    .serviceEndpoint
                    .replace(/\/$/, ''),
            ),

        fileId =
            await ps.createFile(
                serviceEndpoint,
                'data:' + fileMimeType + ';base64,' + base64Content,
            ),

        fileUrl = serviceEndpoint + '/public/' + fileId

    return fileUrl
}

const dashedHostname = urlStr =>
    urlStr.replace(
        /^(https?:\/\/)([^/]+)(\/.*)?/,
        (_, proto, host, path) => proto + host.replace('_', '-') + (path || ''),
    )


module.exports = NewClaim

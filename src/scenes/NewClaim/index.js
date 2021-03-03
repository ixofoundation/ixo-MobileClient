const
    React = require('react'),
    {createElement, useContext, useState, Fragment} = React,
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


const formSpec = [
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

        {formSpec.map(({id, title}) =>
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
                    formSpec={formSpec}
                    onClose={() => toggleForm(false)}
                />}
        />
    </AssistantLayout></MenuLayout>
}

const ClaimForm = ({formSpec, onClose = noop, onSubmit = noop}) => {
    const
        [formState, setFormState] = useState({}),
        [currentStepIdx, setCurrentStep] = useState(0)

    console.log('form state', formState)

    return <View>
        <Button type='contained' text='Close' onPress={onClose} />

        {currentStepIdx === formSpec.length

            ? <ClaimFormSummary
                formSpec={formSpec}
                formState={formState}
                onFocusItem={setCurrentStep}
                onApprove={onSubmit}
            />

            : <ClaimFormSteps
                value={formState}
                onChange={setFormState}
                currentStep={formSpec[currentStepIdx]}
                currentStepIdx={currentStepIdx}
                totalSteps={formSpec.length}
                onPrev={() => setCurrentStep(s => s - 1)}
                onNext={() => setCurrentStep(s => s + 1)}
            />}
    </View>
}

const ClaimFormSteps = ({
    value,
    onChange,
    currentStep,
    currentStepIdx,
    totalSteps,
    onPrev,
    onNext,
}) => {
    const [formError, setFormError] = useState(null)

    return <View>
        <Text
            children={
                (currentStepIdx + 1)
                + '/'
                + (totalSteps)
                + ': '
                + currentStep.title
            }
            style={{fontWeight: 'bold'}}
        />

        {createElement(currentStep.comp, {
            value: value[currentStep.id],

            onChange: val =>
                onChange(fs => ({...fs, [currentStep.id]: val})),

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
                        onPrev()
                    }}
                />}

            {currentStepIdx < totalSteps &&
                <Button
                    text='Next'
                    type='contained'
                    onPress={() => {
                        const emptyVals = ['null', 'undefined', '']

                        if (emptyVals.includes(String(value[currentStep.id])))
                            return setFormError('required')

                        setFormError(null)
                        onNext()
                    }}
                />}
        </View>
    </View>
}

const ClaimFormSummary = ({formSpec, formState, onFocusItem, onApprove}) =>
    <ScrollView style={{height: '100%'}}>
        {formSpec.map(({id, title, comp, props}, itemIdx) =>
            <Fragment key={id}>
                <Text children={title} style={{fontWeight: 'bold'}} />

                {[Select, ImageInput, AudioInput, VideoInput, DocumentInput]
                    .includes(comp)

                    ? createElement(comp, {
                        ...props,
                        value: formState[id],
                        editable: false,
                    })

                    : <Text children={
                        typeof formState[id] !== 'string'
                            ? JSON.stringify(formState[id])
                            : formState[id]} />
                }

                <Button
                    type='outlined'
                    text='Edit'
                    onPress={() => onFocusItem(itemIdx)}
                />
            </Fragment>,
        )}

        <ButtonGroup items={[{
            type: 'outlined',
            text: 'Save',
            onPress: () => alert('Not Implemented Yet'),
        }, {
            type: 'contained',
            text: 'Submit claim',
            onPress: () => alert('unimplemented'),
        }]} />

        <View style={{height: 50}} />
        {/* In Android some space from the bottom is needed or else the buttons
            above don't show up. Obviously this is an ugly hack waiting for a
            proper fix */}
    </ScrollView>

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

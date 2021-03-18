const
    debug = require('debug')('claims'),
    React = require('react'),
    {createElement, useContext, useState, useCallback, Fragment} = React,
    {View, ScrollView, Text, ActivityIndicator} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {useQuery} = require('react-query'),
    {noop, keyBy} = require('lodash-es'),
    {useProjects} = require('$/stores'),
    {fileToDataURL} = require('$/lib/util'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {
        Heading, ButtonGroup, Button, TextInput, Select, AudioInput, ImageInput,
        DocumentInput, QRCodeInput, DateInput, VideoInput, LocationInput, Modal,
        DateRangeInput,
    } = require('$/lib/ui'),
    {keys, values, entries} = Object


const formComponents = {
    text: TextInput,
    textarea: p => <TextInput multiline numberOfLines={3} {...p} />,
    checkboxes: Select,
    radio: Select,
    singledateselector: DateInput,
    daterangeselector: DateRangeInput,
    qrcodescan: QRCodeInput,
    locationselector: LocationInput,
    imageupload: ImageInput,
    avatarupload: ImageInput,
    documentupload: DocumentInput,
    videoupload: VideoInput,
    audioUpload: AudioInput,
}

const claimTemplateToFormSpec = claimTemplate =>
    claimTemplate.forms

        .filter(f =>
            formComponents[values(f.uiSchema)[0]['ui:widget']])

        .map(f => {
            const
                id = keys(f.schema.properties)[0],
                attribute = f['@type'],
                {title, description} = f.schema,
                schema = values(f.schema.properties)[0],
                uiSchema = values(f.uiSchema)[0]

            return {
                id,
                title,
                attribute,
                description,
                comp: formComponents[uiSchema['ui:widget']],
                props: {
                    placeholder: uiSchema['ui:placeholder'],

                    ...((schema.items.enum || schema.enum) && {
                        multiple: uiSchema['ui:widget'] === 'checkboxes',
                        opts:
                            (schema.items.enum || schema.enum)
                                .map((value, idx) =>({
                                    value,

                                    title:
                                        schema.items.enumNames
                                            ? schema.items.enumNames[idx]
                                            : value,
                                })),
                    }),
                },
            }
        })


const NewClaim = ({templateDid, projectDid}) => {
    const
        {getTemplate, uploadFile, createClaim} = useProjects(),
        {stateNavigator: nav} = useContext(NavigationContext),
        [formShown, toggleForm] = useState(false),
        formSpecQuery =
            useQuery(['tpl', templateDid], () =>
                getTemplate(templateDid)
                    .then(tpl =>
                        claimTemplateToFormSpec(tpl.data.page.content))),

        submit = useCallback(async formState => {
            const
                formSpecById = keyBy(formSpecQuery.data, 'id'),

                formEntries =
                    await Promise.all(
                        entries(formState).map(async ([id, value]) => {
                            if (!value.uri)
                                return [id, value]

                            const dataURL =
                                await fileToDataURL(value.uri, value.type)

                            debug(
                                'Uploading file',
                                value.type,
                                (dataURL.length / 1048576).toFixed(2) + 'MB',
                                value.uri,
                            )

                            const remoteURL =
                                await uploadFile(projectDid, dataURL)

                            return [id, remoteURL]

                        }),
                    ),

                claimItems =
                    formEntries
                        .map(([id, value]) => ({
                            id,
                            value,
                            attribute: formSpecById[id].attribute,
                        }))

            const resp = await createClaim(projectDid, templateDid, claimItems)

            console.log('create claim response', resp)

            // We will save the resp to the claim store
        })

    return <MenuLayout><AssistantLayout>
        <Heading children='Submit a Claim' />

        {formSpecQuery.isLoading && <>
            <ActivityIndicator color='#555555' size='large' />
            <Text children='Preparing the claim form, please wait...' />
        </>}

        {formSpecQuery.isError &&
            <Text children='An error occurred, please try again later.' />}

        {formSpecQuery.data && <ScrollView>
            <Text>
                Thank you for being interested in our project. In order to
                complete the claims on this project you'll need to complete the
                following:
            </Text>

            {formSpecQuery.data.map(({id, title}) =>
                <Text key={id} children={'- ' + title} />)}

            <ButtonGroup
                items={[{
                    type: 'outlined',
                    text: 'Come back later',
                    onPress: () => nav.navigateBack(1),
                }, {
                    type: 'contained',
                    text: 'Submit a Claim',
                    onPress: () => toggleForm(true),
                }]}
                style={{marginBottom: 100}}
            />
        </ScrollView>}

        <Modal
            visible={formShown}
            onRequestClose={() => toggleForm(false)}
            children={
                <ClaimForm
                    formSpec={formSpecQuery.data}
                    onClose={() => toggleForm(false)}
                    onSubmit={submit}
                />}
        />
    </AssistantLayout></MenuLayout>
}

const ClaimForm = ({formSpec, onClose = noop, onSubmit = noop}) => {
    const
        [formState, setFormState] = useState({}),
        [currentStepIdx, setCurrentStep] = useState(0)

    return <View>
        <Button type='contained' text='Close' onPress={onClose} />

        {currentStepIdx === formSpec.length

            ? <ClaimFormSummary
                formSpec={formSpec}
                formState={formState}
                onFocusItem={setCurrentStep}
                onApprove={() => onSubmit(formState)}
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

        <Text children={currentStep.description} />

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

        <ButtonGroup>
            <Button
                type='outlined'
                text='Save'
                onPress={() => alert('Not Implemented Yet')}
            />
            <Button
                type='contained'
                text='Submit claim'
                onPress={onApprove}
            />
        </ButtonGroup>

        <View style={{height: 50}} />
        {/* In Android some space from the bottom is needed or else the buttons
            above don't show up. Obviously this is an ugly hack waiting for a
            proper fix */}
    </ScrollView>



module.exports = NewClaim

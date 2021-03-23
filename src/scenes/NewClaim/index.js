const StepForm = require('$/lib/ui/StepForm')
const {spacing, fontSizes} = require('$/theme')

const
    debug = require('debug')('claims'),
    React = require('react'),
    {createElement, useContext, useState, useCallback, Fragment} = React,
    {View, ScrollView, Text, Pressable,
        ActivityIndicator, StyleSheet} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {useQuery} = require('react-query'),
    {noop, keyBy} = require('lodash-es'),
    {useProjects} = require('$/stores'),
    {fileToDataURL} = require('$/lib/util'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {
        ButtonGroup, Button, TextInput, Select, AudioInput, ImageInput,
        DocumentInput, QRCodeInput, DateInput, VideoInput, LocationInput, Modal,
        DateRangeInput, Header, Icon,
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
        <View style={newClaimStyle.root}>
            <Text children='Submit a Claim' style={newClaimStyle.title}/>

            {formSpecQuery.isLoading && <>
                <ActivityIndicator color='#555555' size='large' />
                <Text children='Preparing the claim form, please wait...' />
            </>}

            {formSpecQuery.isError &&
            <Text children='An error occurred, please try again later.' />}


            {formSpecQuery.data && <Text style={newClaimStyle.info}>
                Thank you for being interested in our project. In order to
                complete the claims on this project you'll need to complete the
                following:
            </Text>}

            {formSpecQuery.data && <ScrollView>
                {formSpecQuery.data.map(({id, title}) =>
                    <View key={id} style={newClaimStyle.formStepItem}>
                        <Text children={'- ' + title} />
                    </View>)}
            </ScrollView>}

            {formSpecQuery.data && <View style={newClaimStyle.btnContainer}>
                <Button type='outlined' text='Come back later' 
                    onPress={() => nav.navigateBack(1)}/>
                <Button type='contained' text='Submit a Claim' 
                    onPress={() => toggleForm(true)}/>
            </View>}

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
        </View>
    </AssistantLayout></MenuLayout>
}

const newClaimStyle = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F0F3F9',
        paddingHorizontal: spacing(3),
        paddingTop: spacing(3),
    },
    title: {
        fontSize: fontSizes.h5,
        color: '#333333',
        fontWeight: 'bold',
        marginBottom: spacing(1),
    },
    info: {
        color: '#878F9F',
        fontSize: fontSizes.p1,
        marginBottom: spacing(2),
    },
    formStepItem: {
        padding: spacing(1),
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: spacing(1),
    },
    btnContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: spacing(2),
    },
})

const ClaimForm = ({formSpec, onClose = noop, onSubmit = noop}) => {
    const
        [formState, setFormState] = useState({}),
        [currentStepIdx, setCurrentStep] = useState(0)

    return <View style={{flex: 1}}>
        <Header>
            <Pressable onPress={onClose}>
                <Icon name='close' width={24} fill='white'/>
            </Pressable>
            <Text 
                style={claimFormStyle.title}
                children='New Claim'
            />
            <View style={{width: 24}}/>
        </Header>

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

const claimFormStyle = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: fontSizes.h5,
    },
})

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


    return <StepForm 
        current={currentStepIdx} 
        total={totalSteps}
        onNext={() => {
            if (currentStepIdx > totalSteps)  {
                return
            }
            const emptyVals = ['null', 'undefined', '']

            if (emptyVals.includes(String(value[currentStep.id])))
                return setFormError('required')

            setFormError(null)
            onNext()
        }}
        onPrev={() => {
            if (currentStepIdx === 0) {
                return
            }
            setFormError(null)
            onPrev()
        }}
    >
        <Text
            style={formStyles.stepText}
            children={
                'QUESTION '
                + (currentStepIdx + 1)
                + '/'
                + (totalSteps)
            }
        />

        <Text style={formStyles.title} children={currentStep.title}/>

        <Text 
            style={formStyles.description} 
            children={currentStep.description} 
        />

        {createElement(currentStep.comp, {
            value: value[currentStep.id],

            onChange: val =>
                onChange(fs => ({...fs, [currentStep.id]: val})),

            ...currentStep.props,
        })}

        {formError === 'required' &&
            <Text children='Field is required' style={{color: 'red'}} />}
    </StepForm>
}

const formStyles = StyleSheet.create({
    stepText: {marginBottom: spacing(1)},
    title: {
        fontSize: fontSizes.h5, 
        color: '#333333',
        fontWeight: 'bold',
        marginBottom: spacing(1),
    },
    description: {
        color: '#878F9F',
        fontSize: fontSizes.p1,
        marginBottom: spacing(2),
    },
})

const ClaimFormSummary = ({formSpec, formState, onFocusItem, onApprove}) =>
    <ScrollView style={sumStyle.root}>
        <Text children='Claim Summary' style={sumStyle.header} />

        {formSpec.map(({id, title, comp, props}, itemIdx) =>
            <View key={id} style={sumStyle.itemBoxContainer}>
                <ClaimFormSummaryVerticalProgressIndicator
                    formSpec={formSpec}
                    itemIdx={itemIdx}
                />

                <View style={sumStyle.itemBox}>
                    <Text children={title} style={sumStyle.itemBoxTitle} />

                    {[Select, ImageInput, AudioInput, VideoInput, DocumentInput]
                        .includes(comp)

                        ? createElement(comp, {
                            ...props,
                            value: formState[id],
                            editable: false,
                        })

                        : <Text style={sumStyle.itemBoxText} children={
                            typeof formState[id] !== 'string'
                                ? JSON.stringify(formState[id], null, 4)
                                : formState[id]} />
                    }

                    <Pressable
                        onPress={() => onFocusItem(itemIdx)}
                        children={<Icon name='edit' width={20} fill='#bbb' />}
                        style={sumStyle.itemBoxEditBtn}
                    />
                </View>
            </View>,
        )}

        <ButtonGroup items={[{
            type: 'outlined',
            text: 'Save',
            onPress: () => alert('Not Implemented Yet'),
        }, {
            type: 'contained',
            text: 'Submit a claim',
            onPress: onApprove,
        }]} />

        <View style={{height: 50}} />
        {/* In Android some space from the bottom is needed or else the buttons
            above don't show up. Obviously this is an ugly hack waiting for a
            proper fix */}
    </ScrollView>

const ClaimFormSummaryVerticalProgressIndicator = ({formSpec, itemIdx}) => <>
    <View style={{
        width: 11,
        borderRightWidth: 2,
        borderColor:
            itemIdx === formSpec.length - 1
                ? 'transparent'
                : '#007994',
    }} />
    <View style={{
        position: 'relative',
        left: -10,
        top:
            (itemIdx === formSpec.length - 1 || itemIdx === 0)
                ? 0
                : 20,
        width: 18,
        height: 18,
        borderWidth: 2,
        borderRadius: 9,
        borderColor: '#007994',
        backgroundColor: 'white',
        justifyContent: 'center',
    }}>
        <View style={{
            width: 9,
            height: 9,
            backgroundColor: '#007994',
            borderRadius: 4,
            alignSelf: 'center',
        }} />
    </View>
</>

const sumStyle = {
    root: {
        position: 'relative',
        height: '100%',
        backgroundColor: '#F0F3F9',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    header: {
        fontSize: 25,
        marginBottom: 20,
    },
    itemBoxContainer: {
        flexDirection: 'row',
    },
    itemBox: {
        flexGrow: 1,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        width: 200, /* TODO: Hack: If we don't have this, the box overgrows for some reason */// eslint-disable-line max-len
    },
    itemBoxTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingBottom: 10,
        color: '#333',
    },
    itemBoxText: {
        color: '#555',
    },
    itemBoxEditBtn: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
}



module.exports = NewClaim

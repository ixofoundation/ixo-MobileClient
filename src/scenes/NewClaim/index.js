const debug = require('debug')('claims'),
    React = require('react'),
    {createElement, useContext, useState} = React,
    {
        View,
        ScrollView,
        Text,
        Pressable,
        ActivityIndicator,
        StyleSheet,
        Keyboard,
    } = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {useQuery} = require('react-query'),
    {noop, keyBy} = require('lodash-es'),
    {getClient} = require('$/ixoCli'),
    {fileToDataURL, pollFor} = require('$/lib/util'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {
        ButtonGroup,
        Button,
        TextInput,
        Select,
        AudioInput,
        ImageInput,
        DocumentInput,
        QRCodeInput,
        DateInput,
        VideoInput,
        LocationInput,
        Modal,
        DateRangeInput,
        Header,
        Icon,
    } = require('$/lib/ui'),
    StepForm = require('$/lib/ui/StepForm'),
    Loadable = require('$/lib/ui/Loadable'),
    NewClaimResult = require('./NewClaimResult'),
    {keys, values, entries} = Object,
    {spacing, fontSizes} = require('$/theme')

const formComponents = {
    text: {comp: TextInput, icon: 'textShort'},
    textarea: {
        comp: (p) => <TextInput multiline numberOfLines={3} {...p} />,
        icon: 'textLong',
    },
    checkboxes: {comp: Select, icon: 'checkboxMultiple'},
    radio: {comp: Select, icon: 'grid'},
    singledateselector: {comp: DateInput, icon: 'calendar'},
    daterangeselector: {comp: DateRangeInput, icon: 'calendarRange'},
    qrcodescan: {comp: QRCodeInput, icon: 'scan'},
    locationselector: {comp: LocationInput, icon: 'mapMarker'},
    imageupload: {comp: ImageInput, icon: 'imagePlus'},
    avatarupload: {comp: ImageInput, icon: 'accountPlus'},
    documentupload: {comp: DocumentInput, icon: 'file'},
    videoupload: {comp: VideoInput, icon: 'playBox'},
    audioUpload: {comp: AudioInput, icon: 'microphone'},
}

const claimTemplateToFormSpec = (claimTemplate) =>
    claimTemplate.forms

        .filter((f) => formComponents[values(f.uiSchema)[0]['ui:widget']])

        .map((f) => {
            const id = keys(f.schema.properties)[0],
                attribute = f['@type'],
                {title, description} = f.schema,
                schema = values(f.schema.properties)[0],
                uiSchema = values(f.uiSchema)[0]

            const {comp, icon} = formComponents[uiSchema['ui:widget']]
            return {
                id,
                title,
                attribute,
                description,
                comp,
                icon,
                props: {
                    placeholder: uiSchema['ui:placeholder'],

                    ...((schema.items.enum || schema.enum) && {
                        multiple: uiSchema['ui:widget'] === 'checkboxes',
                        opts: (schema.items.enum || schema.enum).map(
                            (value, idx) => ({
                                value,

                                title: schema.items.enumNames
                                    ? schema.items.enumNames[idx]
                                    : value,
                            }),
                        ),
                    }),
                },
            }
        })

const ClaimStepsView = ({steps, onBack, onSubmit}) => (
    <>
        <Text style={newClaimStyle.info}>
            Thank you for being interested in our project. In order to complete
            the claims on this project you'll need to complete the following:
        </Text>
        <ScrollView>
            {steps.map(({id, title, icon}) => (
                <View key={id} style={newClaimStyle.formStepItem}>
                    <Icon name={icon} fill={'#C3D0E5'} />
                    <Text
                        children={title}
                        style={newClaimStyle.formStepItemTitle}
                    />
                </View>
            ))}
        </ScrollView>
        <View style={newClaimStyle.btnContainer}>
            <Button
                type="outlined"
                text="Come back later"
                onPress={onBack}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                textStyle={{
                    color: 'black',
                }}
            />
            <Button
                type="contained"
                text="Submit a Claim"
                prefix={<Icon name="plus" fill={'white'} />}
                onPress={onSubmit}
                style={{flex: 1, alignItems: 'center', marginLeft: spacing(1)}}
                textStyle={{
                    color: 'white',
                }}
            />
        </View>
    </>
)

const NewClaim = ({templateDid, projectDid}) => {
    const
        ixoCli = getClient(),
        {stateNavigator: nav} = useContext(NavigationContext),
        [formShown, toggleForm] = useState(false),
        tplQuery = useQuery({
            queryKey: ['template', templateDid],
            queryFn: () => ixoCli.getTemplate(templateDid),
        }),
        formSpec =
            tplQuery.isSuccess &&
                claimTemplateToFormSpec(tplQuery.data.data.page.content)

    return (
        <MenuLayout>
            <AssistantLayout>
                <View style={newClaimStyle.root}>
                    <Text
                        children="Submit a Claim"
                        style={newClaimStyle.title}
                    />
                    <Loadable
                        loading={tplQuery.isLoading}
                        error={tplQuery.error}
                        data={formSpec}
                        render={formSpec => {
                            return (
                                <ClaimStepsView
                                    steps={formSpec}
                                    onBack={() => nav.navigateBack(1)}
                                    onSubmit={() => toggleForm(true)}
                                />
                            )
                        }}
                    />

                    <Modal
                        visible={formShown}
                        onRequestClose={() => toggleForm(false)}
                        children={
                            <ClaimForm
                                formSpec={formSpec}
                                projectDid={projectDid}
                                templateDid={templateDid}
                                onClose={() => toggleForm(false)}
                            />
                        }
                    />
                </View>
            </AssistantLayout>
        </MenuLayout>
    )
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    formStepItemTitle: {
        fontWeight: '400',
        fontSize: fontSizes.body,
        color: 'black',
        marginLeft: spacing(1),
    },
    btnContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: spacing(2),
    },
})

const ClaimForm = ({formSpec, projectDid, templateDid, onClose = noop}) => {
    const
        ixoCli = getClient(),
        [formState, setFormState] = useState({}),
        [isComplete, toggleComplete] = useState(false),
        [currentStepIdx, setCurrentStep] = useState(0),
        submitQuery = useQuery({
            enabled: false,
            queryKey: 'createClaim',
            onSettled: () => toggleComplete(true),
            queryFn: async () => {
                const formSpecById = keyBy(formSpec, 'id'),
                    formEntries = await Promise.all(
                        entries(formState).map(async ([id, value]) => {
                            if (!value.uri) return [id, value]

                            const dataURL = await fileToDataURL(
                                value.uri,
                                value.type,
                            )

                            debug(
                                'Uploading file',
                                value.type,
                                (dataURL.length / 1048576).toFixed(2) + 'MB',
                                value.uri,
                            )

                            const remoteURL = await ixoCli.createEntityFile(
                                projectDid,
                                dataURL,
                            )

                            return [id, remoteURL]
                        }),
                    ),
                    claimItems = formEntries.map(([id, value]) => ({
                        id,
                        value,
                        attribute: formSpecById[id].attribute,
                    })),
                    claimTxHash = await ixoCli.createClaim(
                        projectDid,
                        templateDid,
                        claimItems,
                    ),
                    projectClaims = await pollFor({
                        query: () => ixoCli.listClaims(projectDid),
                        predicate: (claims) =>
                            claims.find((c) => c.txHash === claimTxHash),
                    }),
                    claimRec = projectClaims.find(
                        (c) => c.txHash === claimTxHash,
                    )

                return claimRec
            },
        })

    return (
        <View style={{flex: 1}}>
            <Header>
                <Pressable onPress={onClose}>
                    <Icon name="close" width={24} fill="white" />
                </Pressable>
                <Text style={claimFormStyle.title} children="New Claim" />
                <View style={{width: 24}} />
            </Header>

            {submitQuery.isFetching && (
                <ActivityIndicator
                    color="#555555"
                    size="large"
                    style={claimFormStyle.activityIndicator}
                />
            )}

            {isComplete ? (
                <NewClaimResult
                    type={
                        {error: 'danger', success: 'success'}[
                            submitQuery.status
                        ]
                    }
                    onEdit={() => toggleComplete(false)}
                    onNew={() => {
                        setFormState({})
                        setCurrentStep(0)
                        toggleComplete(false)
                    }}
                />
            ) : currentStepIdx === formSpec.length ? (
                <ClaimFormSummary
                    formSpec={formSpec}
                    formState={formState}
                    onFocusItem={setCurrentStep}
                    onApprove={() => submitQuery.refetch()}
                />
            ) : (
                <ClaimFormSteps
                    value={formState}
                    onChange={setFormState}
                    currentStep={formSpec[currentStepIdx]}
                    currentStepIdx={currentStepIdx}
                    totalSteps={formSpec.length}
                    onPrev={() => setCurrentStep((s) => s - 1)}
                    onNext={() => setCurrentStep((s) => s + 1)}
                />
            )}
        </View>
    )
}

const claimFormStyle = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: fontSizes.h5,
    },
    activityIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        top: '48%',
        zIndex: 1,
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

    return (
        <Pressable style={{flex: 1}} onPress={Keyboard.dismiss}>
            <StepForm
                current={currentStepIdx}
                total={totalSteps}
                onNext={() => {
                    if (currentStepIdx > totalSteps) {
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
                <View>
                    <View style={formStyles.stepTextContainer}>
                        <Text children="QUESTION" style={formStyles.stepText} />
                        <Text
                            children={' ' + (currentStepIdx + 1)}
                            style={formStyles.currStepText}
                        />
                        <Text
                            children={'/' + totalSteps}
                            style={formStyles.stepText}
                        />
                    </View>

                    <Text
                        style={formStyles.title}
                        children={currentStep.title}
                    />

                    <Text
                        style={formStyles.description}
                        children={currentStep.description}
                    />

                    {createElement(currentStep.comp, {
                        value: value[currentStep.id],

                        onChange: (val) =>
                            onChange((fs) => ({...fs, [currentStep.id]: val})),

                        ...currentStep.props,
                    })}

                    {formError === 'required' && (
                        <Text
                            children="Field is required"
                            style={{color: 'red'}}
                        />
                    )}
                </View>
            </StepForm>
        </Pressable>
    )
}

const formStyles = StyleSheet.create({
    stepText: {
        color: '#A5ADB0',
        fontSize: 10,
        fontWeight: '400',
    },
    currStepText: {
        color: '#00D2FF',
        fontSize: 10,
        fontWeight: '700',
    },
    stepTextContainer: {
        flexDirection: 'row',
        marginBottom: spacing(1),
    },
    title: {
        fontSize: fontSizes.h5,
        color: '#333333',
        fontWeight: 'bold',
        marginBottom: spacing(2),
    },
    description: {
        color: '#333333',
        fontSize: fontSizes.p1,
        marginBottom: spacing(2),
    },
})

const nonTextSteps = [Select, ImageInput, AudioInput, VideoInput, DocumentInput]
const renderClaimStepSummary = (id, props, formState, comp) => {
    if (nonTextSteps.includes(comp)) {
        return createElement(comp, {
            ...props,
            value: formState[id],
            editable: false,
        })
    }

    return (
        <Text
            style={sumStyle.itemBoxText}
            children={
                typeof formState[id] !== 'string'
                    ? JSON.stringify(formState[id], null, 4)
                    : formState[id]
            }
        />
    )
}

const ClaimFormSummary = ({
    formSpec,
    formState,
    editable = true,
    onFocusItem,
    onApprove,
}) => (
    <ScrollView style={sumStyle.root}>
        <Text children="Claim Summary" style={sumStyle.header} />

        {formSpec.map(({id, title, comp, props}, itemIdx) => (
            <View key={id} style={sumStyle.itemBoxContainer}>
                <ClaimFormSummaryVerticalProgressIndicator
                    formSpec={formSpec}
                    itemIdx={itemIdx}
                />

                <View style={sumStyle.itemBox}>
                    <Text children={title} style={sumStyle.itemBoxTitle} />

                    {renderClaimStepSummary(id, props, formState, comp)}

                    {editable && (
                        <Pressable
                            onPress={() => onFocusItem(itemIdx)}
                            children={
                                <Icon name="edit" width={20} fill="#bbb" />
                            }
                            style={sumStyle.itemBoxEditBtn}
                        />
                    )}
                </View>
            </View>
        ))}

        {editable && (
            <ButtonGroup
                items={[
                    {
                        //     type: 'outlined',
                        //     text: 'Save',
                        //     onPress: () => alert('Not Implemented Yet'),
                        // }, {
                        type: 'contained',
                        text: 'Submit a claim',
                        onPress: onApprove,
                    },
                ]}
            />
        )}

        <View style={{height: 50}} />
        {/* In Android some space from the bottom is needed or else the buttons
            above don't show up. Obviously this is an ugly hack waiting for a
            proper fix */}
    </ScrollView>
)

const ClaimFormSummaryVerticalProgressIndicator = ({formSpec, itemIdx}) => (
    <>
        <View
            style={{
                width: 11,
                borderRightWidth: 2,
                borderColor:
                    itemIdx === formSpec.length - 1 ? 'transparent' : '#007994',
            }}
        />
        <View
            style={{
                position: 'relative',
                left: -10,
                top: itemIdx === formSpec.length - 1 || itemIdx === 0 ? 0 : 20,
                width: 18,
                height: 18,
                borderWidth: 2,
                borderRadius: 9,
                borderColor: '#007994',
                backgroundColor: 'white',
                justifyContent: 'center',
            }}
        >
            <View
                style={{
                    width: 9,
                    height: 9,
                    backgroundColor: '#007994',
                    borderRadius: 4,
                    alignSelf: 'center',
                }}
            />
        </View>
    </>
)

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
        width: 200 /* TODO: Hack: If we don't have this, the box overgrows for some reason */, // eslint-disable-line max-len
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

NewClaim.ClaimFormSummary = ClaimFormSummary
NewClaim.claimTemplateToFormSpec = claimTemplateToFormSpec

module.exports = NewClaim

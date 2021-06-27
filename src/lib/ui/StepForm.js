const React = require('react'),
    {Fragment, useMemo} = React,
    {View, Text, StyleSheet} = require('react-native'),
    {Icon, Button} = require('$/lib/ui'),
    {spacing} = require('$/theme')

const StepForm = ({children, current, total, onNext, onPrev}) => {
    return (
        <View style={stepFormStyles.root}>
            <View style={stepFormStyles.headerBg} />
            <StepInfo current={current} total={total} />
            <View style={stepFormStyles.contentSpacing}>
                <View style={stepFormStyles.content}>{children}</View>
                <View style={stepFormStyles.navBottom}>
                    <Button
                        onPress={onPrev}
                        type="outlined"
                        text="Previous"
                        style={stepFormStyles.navBtn}
                    />
                    <Button
                        onPress={onNext}
                        type="contained"
                        text="Next"
                        suffix={<Icon name="chevronRight" fill="white" />}
                        style={stepFormStyles.navBtn}
                        textStyle={{color: 'white'}}
                    />
                </View>
            </View>
        </View>
    )
}

const stepFormStyles = StyleSheet.create({
    root: {flex: 1, backgroundColor: '#F0F3F9'},
    headerBg: {
        backgroundColor: '#013851',
        height: 100,
        position: 'absolute',
        width: '100%',
    },
    contentSpacing: {paddingHorizontal: spacing(3)},
    content: {
        backgroundColor: 'white',
        padding: spacing(3),
        borderRadius: 8,
        height: '80%',
    },
    navBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing(2),
    },
    navBtn: {width: '40%', alignItems: 'center'},
})

const getStepStatus = (i, current) => {
    if (i < current) {
        return 'done'
    }

    if (i === current) {
        return 'active'
    }

    if (i > current) {
        return 'passive'
    }
}

const MAX_STEP_COUNT = 10

const StepInfo = ({current, total}) => {
    const steps = useMemo(() => {
        const steps = Array.from(Array(total).keys())

        if (steps.length <= MAX_STEP_COUNT) {
            return steps
        }

        if (total - current <= MAX_STEP_COUNT) {
            return steps.slice(
                steps.length - (MAX_STEP_COUNT + 1),
                steps.length,
            )
        }

        return steps.slice(Math.max(current - 1, 0), MAX_STEP_COUNT + current)
    }, [current, total])
    return (
        <View style={stepInfoStyle.root}>
            {steps.map((i, k) => {
                const notFirst = i !== 0 && k !== 0
                const status = getStepStatus(i, current)
                const s = stepItemStyle(status)
                return (
                    <Fragment key={i}>
                        {notFirst && (
                            <View key={'divider-' + i} style={s.divider} />
                        )}
                        <View key={'step-' + i} style={s.container}>
                            {i < current && (
                                <Icon
                                    name="check"
                                    width={15}
                                    height={15}
                                    fill="#FFFFFF"
                                />
                            )}
                            {i >= current && (
                                <Text style={s.text} children={i + 1} />
                            )}
                        </View>
                    </Fragment>
                )
            })}
        </View>
    )
}

const stepInfoStyle = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing(3),
    },
})

const stepItemStyle = (status) =>
    StyleSheet.create({
        container: {
            backgroundColor: status === 'passive' ? '#034A6A' : '#007A94',
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            width: status === 'active' ? 30 : 25,
            height: status === 'active' ? 30 : 25,
        },
        text: {
            color: status === 'passive' ? '#53A8C5' : 'white',
            fontSize: status === 'active' ? 12 : 10,
            fontWeight: status === 'active' ? 'bold' : undefined,
        },
        divider: {
            backgroundColor: status === 'passive' ? '#034A6A' : '#007A94',
            height: 2,
            width: 10,
        },
    })

module.exports = StepForm

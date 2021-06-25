const React = require('react'),
    {View, Text, StyleSheet, Dimensions} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    Button = require('$/lib/ui/Button'),
    Icon = require('$/lib/ui/Icon')

const states = {
    pending: {
        status: 'PENDING',
        info: 'Your transaction has been submittted',
        color: 'white',
    },
    success: {
        status: 'SUCCESS',
        info: 'Your transaction was successful!',
        color: '#85AD5C',
    },
    error: {
        status: 'ERROR',
        info: 'Something went wrong! Please try again later',
        color: '#E2223B',
    },
}

const {width: windowWidth} = Dimensions.get('window')

const TransactionResult = ({status = 'pending', onView}) => {
    const state = states[status] || states.pending
    return (
        <View style={styles.root}>
            <Icon
                name="assistant"
                width={windowWidth / 3}
                height={windowWidth / 3}
                fill={state.color}
            />
            <Text style={styles.statusText} children={state.status} />
            <Text style={styles.infoText} children={state.info} />

            {status === 'success' && (
                <Button type="outlined" style={styles.viewBtn} onPress={onView}>
                    <Icon name="eye" fill="#39C3E6" />
                </Button>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#002233',
        paddingTop: spacing(6),
    },
    statusText: {
        fontSize: fontSizes.p1,
        color: '#5A879D',
        marginTop: spacing(6),
    },
    infoText: {
        fontSize: fontSizes.h5,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing(8),
    },
    viewBtn: {
        paddingHorizontal: spacing(4),
        borderRadius: 24,
        alignSelf: 'center',
    },
})

module.exports = TransactionResult

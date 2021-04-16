const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    Button = require('$/lib/ui/Button'),
    Divider = require('$/lib/ui/Divider')

const TransactionRequest = ({onSign, onReject}) => {
    return <View style={styles.root}>
        <View>
            <View style={styles.textContainer}>
                <Text
                    style={styles.actionTitle} 
                    children='SEND TRANSACTION'
                />
                <Text
                    style={styles.projectTitle}
                    children='Tongo Water Project'
                />
            </View>
            <Divider/>
            <View style={styles.textContainer}>
                <TransactionInfo label='Token' value='IXO'/>
                <TransactionInfo label='Amount' value='1200'/>
                <TransactionInfo label='From' value='did:ixo:450fufe23r9029'/>
                <TransactionInfo label='To' value='did:ixo:450fufe23r9029'/>
                <TransactionInfo label='Note' value='some note here...'/>
            </View>
        </View>

        <View style={styles.textContainer}>
            <Text 
                style={styles.confirmText} 
                children='Confirm that you want to sign this transaction'
            />
            <Button
                type='contained'
                text='SIGN'
                style={styles.btn}
                onPress={onSign}
            />
            <Button
                type='outlined'
                text='REJECT'
                style={styles.btn}
                onPress={onReject}
            />
        </View>
    </View>
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacing(1),
        paddingVertical: spacing(6),
        backgroundColor: '#002233',
    },
    textContainer: {
        paddingHorizontal: spacing(4),
    },
    actionTitle: {
        fontSize: fontSizes.p1, color: '#5A879D',
    },
    projectTitle: {
        fontSize: fontSizes.h5, color: 'white', fontWeight: 'bold',
        marginBottom: spacing(1),
    },
    confirmText: {
        fontSize: fontSizes.p1, color: 'white',
    },
    btn: {alignItems: 'center', marginTop: spacing(2)},
})


//


const TransactionInfo = ({
    label, value,
}) => <View style={infoStyles.root}>
    <Text style={infoStyles.label} children={label + ': '}/>
    <Text style={infoStyles.info} children={value}/>
</View>

const infoStyles = StyleSheet.create({
    root: {flexDirection: 'row', marginTop: spacing(2)},
    label: {fontSize: fontSizes.p1, color: 'white', fontWeight: 'bold'},
    info: {fontSize: fontSizes.p1, color: '#5A879D'},
})


module.exports = TransactionRequest
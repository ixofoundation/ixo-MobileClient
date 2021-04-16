
const React = require('react'),
    {View, Text, StyleSheet} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    Avatar = require('$/lib/ui/Avatar'),
    Header = require('$/lib/ui/Header'),
    Icon = require('$/lib/ui/Icon'),
    HeaderTitle = require('./HeaderTitle'),
    {memoize} = require('lodash')


const statuses = {
    active: {
        color: '#85AD5C',
        text: 'ACTIVE',
    },
}

const StatusBadge = ({status}) => {
    const style = badgeStyles(status)
    const {text} = statuses[status]
    return <View style={style.container}>
        <View style={style.root}>
            <Text 
                style={style.text} 
                children={text}
            />
        </View>
    </View>
}

const badgeStyles = memoize((status) => {
    return StyleSheet.create({
        root: {
            backgroundColor: statuses[status].color,
            borderRadius: 4,
            padding: spacing(.5),
        },
        container: {flexDirection: 'row'},
        text: {
            color: 'white',
            fontSize: fontSizes.p2,
            fontWeight: 'bold',
        },
    })
})


const StakeInfoTitle = ({name, amount, currency}) => {
    return <View style={stakeInfoTitleStyles.root}>
        <Text style={stakeInfoTitleStyles.name} children={name}/>
        <Text 
            style={stakeInfoTitleStyles.amount} 
            children={amount + ' ' + currency}
        />
    </View>
}

const stakeInfoTitleStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        color: 'white',
        fontSize: fontSizes.p1,
        fontWeight: 'bold',
    },
    amount: {
        color: 'white',
        fontSize: fontSizes.p1,

    },
})


const StakeInfo = ({label, info}) => {
    return <View style={stakeInfoStyles.root}>
        <Text style={stakeInfoStyles.label} children={label}/>
        <Text style={stakeInfoStyles.info} children={info}/>
    </View>
}

const stakeInfoStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing(1),
    },
    label: {
        color: '#5A879D',
        fontSize: fontSizes.p2,
    },
    info: {
        color: '#5A879D',
        fontSize: fontSizes.p2,
    },
})


const RelayerInfo = ({label, info, icon}) => {
    return <View style={relayerInfoStyles.root}>
        <Text style={relayerInfoStyles.label} children={label}/>
        <View style={relayerInfoStyles.container}>
            <Text style={relayerInfoStyles.info} children={info}/>
            {icon && <View style={relayerInfoStyles.spacing}/>}
            {icon}
        </View>
    </View>
}

const relayerInfoStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    spacing: {
        width: spacing(2),
    },
    label: {
        color: 'white',
        fontSize: fontSizes.p2,
    },
    info: {
        color: '#5A879D',
        fontSize: fontSizes.p2,
    },
})

const RelayerDetail = () => {
    const name = 'stake.zone'
    return <> 
        <Header style={styles.header}>
            <Icon name='chevronLeft' fill='white'/>
            <HeaderTitle text={name}/>
            <View width={24}/>
        </Header>
        <View style={styles.root}>
        
            <View style={styles.headerContainer}>
                <Avatar 
                    uri={'https://picsum.photos/200/300'} 
                    size={8}
                />
                <View style={styles.titleContainer}>
                    <Text style={styles.title} children={name}/>
                    <StatusBadge status='active' />
                </View>
            </View>
            <View style={styles.stakeContainer}>
                <StakeInfoTitle name='My Stake' amount={25000} currency='IXO'/>
                <View style={styles.stakeInfoContainer}>
                    <StakeInfo label='Available' info='5302.002'/>
                    <StakeInfo label='Delegated' info='23,302.002'/>
                    <StakeInfo label='Unbonding' info='0'/>
                    <StakeInfo label='Reward' info='10.32'/>
                </View>
            </View>
            <View style={styles.relayerInfoContainer}>
                <RelayerInfo label='Validator Node Operator' info='ixo.world' />
                <RelayerInfo label='Website' info='ixo.world' 
                    icon={<Icon name='web' fill='#03D0FB'/>}
                />
                <RelayerInfo label='Relayer ID' info='did:ixo:dsdjr0wern0e99' 
                    icon={<Icon name='eye' fill='#03D0FB'/>}
                />
                <RelayerInfo label='Staking Yield (ARR)' info='9.95%'/>
                <RelayerInfo 
                    label='Voting Power / Total Stake' 
                    info='0.02% / 33.535'
                />
                <RelayerInfo 
                    label='Own Stake' 
                    info='3.790 / 11.34%'
                />
            </View>
        </View>
    </>
}    


const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#002233',
        paddingHorizontal: spacing(2),
        paddingVertical: spacing(2),
    },
    header: {justifyContent: 'space-between'},
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing(2),
    },
    titleContainer: {
        marginLeft: spacing(2),
    },
    title: {
        color: 'white',
        fontSize: fontSizes.h4,
        fontWeight: 'bold',
        marginBottom: spacing(1),
    },
    stakeContainer: {
        borderWidth: 1,
        borderColor: '#03D0FB',
        padding: spacing(2),
        backgroundColor: '#002D42',
        marginTop: spacing(4),
    },
    stakeInfoContainer: {
        paddingTop: spacing(2),
        paddingLeft: spacing(2),
    },
    relayerInfoContainer: {
        flex: 1,
        justifyContent: 'space-between',
        borderColor: '#0C3549',
        backgroundColor: '#012639',
        borderWidth: 1,
        padding: spacing(2),
        marginTop: spacing(2),
    },
})

module.exports = RelayerDetail
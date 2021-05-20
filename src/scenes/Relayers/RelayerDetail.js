const React = require('react'),
    {useCallback} = React,
    {View, Text, StyleSheet, Pressable} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    Avatar = require('$/lib/ui/Avatar'),
    Header = require('$/lib/ui/Header'),
    Icon = require('$/lib/ui/Icon'),
    HeaderTitle = require('./HeaderTitle'),
    {memoize} = require('lodash'),
    {useNav, useAsyncData} = require('$/lib/util'),
    {useStaking} = require('$/stores'),
    AssistantLayout = require('$/AssistantLayout'),
    Loadable = require('$/lib/ui/Loadable')

const statuses = {
    active: {
        color: '#85AD5C',
        text: 'ACTIVE',
    },
}

const StatusBadge = ({status}) => {
    const style = badgeStyles(status)
    const {text} = statuses[status]
    return (
        <View style={style.container}>
            <View style={style.root}>
                <Text style={style.text} children={text} />
            </View>
        </View>
    )
}

const badgeStyles = memoize((status) => {
    return StyleSheet.create({
        root: {
            backgroundColor: statuses[status].color,
            borderRadius: 4,
            padding: spacing(0.5),
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
    return (
        <View style={stakeInfoTitleStyles.root}>
            <Text style={stakeInfoTitleStyles.name} children={name} />
            <Text
                style={stakeInfoTitleStyles.amount}
                children={amount + ' ' + currency}
            />
        </View>
    )
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
    return (
        <View style={stakeInfoStyles.root}>
            <Text style={stakeInfoStyles.label} children={label} />
            <Text style={stakeInfoStyles.info} children={info} />
        </View>
    )
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
    return (
        <View style={relayerInfoStyles.root}>
            <Text style={relayerInfoStyles.label} children={label} />
            <View style={relayerInfoStyles.container}>
                <Text style={relayerInfoStyles.info} children={info} />
                {icon && <View style={relayerInfoStyles.spacing} />}
                {icon}
            </View>
        </View>
    )
}

const relayerInfoStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing(2),
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

const statusMap = {2: 'active'}

const formatAddress = (addr) =>
    addr.length > 20 ? addr.slice(0, 20) + '...' : addr

const RelayerDetail = ({relayerAddr}) => {
    const nav = useNav()

    const {getValidatorDetail} = useStaking()
    const loadRelayerDetail = useCallback(
        () => getValidatorDetail(relayerAddr),
        [relayerAddr],
    )
    const {data, error, loading} = useAsyncData(loadRelayerDetail)

    return (
        <AssistantLayout>
            <Header style={styles.header}>
                <Pressable onPress={() => nav.navigateBack(1)}>
                    <Icon name="chevronLeft" fill="#FFFFFE" />
                </Pressable>
                <HeaderTitle
                    text={data && data.validator.description.moniker}
                />
                <View width={24} />
            </Header>
            <View style={styles.root}>
                <Loadable
                    data={data}
                    error={error}
                    loading={loading}
                    render={({
                        validator,
                        pool,
                        delegation,
                        delegations,
                        unboundingDelegations,
                        rewards,
                        availabeStake: {
                            value: {coins: availabeStakeCoins},
                        },
                        avatarUrl,
                    }) => {
                        const {
                            description: {
                                moniker: name,
                                details: description,
                                website,
                            },
                            operator_address,
                            status,
                            tokens,
                        } = validator

                        const votingPower = Number(tokens) / Math.pow(10, 6)
                        const totalStake = Number(pool.bonded_tokens)
                        const ownStake = Number(delegation.shares)
                        const delegated =
                            delegations.reduce(
                                (acc, {balance: {amount}}) =>
                                    acc + Number(amount),
                                0,
                            ) / Math.pow(10, 6)

                        const unbounding =
                            unboundingDelegations.reduce(
                                (acc, {balance}) => acc + Number(balance),
                                0,
                            ) / Math.pow(10, 6)

                        const reward =
                            Number(rewards.total[0].amount) / Math.pow(10, 6)
                        const availabeStakeTotal = availabeStakeCoins.reduce(
                            (acc, {amount}) => acc + Number(amount),
                            0,
                        )
                        return (
                            <>
                                <View style={styles.headerContainer}>
                                    <Avatar uri={avatarUrl} size={8} />
                                    <View style={styles.titleContainer}>
                                        <Text
                                            style={styles.title}
                                            children={name}
                                        />
                                        <StatusBadge
                                            status={statusMap[status]}
                                        />
                                    </View>
                                </View>
                                <View style={styles.stakeContainer}>
                                    <StakeInfoTitle
                                        name="My Stake"
                                        amount={25000}
                                        currency="IXO"
                                    />
                                    <View style={styles.stakeInfoContainer}>
                                        <StakeInfo
                                            label="Available"
                                            info={availabeStakeTotal.toFixed(2)}
                                        />
                                        <StakeInfo
                                            label="Delegated"
                                            info={delegated.toFixed(2)}
                                        />
                                        <StakeInfo
                                            label="Unbonding"
                                            info={unbounding.toFixed(2)}
                                        />
                                        <StakeInfo
                                            label="Reward"
                                            info={reward.toFixed(2)}
                                        />
                                    </View>
                                </View>

                                <View style={styles.relayerInfoContainer}>
                                    <RelayerInfo
                                        label="Validator Operator Node"
                                        info={'ixo.world'}
                                    />

                                    <RelayerInfo
                                        label="Description"
                                        info={description}
                                    />

                                    <RelayerInfo
                                        label="Website"
                                        info={website}
                                        icon={
                                            <Icon name="web" fill="#03D0FB" />
                                        }
                                    />
                                    <RelayerInfo
                                        label="Relayer ID"
                                        info={formatAddress(operator_address)}
                                        icon={
                                            <Pressable
                                                onPress={() =>
                                                    console.log(
                                                        'copy to clipboard',
                                                        operator_address,
                                                    )
                                                }
                                            >
                                                <Icon
                                                    name="eye"
                                                    fill="#03D0FB"
                                                />
                                            </Pressable>
                                        }
                                    />
                                    <RelayerInfo
                                        label="Staking Yield (ARR)"
                                        info="0.02%"
                                    />
                                    <RelayerInfo
                                        label="Voting Power / Total Stake"
                                        info={`${votingPower.toFixed(
                                            2,
                                        )}% / ${totalStake}`}
                                    />
                                    <RelayerInfo
                                        label="Own Stake"
                                        info={`${ownStake.toFixed(2)} / ${(
                                            (ownStake / totalStake) *
                                            100
                                        ).toFixed(2)}%`}
                                    />
                                </View>
                            </>
                        )
                    }}
                />
            </View>
        </AssistantLayout>
    )
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

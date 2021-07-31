const
    React = require('react'),
    {useCallback} = React,
    {View, Text, Pressable, Linking, Alert} = require('react-native'),
    Clipboard = require('@react-native-clipboard/clipboard').default,
    {useQuery} = require('react-query'),
    {memoize} = require('lodash'),
    {spacing, fontSizes} = require('$/theme'),
    {getClient} = require('$/ixoCli'),
    AssistantLayout = require('$/AssistantLayout'),
    {Avatar, Icon, Loadable} = require('$/lib/ui'),
    {validatorAvatarUrl} = require('$/lib/util')


const StatusBadge = ({statusCode}) =>
    <View style={badgeStyles.container}>
        <View style={badgeStyles.root(statusCode)}>
            <Text
                children={
                    ['UNSPECIFIED', 'UNBONDED', 'UNBONDING', 'ACTIVE']
                        [statusCode]
                }
                style={badgeStyles.text}
            />
        </View>
    </View>

const badgeStyles = {
    root: memoize(statusCode => ({
        borderRadius: 4,
        padding: spacing(0.5),
        backgroundColor:
            ['#AD245C', '#AD245C', '#ED9526', '#85AD5C'][statusCode],
    })),
    container: {flexDirection: 'row'},
    text: {
        color: 'white',
        fontSize: fontSizes.p2,
        fontWeight: 'bold',
    },
}

const StakeInfoTitle = ({name, amount, currency}) =>
    <View style={stakeInfoTitleStyles.root}>
        <Text
            children={name}
            style={stakeInfoTitleStyles.name}
        />

        <Text
            children={amount + ' ' + currency}
            style={stakeInfoTitleStyles.amount}
        />
    </View>

const stakeInfoTitleStyles = {
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
}

const StakeInfo = ({label, info}) => {
    return (
        <View style={stakeInfoStyles.root}>
            <Text style={stakeInfoStyles.label} children={label} />
            <Text style={stakeInfoStyles.info} children={info} />
        </View>
    )
}

const stakeInfoStyles = {
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
}

const RelayerInfo = ({label, info, icon}) =>
    <View style={relayerInfoStyles.root}>
        <Text style={relayerInfoStyles.label} children={label} />
        <View style={relayerInfoStyles.container}>
            <Text style={relayerInfoStyles.info} children={info} />
            {icon && <View style={relayerInfoStyles.spacing} />}
            {icon}
        </View>
    </View>

const relayerInfoStyles = {
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
}

const formatAddress = (addr) =>
    addr.length > 20 ? addr.slice(0, 20) + '...' : addr

const RelayerDetail = ({relayerAddr}) => {
    const validatorQuery = useQuery({
        queryKey: ['validator-mixed'],
        queryFn: () => getValidatorDetail(relayerAddr),
    })

    return (
        <AssistantLayout>
            <View style={styles.root}>
                <Loadable
                    data={validatorQuery.data}
                    error={validatorQuery.error}
                    loading={validatorQuery.isLoading}
                    render={({
                        validator,
                        pool,
                        delegation,
                        delegations,
                        unbondingDelegations,
                        rewards,
                        balances,
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

                        const unbonding =
                            unbondingDelegations.reduce(
                                (acc, {balance}) => acc + Number(balance),
                                0,
                            ) / Math.pow(10, 6)

                        const reward =
                            Number(rewards.total[0].amount) / Math.pow(10, 6)
                        const totalBalance = balances.reduce(
                            (acc, {amount}) => acc + Number(amount),
                            0,
                        )

                        const handleWebClick = useCallback(async () => {
                            const supported = await Linking.canOpenURL(website)
                            if (!supported) {
                                return
                            }
                            Linking.openURL(website)
                        }, [website])

                        const handleAddressClick = useCallback(() => {
                            Clipboard.setString(operator_address)
                            Alert.alert(
                                'Operator Address Copied!',
                                operator_address,
                            )
                        }, [operator_address])

                        return (
                            <>
                                <View style={styles.headerContainer}>
                                    <Avatar uri={avatarUrl} size={8} />
                                    <View style={styles.titleContainer}>
                                        <Text
                                            style={styles.title}
                                            children={name}
                                        />
                                        <StatusBadge statusCode={status} />
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
                                            info={totalBalance.toFixed(2)}
                                        />
                                        <StakeInfo
                                            label="Delegated"
                                            info={delegated.toFixed(2)}
                                        />
                                        <StakeInfo
                                            label="Unbonding"
                                            info={unbonding.toFixed(2)}
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
                                            <Pressable onPress={handleWebClick}>
                                                <Icon
                                                    name="web"
                                                    fill="#03D0FB"
                                                />
                                            </Pressable>
                                        }
                                    />
                                    <RelayerInfo
                                        label="Relayer ID"
                                        info={formatAddress(operator_address)}
                                        icon={
                                            <Pressable
                                                onPress={handleAddressClick}
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

const getValidatorDetail = async addr => {
    const
        ixoCli = getClient(),

        {result: dist} = await ixoCli.staking.validatorDistribution(addr),

        [
            {balances},
            {result: validator},
            {result: pool},
            {result: delegation},
            {result: rewards},
            {result: delegations},
            {result: unbondingDelegations},
        ] =
            await Promise.all([
                ixoCli.balances('secp'),
                ixoCli.staking.getValidator(addr),
                ixoCli.staking.pool(),
                ixoCli.staking.delegation(dist.operator_address, addr),
                ixoCli.staking.delegatorRewards(dist.operator_address),
                ixoCli.staking.delegatorDelegations(dist.operator_address),
                ixoCli.staking.delegatorUnbondingDelegations(
                    dist.operator_address),
            ]),

        avatarUrl = await validatorAvatarUrl(validator.description.identity)

    return {
        validator, pool, delegation, rewards, delegations, unbondingDelegations,
        balances, avatarUrl,
    }
}

const styles = {
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
}

module.exports = RelayerDetail

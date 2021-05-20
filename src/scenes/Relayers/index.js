const React = require('react'),
    {
        View,
        Text,
        StyleSheet,
        TextInput,
        FlatList,
        Pressable,
    } = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    Avatar = require('$/lib/ui/Avatar'),
    Header = require('$/lib/ui/Header'),
    RadioButton = require('$/lib/ui/RadioButton'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    Icon = require('$/lib/ui/Icon'),
    {useNav} = require('$/lib/util'),
    {useStaking} = require('$/stores'),
    {useEffect, useState} = require('react')
const HeaderTitle = require('./HeaderTitle')

const RelayerItem = ({id, name, avatar, commission, onPress}) => {
    return (
        <Pressable style={itemStyles.root} onPress={onPress}>
            <View style={itemStyles.nameContainer}>
                <Text style={itemStyles.id} children={id} />
                <Avatar uri={avatar} size={5} />
                <Text style={itemStyles.name} children={name} />
            </View>
            <Text
                style={itemStyles.commission}
                children={commission.toFixed(2) + '%'}
            />
        </Pressable>
    )
}

const itemStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#002D42',
        borderRadius: 4,
        marginTop: spacing(2),
        padding: spacing(2),
        alignItems: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: fontSizes.p1,
        marginLeft: spacing(2),
    },
    commission: {
        color: '#5A879D',
        fontWeight: 'bold',
        fontSize: fontSizes.p1,
    },
    id: {
        color: '#5A879D',
        fontWeight: 'bold',
        fontSize: fontSizes.p1,
        marginRight: spacing(2),
    },
})

const statusFilterOptions = [
    {label: 'All', value: 'all'},
    {label: 'Open', value: 'open'},
]

const Relayers = () => {
    const {validators, listValidators} = useStaking()
    const [search, setSearch] = useState('')
    const nav = useNav()
    const [activityFilter, setActivityFilter] = useState(statusFilterOptions[0])

    useEffect(() => {
        listValidators().catch(console.error)
    }, [])

    const data = Object.entries(validators)
        .map(([id, v]) => ({...v, id}))
        .filter(({description: {moniker}}) =>
            moniker.toLowerCase().startsWith(search.toLowerCase().trim()),
        )

    return (
        <MenuLayout>
            <AssistantLayout>
                <View style={styles.root}>
                    <Header style={styles.header}>
                        <Pressable onPress={() => nav.navigateBack(1)}>
                            <Icon name="chevronLeft" fill="#FFFFFE" />
                        </Pressable>
                        <View
                            style={{flexDirection: 'row', alignItems: 'center'}}
                        >
                            <Icon name="explore" fill="#FFFFFE" />
                            <HeaderTitle text="impact relayers" />
                        </View>
                        <View width={24} />
                    </Header>

                    <View style={styles.listContainer}>
                        <View style={styles.filterContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search..."
                                placeholderTextColor="#5A879D"
                                value={search}
                                onChangeText={setSearch}
                            />
                            <RadioButton
                                value={activityFilter}
                                onChange={setActivityFilter}
                                options={statusFilterOptions}
                            />
                        </View>

                        <View style={styles.listHeader}>
                            <Text
                                style={styles.listHeaderText}
                                children="# Name"
                            />
                            <Text
                                style={styles.listHeaderText}
                                children="Commission"
                            />
                        </View>

                        <FlatList
                            data={data}
                            renderItem={({
                                item: {
                                    id,
                                    operator_address,
                                    description: {moniker},
                                    commission: {
                                        commission_rates: {rate},
                                    },
                                },
                            }) => {
                                return (
                                    <RelayerItem
                                        id={Number(id) + 1}
                                        name={moniker}
                                        commission={Number(rate)}
                                        avatar={'https://picsum.photos/200/300'}
                                        onPress={() =>
                                            nav.navigate('relayer-detail', {
                                                relayerAddr: operator_address,
                                            })
                                        }
                                    />
                                )
                            }}
                        />
                    </View>
                </View>
            </AssistantLayout>
        </MenuLayout>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#002233',
    },
    header: {justifyContent: 'space-between'},
    listContainer: {
        flex: 1,
        paddingHorizontal: spacing(2),
    },
    filterContainer: {
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        marginRight: spacing(2),
        borderWidth: 1,
        borderColor: '#5A879D',
        borderRadius: 4,
        color: '#5A879D',
        padding: spacing(1),
        paddingHorizontal: spacing(2),
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listHeaderText: {
        marginTop: spacing(2),
        color: '#5A879D',
        fontSize: fontSizes.p2,
    },
})

module.exports = Relayers

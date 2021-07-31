const
    React = require('react'),
    {useState} = require('react'),
    {View, Text, TextInput, FlatList, Pressable} = require('react-native'),
    {useQuery} = require('react-query'),
    {getClient} = require('$/ixoCli'),
    {spacing, fontSizes} = require('$/theme'),
    {Header, RadioButton, Icon} = require('$/lib/ui'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    {useNav} = require('$/lib/util'),
    HeaderTitle = require('./HeaderTitle'),
    {entries} = Object


const RelayerItem = ({id, name, commission, onPress}) =>
    <Pressable style={itemStyles.root} onPress={onPress}>
        <View style={itemStyles.nameContainer}>
            <Text children={id} style={itemStyles.id} />
            <Text children={name} style={itemStyles.name} />
        </View>

        <Text
            children={commission.toFixed(2) + '%'}
            style={itemStyles.commission}
        />
    </Pressable>

const itemStyles = {
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
}

const statusFilterOptions = [
    {label: 'All', value: 'all'},
    {label: 'Open', value: 2},
]

const Relayers = () => {
    const
        ixoCli = getClient(),
        nav = useNav(),
        [search, setSearch] = useState(''),
        [activityFilter, setActivityFilter] = useState(statusFilterOptions[0]),

        validatorsQuery = useQuery({
            queryKey: ['validators'],
            queryFn: () => ixoCli.staking.listValidators(),
            initialData: {result: []},
        }),

        data = entries(validatorsQuery.data.result)
            .map(([id, v]) => ({...v, id}))

            .filter(({description: {moniker}, status}) => {
                if (
                    activityFilter.value !== 'all' &&
                    status !== activityFilter.value
                )
                    return false

                return (
                    moniker
                        .toLowerCase()
                        .startsWith(search.toLowerCase().trim())
                )
            })

    return (
        <MenuLayout>
            <AssistantLayout>
                <View style={styles.root}>
                    <Header>
                        <View style={styles.title}>
                            <Icon name="explore" fill="#FFFFFF" />
                            <HeaderTitle text="Impact Relayers" />
                        </View>
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

const styles = {
    root: {
        flex: 1,
        backgroundColor: '#002233',
    },
    title: {flexDirection: 'row', alignItems: 'center'},
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
}


module.exports = Relayers

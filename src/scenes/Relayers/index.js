const React = require('react'),
    {View, Text, StyleSheet, 
        TextInput, FlatList, Pressable} = require('react-native'),
    {spacing, fontSizes} = require('$/theme'),
    Avatar = require('$/lib/ui/Avatar'),
    ButtonGroup = require('$/lib/ui/ButtonGroup'),
    Header = require('$/lib/ui/Header'),
    Icon = require('$/lib/ui/Icon')
const HeaderTitle = require('./HeaderTitle')


const RelayerItem = ({
    id, name, avatar, commission,
    onPress,
}) => {
    return <Pressable 
        style={itemStyles.root}
        onPress={onPress}
    >
        <View style={itemStyles.nameContainer}>
            <Text style={itemStyles.id} children={id}/>
            <Avatar uri={avatar} size={5}/>
            <Text style={itemStyles.name} children={name}/>
        </View>
        <Text 
            style={itemStyles.commission} 
            children={commission.toFixed(2) + '%'}
        />
    </Pressable>
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

const data = [
    {
        id: 1,
        name: 'stake.zone',
        commission: 0.7,
        avatar: 'https://picsum.photos/200/300',
    },
    {
        id: 2, 
        name: 'IZO',
        commission: 0.85,
        avatar: 'https://picsum.photos/200/300',
    },
]

const Relayers = () => {
    return <View style={styles.root}>
        <Header style={styles.header}>
            <Icon name='chevronLeft' fill='white'/>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name='explore' fill='white'/>
                <HeaderTitle text='impact relayers'/>
            </View>
            <View width={24}/>
        </Header>

        <View style={styles.listContainer}>
            <View style={styles.filterContainer}>
                <TextInput 
                    style={styles.searchInput}
                    placeholder='Search...'
                    placeholderTextColor='#5A879D'
                />
                <ButtonGroup 
                    type='contained'
                    color='secondary'
                    items={[{text: 'All'}, {text: 'Active'}]}
                />
            </View>

            <View style={styles.listHeader}>
                <Text style={styles.listHeaderText} children='# Name'/>
                <Text style={styles.listHeaderText} children='Commission'/>
            </View>

            <FlatList 
                data={data} 
                renderItem={({
                    item: {name, commission, avatar, id}, 
                }) => {
                    return <RelayerItem 
                        id={id}
                        name={name}
                        commission={commission}
                        avatar={avatar}
                        onPress={() => 
                            console.log('redirect to relayer detail scene')
                        }
                    />
                }}
            />

        </View>


        
    </View>
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
const
    url = require('url'),
    React = require('react'),
    {useState} = React,
    {TouchableOpacity, ScrollView, 
        View, Image, Alert, Linking, StyleSheet, Text, Pressable}
        = require('react-native'),
    {sortBy, filter} = require('lodash-es'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/assistant/AssistantLayout'),
    {useProjects} = require('$/stores'),
    {Modal, Button, QRScanner, EntityFilter} = require('$/lib/ui'),
    theme = require('$/lib/theme'),
    {entries} = Object,
    DotsVerticalIcon = require('$/lib/icons/dotsVertical.svg').default,
    WebIcon = require('$/lib/icons/web.svg').default,
    LinkOffIcon = require('$/lib/icons/linkOff.svg').default,
    BellOffIcon = require('$/lib/icons/bellOff.svg').default,
    MenuIcon = require('$/lib/icons/menu.svg').default,
    MainMenuIcon = require('$/lib/icons/mainMenu.svg').default,
    AutorenewIcon = require('$/lib/icons/autorenew.svg').default,
    FilterIcon = require('$/lib/icons/filter.svg').default


const filterSpec = [{
    type: 'option',
    id: 'sortBy',
    title: 'Sort by',
    opts: [{
        value: 'data.startDate',
        title: 'Recently Added',
    }, {
        value: 'data.claimStats.currentSuccessful',
        title: 'Most Active',
    }, {
        value: 'data.name',
        title: 'Name',
    }],
}, {
    type: 'option',
    id: 'stage',
    multiple: true,
    opts: [
        'Proposal', 'Planning', 'Delivery', 'Closing',
        'Ended',
    ],
}, {
    type: 'dateRange',
    id: 'dateRange',
    title: 'Date',
}]


const Projects = () => {
    const
        ps = useProjects(),
        [scannerShown, toggleScanner] = useState(false),
        [filterShown, toggleFilter] = useState(false),
        [filters, setFilters] = useState({}),
        [focusedProjDid, setFocusedProj] = useState(),
        focusedProj = ps.items[focusedProjDid] || {data: {}},
        projectURL = getProjectURL(focusedProjDid),

        projFilter = p => {
            if (filters.stage && !filters.stage.includes(p.data.stage))
                return false

            return !filters.dateRange
                ? true
                : (
                    p.data.startDate >= filters.dateRange[0]
                    && p.data.endDate <= filters.dateRange[1]
                )
        },

        projects = sortBy(filter(ps.items, projFilter), filters.sortBy)

    const handleScan = async ({data}) => {
        toggleScanner(false)

        const projDid = url.parse(data).path.split('/')[2]

        if (ps.items[projDid])
            return alert('Project already exists!')

        try {
            await ps.connect(projDid)
        } catch (e) {
            alert('Couldn\'t connect to project, please try again later!') // eslint-disable-line max-len
        }
    }

    return <MenuLayout><AssistantLayout>
        <View style={style.root}>
            <View style={{
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: theme.spacing(1),
            }}>
                <MainMenuIcon fill='white'/>
                <View style={{
                    backgroundColor: '#A11C43', 
                    borderRadius: 16, 
                    flexDirection: 'row', 
                    alignItems: 'center',
                }}>
                    <Text style={{
                        color: 'white', 
                        marginHorizontal: theme.spacing(1), 
                        fontSize: theme.fontSizes.h6,
                    }}>
                            5
                    </Text>
                    <AutorenewIcon fill='white' />
                </View>
            </View>

            <View style={{
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: theme.spacing(1),
            }}>
                <Text 
                    style={{
                        color: 'white', 
                        fontSize: theme.fontSizes.h3,
                    }} 
                    children={'Projects'}/>

                <Button 
                    text='Filter'
                    type='outlined'
                    prefix={<FilterIcon fill='#83D9F2'/>}
                    style={{borderRadius: 24}}
                    onPress={() => toggleFilter(true)}
                />
            </View>

            <ScrollView style={{flex: 1}}>
                {entries(projects).map(([projDid, proj]) =>
                    <TouchableOpacity
                        key={projDid}
                        onPress={() =>  setFocusedProj(projDid)}
                    >
                        <Project
                            name={proj.data.name}
                            logoUrl={proj.data.logo}
                            imageUrl={proj.data.image}
                        />
                    </TouchableOpacity>,
                )}
            </ScrollView>

            <Button
                onPress={() => toggleScanner(true)}
                color='primary'
                type='contained'
                size='lg'
                text='Connect to a project'
                style={{margin: theme.spacing(1)}}
            />

            <Modal
                visible={filterShown}
                onRequestClose={() => toggleFilter(false)}
                children={
                    <EntityFilter
                        spec={filterSpec}
                        onCancel={() => toggleFilter(false)}
                        onChange={filters => {
                            setFilters(filters)
                            toggleFilter(false)
                        }}
                        initialValue={filters}
                    />
                }
            />

            <Modal
                visible={scannerShown}
                onRequestClose={() => toggleScanner(false)}
            >
                <QRScanner
                    text='Scan project QR code'
                    onScan={handleScan}
                />
            </Modal>

            <Modal
                visible={!!focusedProjDid}
                onRequestClose={() => setFocusedProj(null)}
                transparent
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 34, 51, 0.9)',
                    justifyContent: 'center',
                    padding: theme.spacing(3),
                }}>
                    <View style={{
                        padding: theme.spacing(1.5),
                        marginBottom: theme.spacing(3),
                    }}>
                        <Image
                            source={{
                                uri: focusedProj.data.image && 
                                    dashedHostname(focusedProj.data.image),
                            }}
                            style={{
                                width: '100%', 
                                height: 150, 
                                marginBottom: theme.spacing(2),
                            }}
                        />

                        <Text children={focusedProj.data.name} 
                            style={{
                                fontWeight: 'bold', 
                                color: 'white', 
                                fontSize: theme.fontSizes.h4,
                                marginBottom: theme.spacing(1),
                            }} />
                        <Text 
                            style={{
                                fontSize: theme.fontSizes.p1, 
                                color: '#83D9F2',
                            }} 
                            children={'Your last claim submitted on 05-05-18'}
                        />

                    </View>
                    
                    <Button
                        text='View Claim Forms'
                        prefix={<MenuIcon fill='white'/>}
                        size='lg'
                        style={{marginBottom: theme.spacing(1)}}
                        color='secondary'
                    />
                    <Button
                        text='Disconnect from this Project'
                        color='secondary'
                        size='lg'
                        prefix={<LinkOffIcon fill='white'/>}
                        style={{marginBottom: theme.spacing(1)}}
                        onPress={() => {
                            Alert.alert('You sure?', '', [{
                                text: 'Yes, delete',
                                onPress: () => {
                                    ps.disconnect(focusedProjDid)
                                    setFocusedProj(null)
                                },
                            }, {
                                text: 'Cancel',
                                style: 'cancel',
                            }])
                        }}
                    />
                    <Button
                        text='Turn off Project Notifications'
                        prefix={<BellOffIcon fill='white'/>}
                        style={{marginBottom: theme.spacing(1)}}
                        color='secondary'
                        size='lg'
                    />

                    <Button
                        text='View the Project Page'
                        style={{marginBottom: theme.spacing(1)}}
                        prefix={<WebIcon fill='white'/>}
                        color='secondary'
                        size='lg'
                        onPress={() => Linking.openURL(projectURL)}
                    /> 
                    
                </View>
                <Button 
                    text='Close' 
                    type='contained' size='lg' 
                    color='secondary' 
                    style={{borderRadius: 0, alignItems: 'center'}}
                    onPress={() => setFocusedProj(null)}
                />
            </Modal>
        </View>
    </AssistantLayout></MenuLayout>
}

const style = StyleSheet.create({
    root: {
        backgroundColor: '#012D42',
        flex: 1,
        paddingHorizontal: theme.spacing(2),
    },
})


const Project = ({name, logoUrl, imageUrl}) =>
    <View style={projectStyle.root}>
        <Image
            source={{uri: dashedHostname(imageUrl)}}
            style={projectStyle.coverImg}
        />

        <View style={projectDetailStyle.root}>
            <View style={projectDetailStyle.headingContainer}>
                <Text children={name} style={projectDetailStyle.heading} />


                <View style={{
                    flexDirection: 'row', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                }}>
                    <Image
                        source={{uri: dashedHostname(logoUrl)}}
                        style={projectDetailStyle.logoImg}
                    />
                    <Pressable 
                        onPress={() => console.log('detail is clicked!')}
                    >
                        <DotsVerticalIcon 
                            height={40} width={40} 
                            fill='#085F7D'
                        />
                    </Pressable>
                </View>
            </View>

            <View style={{flexDirection: 'row'}}>
                <Text 
                    style={{
                        fontSize: theme.fontSizes.h3, 
                        color: '#83D9F2',
                    }} 
                    children={'7'}
                />
                <Text 
                    style={{
                        fontSize: theme.fontSizes.h3, 
                        color: 'white',
                    }} 
                    children={'/100'}
                />
            </View>
            <Text 
                style={{
                    fontSize: theme.fontSizes.h5, 
                    color: 'white',
                }} 
                children={'Some detail sub header under'}
            />
            <View 
                style={{
                    flexDirection: 'row', 
                    width: '100%', 
                    height: 5, 
                    backgroundColor: '#033C50', 
                    borderRadius: 10,
                    marginVertical: theme.spacing(2),
                }}
            >
                <View style={{
                    width: '20%', 
                    backgroundColor: '#04D0FB', 
                    borderTopStartRadius: 10, 
                    borderBottomStartRadius: 10,
                }}/>
                <View style={{
                    width: '30%', 
                    backgroundColor: '#CD1C33',
                    borderTopEndRadius: 10, 
                    borderBottomEndRadius: 10,
                }}/>

                <View style={{
                    flexGrow: 1,
                    backgroundColor: '#033C50',
                    borderTopEndRadius: 10, 
                    borderBottomEndRadius: 10,
                }}/>
            </View>
            <Text 
                style={{
                    fontSize: theme.fontSizes.p1, 
                    color: '#83D9F2',
                }} 
                children={'Your last claim submitted on 05-05-18'}
            />
        </View>
    </View>

const projectStyle = StyleSheet.create({
    root: {
        backgroundColor: '#002D42',
        margin: theme.spacing(1),
        alignItems: 'center',
    },

    coverImg: {width: '100%', height: 150},
})

const projectDetailStyle = StyleSheet.create({
    root: {
        padding: theme.spacing(1),
        borderColor: '#0E536B',
        borderWidth: 1,
        borderTopWidth: 0,
    },

    headingContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    heading: {
        flex: 1, 
        fontWeight: 'bold', 
        color: 'white', 
        fontSize: theme.fontSizes.h4,
    },

    logoImg: {flex: 0, width: 40, height: 40},
})

const dashedHostname = urlStr =>
    urlStr.replace(
        /^(https?:\/\/)([^/]+)(\/.*)/,
        (_, proto, host, path) => proto + host.replace('_', '-') + path,
    )

const getProjectURL = id => `https://app_uat.ixo.world/projects/${id}/overview`

module.exports = Projects

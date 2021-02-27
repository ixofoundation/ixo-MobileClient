const
    url = require('url'),
    React = require('react'),
    {useState} = React,
    {TouchableOpacity, ScrollView, View, Image, Alert, Linking}
        = require('react-native'),
    {sortBy, filter} = require('lodash-es'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/assistant/AssistantLayout'),
    {useProjects} = require('$/stores'),
    {Modal, Heading, Text, Button, QRScanner, EntityFilter}
        = require('$/lib/ui'),
    {entries} = Object


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

    return <MenuLayout><AssistantLayout>
        <Heading children='Projects' />

        <Button
            text='Filter'
            onPress={() => toggleFilter(true)}
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
            text='Connect to a project'
        />

        <Modal
            visible={scannerShown}
            onRequestClose={() => toggleScanner(false)}
        >
            <QRScanner
                text='Scan project QR code'
                onScan={async ({data}) => {
                    toggleScanner(false)

                    const projDid = url.parse(data).path.split('/')[2]

                    if (ps.items[projDid])
                        return alert('Project already exists!')

                    try {
                        await ps.connect(projDid)
                    } catch (e) {
                        alert('Couldn\'t connect to project, please try again later!') // eslint-disable-line max-len
                    }
                }}
            />
        </Modal>

        <Modal
            visible={!!focusedProjDid}
            onRequestClose={() => setFocusedProj(null)}
            transparent
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                justifyContent: 'center',
            }}>
                <Project
                    name={focusedProj.data.name}
                    logoUrl={focusedProj.data.logo}
                    imageUrl={focusedProj.data.image}
                />
                <Button
                    text='Disconnect from this Project'
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
                    text='View the Project Page'
                    onPress={() =>
                        Linking.openURL(
                            'https://app_uat.ixo.world/projects/'
                            + focusedProjDid
                            + '/overview',
                        )
                    }
                />
            </View>
        </Modal>
    </AssistantLayout></MenuLayout>
}

const Project = ({name, logoUrl, imageUrl}) =>
    <View style={style.proj.root}>
        <Image
            source={{uri: dashedHostname(imageUrl)}}
            style={style.proj.coverImg}
        />

        <View style={style.proj.title.root}>
            <Text children={name} style={style.proj.title.heading} />

            <Image
                source={{uri: dashedHostname(logoUrl)}}
                style={style.proj.title.logoImg}
            />
        </View>
    </View>

const dashedHostname = urlStr =>
    urlStr.replace(
        /^(https?:\/\/)([^/]+)(\/.*)/,
        (_, proto, host, path) => proto + host.replace('_', '-') + path,
    )

const style = {
    proj: {
        root: {
            backgroundColor: '#ccc',
            margin: 5,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#777',
        },

        coverImg: {width: '100%', height: 150},

        title: {
            root: {
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
            },

            heading: {flex: 1, fontWeight: 'bold'},

            logoImg: {flex: 0, width: 40, height: 40},
        },
    },
}

module.exports = Projects

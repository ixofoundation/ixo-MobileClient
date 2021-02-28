const
    url = require('url'),
    React = require('react'),
    {useState} = React,
    {
        TouchableOpacity, 
        ScrollView, 
        View, 
        StyleSheet, 
        Text,
    } = require('react-native'),
    {sortBy, filter} = require('lodash-es'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    ProjectActions = require('./ProjectActions'),
    ProjectListItem = require('./ProjectListItem'),
    {useProjects} = require('$/stores'),
    {Modal, Button, QRScanner, EntityFilter, Icon} = require('$/lib/ui'),
    theme = require('$/theme')


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
            <View style={style.appBar}>
                <Icon name='mainMenu' fill='white'/>
                <View style={style.redBtn}>
                    <Text style={style.redBtnText}>
                            5
                    </Text>
                    <Icon name='autoRenew' fill='white' />
                </View>
            </View>

            <View style={style.header}>
                <Text 
                    style={style.title} 
                    children={'Projects'}/>

                <Button 
                    text='Filter'
                    type='outlined'
                    prefix={<Icon name='filter' fill='#83D9F2'/>}
                    style={style.filterBtn}
                    onPress={() => toggleFilter(true)}
                />
            </View>

            <ScrollView style={style.projectsContainer}>
                {projects.map(({
                    projectDid,
                    data: {name, logo, image, description},
                }) =>
                    <TouchableOpacity
                        key={projectDid}
                        onPress={() =>  setFocusedProj(projectDid)}
                    >
                        <ProjectListItem
                            name={name}
                            logoUrl={logo}
                            imageUrl={image}
                            description={description}
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
                children={
                    <ProjectActions
                        project={ps.items[focusedProjDid]}
                        onClose={() => setFocusedProj(null)}
                        onDisconnect={() => {
                            setFocusedProj(null)
                            ps.disconnect(focusedProjDid)
                        }}
                    />}
            />
        </View>
    </AssistantLayout></MenuLayout>
}

const style = StyleSheet.create({
    root: {
        backgroundColor: '#012D42',
        flex: 1,
        paddingHorizontal: theme.spacing(2),
    },
    appBar: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1),
    },
    redBtn: {
        backgroundColor: '#A11C43', 
        borderRadius: 16, 
        flexDirection: 'row', 
        alignItems: 'center',
    },
    redBtnText: {
        color: 'white', 
        marginHorizontal: theme.spacing(1), 
        fontSize: theme.fontSizes.h6,
    },
    header: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: theme.spacing(1),
    },
    title: {
        color: 'white', 
        fontSize: theme.fontSizes.h3,
    },
    projectsContainer: {flex: 1},
    filterBtn: {
        borderRadius: 24,
    },
})

module.exports = Projects

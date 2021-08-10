const url = require('url'),
    React = require('react'),
    {useState, useContext} = React,
    {ScrollView, View, StyleSheet, Text, Pressable} = require('react-native'),
    {NavigationContext} = require('navigation-react'),
    {get} = require('lodash-es'),
    {useQueries} = require('react-query'),
    {getClient} = require('$/ixoCli'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    ProjectActions = require('./ProjectActions'),
    ProjectListItem = require('./ProjectListItem'),
    {useProjects} = require('$/stores'),
    {Modal, Button, QRScanner, EntityFilter, Icon} = require('$/lib/ui'),
    theme = require('$/theme')

const filterSpec = [
    {
        type: 'option',
        id: 'sortBy',
        title: 'Sort by',
        opts: [
            {
                value: 'data.startDate',
                title: 'Recently Added',
            },
            {
                value: 'data.claimStats.currentSuccessful',
                title: 'Most Active',
            },
            {
                value: 'data.name',
                title: 'Name',
            },
        ],
    },
    {
        type: 'option',
        id: 'stage',
        multiple: true,
        opts: ['Proposal', 'Planning', 'Delivery', 'Closing', 'Ended'],
    },
    {
        type: 'dateRange',
        id: 'dateRange',
        title: 'Date',
    },
]

const Projects = () => {
    const {stateNavigator: nav} = useContext(NavigationContext),
        ps = useProjects(),
        ixoCli = getClient(),

        [scannerShown, toggleScanner] = useState(false),
        [filterShown, toggleFilter] = useState(false),
        [filters, setFilters] = useState({}),
        [focusedProjDid, setFocusedProj] = useState(),

        projectQueries = useQueries(ps.items.map(projDid => ({
            queryKey: ['project', projDid],
            queryFn: () => ixoCli.getProject(projDid),
        }))),

        projFilter = (p) => {
            if (filters.stage && !filters.stage.includes(p.data.stage))
                return false

            return !filters.dateRange
                ? true
                : p.data.startDate >= filters.dateRange[0] &&
                      p.data.endDate <= filters.dateRange[1]
        },

        projects =
            projectQueries
                .filter(q => q.isSuccess)
                .map(q => q.data)
                .filter(projFilter)
                .sort((a, b) =>
                    get(a, filters.sortBy)
                        .localeCompare(get(b, filters.sortBy))),

        focusedProj = projects.find(p =>
            focusedProjDid && p.projectDid == focusedProjDid)

    const handleScan = async ({data}) => {
        toggleScanner(false)

        const projDid = url.parse(data).path.split('/')[2]

        if (ps.items.includes(projDid))
            return alert('Project already exists!')

        ps.connect(projDid)
    }

    return (
        <MenuLayout>
            <AssistantLayout>
                <View style={style.root}>
                    <View style={style.appBar}>
                        <Icon name="mainMenu" fill="white" />
                        <View style={style.redBtn}>
                            <Text style={style.redBtnText}>5</Text>
                            <Icon name="autoRenew" fill="white" />
                        </View>
                    </View>

                    <View style={style.header}>
                        <Text style={style.title} children={'My Projects'} />

                        <Button
                            text="Filter"
                            type="outlined"
                            prefix={<Icon name="filter" fill="#83D9F2" />}
                            style={style.filterBtn}
                            onPress={() => toggleFilter(true)}
                        />
                    </View>

                    <ScrollView
                        style={style.projectsContainer}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        children={projects.map((p) => (
                            <ProjectListItem
                                key={p.projectDid}
                                project={p}
                                onDetailPress={() =>
                                    setFocusedProj(p.projectDid)
                                }
                            />
                        ))}
                    />

                    <Pressable
                        onPress={() => toggleScanner(true)}
                        style={style.connectBtn}
                        children={
                            <Text children="+" style={style.connectBtnText} />
                        }
                    />

                    <Modal
                        visible={filterShown}
                        onRequestClose={() => toggleFilter(false)}
                        children={
                            <EntityFilter
                                spec={filterSpec}
                                onCancel={() => toggleFilter(false)}
                                onChange={(filters) => {
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
                        <Button
                            text='dummy'
                            onPress={() =>
                                handleScan('did:ixo:EA4XpByjFM8WbQo9mzSemc')}
                        />

                        <QRScanner
                            onScan={handleScan}
                            onClose={() => toggleScanner(false)}
                        />
                    </Modal>

                    <Modal
                        visible={!!focusedProj}
                        onRequestClose={() => setFocusedProj(null)}
                        transparent
                        children={
                            <ProjectActions
                                project={focusedProj}
                                onClose={() => setFocusedProj(null)}
                                onDisconnect={() => {
                                    setFocusedProj(null)
                                    ps.disconnect(focusedProjDid)
                                }}
                                onNavigate={(...args) => {
                                    setFocusedProj(null)
                                    nav.navigate(...args)
                                }}
                            />
                        }
                    />
                </View>
            </AssistantLayout>
        </MenuLayout>
    )
}

const style = StyleSheet.create({
    root: {
        backgroundColor: '#002233',
        flex: 1,
        paddingHorizontal: theme.spacing(2),
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: theme.spacing(2) + 4,
    },
    redBtn: {
        backgroundColor: theme.colors.primary.darkRed,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing(0.5),
        paddingVertical: 1,
    },
    redBtnText: {
        color: 'white',
        marginHorizontal: theme.spacing(0.5),
        fontSize: theme.fontSizes.smallBody,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: theme.spacing(2),
    },
    title: {
        color: 'white',
        fontSize: theme.fontSizes.h1,
        fontWeight: '400',
    },
    projectsContainer: {flex: 1},
    filterBtn: {
        borderRadius: 24,
    },
    connectBtn: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: '#a11c43',
        justifyContent: 'center',
        alignItems: 'center',
    },
    connectBtnText: {
        color: 'white',
        fontSize: 30,
    },
})

module.exports = Projects

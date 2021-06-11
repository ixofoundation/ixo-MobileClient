const Loadable = require('$/lib/ui/Loadable')
const React = require('react'),
    {ActivityIndicator, View} = require('react-native'),
    {useQueries} = require('react-query'),
    moment = require('moment'),
    {countBy} = require('lodash-es'),
    {useProjects} = require('$/stores'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    ClaimActivity = require('$/scenes/Claims/ClaimActivity')

const ProjectClaimActivity = ({projectDid, templateDid}) => {
    const {getProject, getTemplate} = useProjects(),
        [projQuery, tplQuery] = useQueries([
            {
                queryKey: ['projects', projectDid],
                queryFn: () => getProject(projectDid),
            },
            {
                queryKey: ['templates', templateDid],
                queryFn: () => getTemplate(templateDid),
            },
        ])

    return (
        <MenuLayout>
            <AssistantLayout>
                <Loadable
                    loading={tplQuery.isLoading || projQuery.isLoading}
                    data={{project: projQuery.data, tpl: tplQuery.data}}
                    render={({project, tpl}) => (
                        <ClaimActivity
                            dateRange={fmtDateRange(
                                project.data.startDate,
                                project.data.endDate,
                            )}
                            {...getProjectClaimStats(project, templateDid)}
                        />
                    )}
                />
            </AssistantLayout>
        </MenuLayout>
    )
}

const fmtDateRange = (startDate, endDate) =>
    moment(startDate).format('D MMM YY') +
    ' - ' +
    moment(endDate).format('D MMM YY')

const getProjectClaimStats = (proj, templateDid) => {
    const claims = proj.data.claims.filter(
            (c) => c.claimTemplateId === templateDid,
        ),
        claimCountsByStatus = countBy(claims, 'status')

    return {
        pending: claimCountsByStatus[0],
        approved: claimCountsByStatus[1],
        disputed: claimCountsByStatus[2],
        rejected: claimCountsByStatus[3],
        submitted: claims.length,
        total: proj.data.entityClaims.items.find(
            (tpl) => tpl['@id'] === templateDid,
        ).targetMax,
    }
}

module.exports = ProjectClaimActivity

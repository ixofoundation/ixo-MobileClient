const
    React = require('react'),
    {ActivityIndicator} = require('react-native'),
    {useQueries} = require('react-query'),
    moment = require('moment'),
    {countBy} = require('lodash-es'),
    {useProjects} = require('$/stores'),
    MenuLayout = require('$/MenuLayout'),
    AssistantLayout = require('$/AssistantLayout'),
    ClaimActivity = require('$/scenes/Claims/ClaimActivity')


const ProjectClaimActivity = ({projectDid, templateDid}) => {
    const
        {getProject, getTemplate} = useProjects(),

        [projQuery, tplQuery] = useQueries([{
            queryKey: ['projects', projectDid],
            queryFn: () => getProject(projectDid),
        }, {
            queryKey: ['templates', templateDid],
            queryFn: () => getTemplate(templateDid),
        }])

    return <MenuLayout><AssistantLayout>
        {(!projQuery.isSuccess || !tplQuery.isSuccess)
            ? <ActivityIndicator color='black' size='large' />

            : <ClaimActivity
                dateRange={
                    fmtDateRange(
                        projQuery.data.data.startDate,
                        projQuery.data.data.endDate,
                    )
                }
                {...getProjectClaimStats(projQuery.data, templateDid)}
            />}
    </AssistantLayout></MenuLayout>
}

const fmtDateRange = (startDate, endDate) =>
    moment(startDate).format('D MMM YY')
    + ' - '
    + moment(endDate).format('D MMM YY')

const getProjectClaimStats = (proj, templateDid) => {
    const
        claims =
            proj.data.claims.filter(c => c.claimTemplateId === templateDid),

        claimCountsByStatus = countBy(claims, 'status')

    return {
        pending: claimCountsByStatus[0],
        approved: claimCountsByStatus[1],
        disputed: claimCountsByStatus[2],
        rejected: claimCountsByStatus[3],
        submitted: claims.length,
        total:
            proj.data.entityClaims.items
                .find(tpl => tpl['@id'] === templateDid)
                .targetMax,
    }
}


module.exports = ProjectClaimActivity

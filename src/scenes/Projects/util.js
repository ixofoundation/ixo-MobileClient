const moment = require('moment')

exports.getProjectLatestClaimDateText = ({
    data: {
        entityClaims: {items: claims},
    },
}) =>
    `Your last claim submitted on ${moment(
        claims.reduce((acc, item) => {
            const startDate = new Date(item.startDate)
            if (startDate.valueOf() > acc.valueOf()) {
                return startDate
            }
            return acc
        }, new Date(0)),
    ).format('DD-MM-yyyy')}`

exports.fixImageUrl = (url) => url.replace('pds-pandora', 'pds_pandora')

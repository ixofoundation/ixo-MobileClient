const {useState, useEffect} = require('react')
const React = require('react'),
    {View, Image, StyleSheet, Text, Pressable} = require('react-native'),
    theme = require('$/theme'),
    {Icon} = require('$/lib/ui'),
    ProgressBar = require('./ProgressBar'),
    {fixImageUrl, getProjectLatestClaimDateText} = require('./util')

const LOGO_WIDTH = 40

const ProjectListItem = ({project, onDetailPress}) => {
    const {
        data: {
            name,
            logo: logoUrl,
            image: imageUrl,
            description,
            claims: {length: claimCount},
            entityClaims: {items: claims},
        },
    } = project
    const [claimTpl] = claims

    const [logoRatio, setLogoRatio] = useState(1)
    useEffect(() => {
        Image.getSize(logoUrl, (width, height) => {
            setLogoRatio(width / height)
        })
    }, [logoUrl])

    return (
        <View style={style.root}>
            <Image
                source={{
                    uri: fixImageUrl(imageUrl),
                }}
                style={style.coverImg}
            />

            <Image
                source={{
                    uri: fixImageUrl(logoUrl),
                }}
                style={{
                    width: LOGO_WIDTH,
                    height: logoRatio * LOGO_WIDTH,
                    position: 'absolute',
                    left: 0,
                    borderBottomEndRadius: 8,
                }}
            />

            <View style={style.card}>
                <View style={style.headingContainer}>
                    <Text children={name} style={style.heading} />
                    <Pressable onPress={onDetailPress}>
                        <Icon
                            name="dotsVertical"
                            height={36}
                            width={36}
                            fill="#085F7D"
                        />
                    </Pressable>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        marginBottom: theme.spacing(2) - 3,
                    }}
                >
                    <Text
                        style={style.progressValueText}
                        children={claimCount}
                    />
                    <Text
                        style={style.progressText}
                        children={'/' + claimTpl.targetMax}
                    />
                </View>
                <Text style={style.detailText} children={description} />
                <View style={{marginBottom: theme.spacing(2) - 3}}>
                    <ProgressBar percent={40} progress={35} />
                </View>
                <Text
                    style={style.lastClaimText}
                    children={getProjectLatestClaimDateText(project)}
                />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    root: {
        backgroundColor: theme.colors.primary.darkBlue,
        marginBottom: theme.spacing(2),
        alignItems: 'center',
    },
    coverImg: {
        width: '100%',
        height: 180,
    },
    card: {
        padding: theme.spacing(2),
        borderColor: '#0E536B',
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomEndRadius: 8,
        borderBottomStartRadius: 8,
    },
    headingContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: theme.spacing(2),
    },
    heading: {
        flex: 1,
        fontWeight: '500',
        color: theme.colors.white,
        fontSize: theme.fontSizes.h2,
    },
    progressText: {
        fontSize: theme.fontSizes.numbersLarge,
        color: theme.colors.white,
    },
    progressValueText: {
        fontSize: theme.fontSizes.numbersLarge,
        color: theme.colors.primary.lightBlue,
    },
    detailText: {
        fontSize: theme.fontSizes.p1,
        fontWeight: '400',
        color: theme.colors.white,
        marginBottom: theme.spacing(2) - 3,
    },
    lastClaimText: {
        fontSize: theme.fontSizes.smallBody,
        color: theme.colors.primary.lightBlue,
        fontWeight: '400',
    },
    logoImg: {
        width: 30,
        height: 30,
        borderRadius: 30,
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

module.exports = ProjectListItem

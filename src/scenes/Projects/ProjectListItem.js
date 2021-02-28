const
    React = require('react'),
    {View, Image, StyleSheet, Text, Pressable}
        = require('react-native'),
    theme = require('$/theme'),
    {Icon} = require('$/lib/ui'),
    ProgressBar = require('./ProgressBar')

const ProjectListItem = ({project}) => {
    const {
        data: {
            name,
            logo: logoUrl,
            image: imageUrl,
            description,
            claimStats,
            entityClaims: {items: [claimTpl]},
        }
    } = project

    return <View style={style.root}>
        <Image
            source={{uri: dashedHostname(imageUrl)}}
            style={style.coverImg}
        />

        <View style={style.card}>
            <View style={style.headingContainer}>
                <Text children={name} style={style.heading} />


                <View style={style.logoContainer}>
                    <Image
                        source={{uri: dashedHostname(logoUrl)}}
                        style={style.logoImg}
                    />
                    <Pressable
                        onPress={() => console.log('detail is clicked!')}
                    >
                        <Icon
                            name='dotsVertical'
                            height={40} width={40} 
                            fill='#085F7D'
                        />
                    </Pressable>
                </View>
            </View>

            <View style={{flexDirection: 'row'}}>
                <Text 
                    style={style.progressValueText} 
                    children={claimStats.currentSuccessful}
                />
                <Text 
                    style={style.progressText} 
                    children={'/' + claimTpl.targetMax}
                />
            </View>
            <Text 
                style={style.detailText} 
                children={description}
            />
            <ProgressBar percent={40} progress={35}/>
            <Text 
                style={style.lastClaimText} 
                children={'Your last claim submitted on 05-05-18'}
            />
        </View>
    </View>
}

const style = StyleSheet.create({
    root: {
        backgroundColor: '#002D42',
        margin: theme.spacing(1),
        alignItems: 'center',
    },
    coverImg: {
        width: '100%', 
        height: 150,
    },
    card: {
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
    progressText: {
        fontSize: theme.fontSizes.h3, 
        color: 'white',
    },
    progressValueText: {
        fontSize: theme.fontSizes.h3, 
        color: '#83D9F2',
    },
    detailText: {
        fontSize: theme.fontSizes.h5, 
        color: 'white',
    },
    lastClaimText: {
        fontSize: theme.fontSizes.p1, 
        color: '#83D9F2',
    },
    logoImg: {
        flex: 0, 
        width: 40, 
        height: 40,
    },
    logoContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
})

const dashedHostname = urlStr =>
    urlStr.replace(
        /^(https?:\/\/)([^/]+)(\/.*)/,
        (_, proto, host, path) => proto + host.replace('_', '-') + path,
    )

module.exports = ProjectListItem

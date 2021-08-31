const
    React = require('react'),
    {View, Text, ActivityIndicator} = require('react-native'),
    {spacing, fontSizes} = require('$/theme')


const Container = ({children}) =>
    <View
        children={children}
        style={containerStyle}
    />

const containerStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
}

const Loadable = ({data, loading, error, render, empty}) => {
    if (loading) {
        return (
            <View style={bgStyles.loadingBg}>
                <Container>
                    <ActivityIndicator size="large" color="#03D0FB" />
                </Container>
            </View>
        )
    }

    if (error) {
        return (
            <Container>
                <View style={bgStyles.error}>
                    {error.code && (
                        <Text style={bgStyles.errorCode}>{error.code}</Text>
                    )}
                    <Text style={bgStyles.errorMsg}>{error.message}</Text>
                </View>
            </Container>
        )
    }

    if (!data) {
        return empty ? (
            empty
        ) : (
            <Container>
                <View style={bgStyles.empty}>
                    <Text style={bgStyles.emptyMsg}>Empty Result...</Text>
                </View>
            </Container>
        )
    }

    return render(data)
}

const bgStyles = {
    error: {
        borderRadius: 8,
        backgroundColor: '#E2223B',
        padding: spacing(1),
    },
    errorCode: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: fontSizes.h6,
    },
    errorMsg: {
        color: 'white',
        fontSize: fontSizes.p1,
    },
    empty: {
        backgroundColor: '#ED9526',
        padding: spacing(1),
    },
    emptyMsg: {
        color: 'white',
        fontSize: fontSizes.p1,
    },
    loadingBg: {
        flex: 1,
    },
}


module.exports = Loadable

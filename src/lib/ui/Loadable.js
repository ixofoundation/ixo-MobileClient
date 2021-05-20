const React = require('react'),
    {View, Text, StyleSheet} = require('react-native')

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

const Container = ({children}) => (
    <View style={style.container}>{children}</View>
)

const Loadable = ({data, loading, error, render}) => {
    if (loading) {
        return (
            <Container>
                <Text>Loading...</Text>
            </Container>
        )
    }

    if (error) {
        return (
            <Container>
                <Text>Error...</Text>
            </Container>
        )
    }

    if (!data) {
        return (
            <Container>
                <Text>No Data...</Text>
            </Container>
        )
    }

    return render(data)
}

module.exports = Loadable

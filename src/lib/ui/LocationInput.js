const
    React = require('react'),
    {useState, useEffect} = React,
    {View} = require('react-native'),
    {default: MapView, Marker} = require('react-native-maps'),
    {GooglePlacesAutocomplete} =
        require('react-native-google-places-autocomplete'),
    GeoLocation = require('react-native-geolocation-service').default,
    {noop} = require('lodash-es'),
    {getAndroidPermission} = require('$/lib/util'),
    Button = require('./Button'),
    Modal = require('./Modal')


const LocationInput = ({value, onChange = noop}) => {
    const
        [mapShown, toggleMap] = useState(false),
        [markerCoords, setMarkerCoords] = useState(value),

        [region, setRegion] = useState({
            latitude: value ? value.latitude : 0,
            longitude: value ? value.longitude : 0,
            latitudeDelta: value ? 0.2 : 80,
            longitudeDelta: value ? 0.2 : 80,
        })

    useEffect(() => { (async () => {
        await getAndroidPermission('ACCESS_FINE_LOCATION')
        await getAndroidPermission('ACCESS_COARSE_LOCATION')

        if (!value) {
            GeoLocation.getCurrentPosition(
                ({coords: {latitude, longitude}}) =>
                    setRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    }),

                err => { throw new Error(err) },

                {enableHighAccuracy: true},
            )
        }
    })() }, [])

    return <View>
        <Button
            type='contained'
            text={
                !value
                    ? 'Select Location'
                    : value.latitude + ', ' + value.longitude}
            onPress={() => toggleMap(true)}
        />

        <Modal
            visible={mapShown}
            onRequestClose={() => toggleMap(false)}
        >
            <GooglePlacesAutocomplete
                placeholder='Search'
                fetchDetails={true}
                currentLocation={true}
                onPress={(_, {geometry: {location: {lat, lng}}}) => {
                    setMarkerCoords({latitude: lat, longitude: lng})

                    setRegion({
                        latitude: lat,
                        longitude: lng,
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    })
                }}
                query={{
                    key: 'AIzaSyDg3kRLSWrAT3UFjVGgIL3H5wE6NdBIsiQ',
                    language: 'en',
                }}
                enablePoweredByContainer={false}
                styles={{
                    container: {
                        position: 'absolute',
                        zIndex: 2,
                        top: 5,
                        left: 5,
                        right: 5,
                    },
                }}
            />

            <Button
                type='contained'
                text='Done'
                onPress={() => {
                    onChange(markerCoords)
                    toggleMap(false)
                }}
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    bottom: 5,
                    left: 5,
                    right: 5,
                }}
            />

            <MapView
                showUserLocation={true}
                onPress={e => setMarkerCoords(e.nativeEvent.coordinate)}
                region={region}
                onRegionChangeComplete={setRegion}
                style={{height: '100%'}}
            >
                {markerCoords &&
                    <Marker
                        coordinate={markerCoords}
                        title='falan'
                        description='lorem ipsum dolor'
                    />}
            </MapView>
        </Modal>
    </View>
}


module.exports = LocationInput

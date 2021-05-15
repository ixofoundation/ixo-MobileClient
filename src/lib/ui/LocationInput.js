const
    React = require('react'),
    {useState, useEffect} = React,
    {View, Platform} = require('react-native'),
    {default: MapView, Marker} = require('react-native-maps'),
    {GooglePlacesAutocomplete} =
        require('react-native-google-places-autocomplete'),
    GeoLocation = require('react-native-geolocation-service').default,
    {noop} = require('lodash-es'),
    {getAndroidPermission} = require('$/lib/util'),
    Button = require('./Button'),
    Modal = require('./Modal')


const LocationInput = ({value, onChange = noop, editable = true}) => {
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

        if (Platform.OS === 'ios') {
            await GeoLocation.requestAuthorization('WhenInUse')
        }

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
            onPress={() => editable && toggleMap(true)}
        />

        <Modal
            visible={editable && mapShown}
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
                    key: process.env.GOOGLE_MAPS_PLACES_APIKEY,
                    language: 'en',
                }}
                enablePoweredByContainer={false}
                styles={{
                    container: {
                        position: 'absolute',
                        zIndex: 2,
                        top: Platform.OS === 'ios' ? 50 : 5,
                        left: 5,
                        right: 5,
                    },
                }}
            />

            <Button
                type='contained'
                text='Done'
                onPress={() => {
                    onChange({
                        latitude: markerCoords.latitude,
                        longitude: markerCoords.longitude,
                    })
                    // We don't pass "markerCoords" directly as it's not a POJO
                    // and makes use of getters. We want to return a POJO.

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

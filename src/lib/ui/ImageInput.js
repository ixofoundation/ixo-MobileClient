const
    React = require('react'),
    {useState, useCallback} = React,
    {View, Image, Modal} = require('react-native'),
    {RNCamera} = require('react-native-camera'),
    {selectFile} = require('$/lib/util'),
    Button = require('./Button')


const ImageInput = ({value, onChange}) => {
    const
        [camShown, toggleCam] = useState(false),

        takePhoto = useCallback(async cam => {
            const
                options = {quality: 0.3},
                data = await cam.takePictureAsync(options)

            data.type = 'image/jpeg'

            onChange(data)
            toggleCam(false)
        }),

        selectImage = useCallback(async () => {
            const img = await selectFile('images')

            if (img)
                onChange(img)
        })

    return <View style={style}>
        {value &&
            <Image
                source={{uri: value.uri}}
                style={{width: '100%', height: 200, alignSelf: 'center'}}
            />}

        <Button
            type='contained'
            text='Take a Photo'
            onPress={() => toggleCam(true)}
        />

        <Button
            type='contained'
            text='Select Image'
            onPress={selectImage}
        />

        <Modal
            visible={camShown}
            onRequestClose={() => toggleCam(false)}
        >
            <RNCamera
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                defaultVideoQuality={RNCamera.Constants.VideoQuality['480p']}
                captureAudio={false}
                style={{height: '100%'}}
            >
                {({camera}) =>
                    <Button
                        type='contained'
                        text='Take Photo'
                        onPress={() => takePhoto(camera)}
                    />}
            </RNCamera>
        </Modal>
    </View>
}

const style = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
}


module.exports = ImageInput

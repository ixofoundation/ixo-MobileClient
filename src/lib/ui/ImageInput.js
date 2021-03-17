const
    React = require('react'),
    {useState, useCallback} = React,
    {View, Image} = require('react-native'),
    {RNCamera} = require('react-native-camera'),
    {noop} = require('lodash-es'),
    {selectFile} = require('$/lib/util'),
    Button = require('./Button'),
    Modal = require('./Modal')


const defaultPhotoOptions = {
    width: 640,
    quality: 0.2,
}

const ImageInput = ({
    value,
    onChange = noop,
    editable = true,
    photoOptions = {},
}) => {
    const
        [camShown, toggleCam] = useState(false),

        finalPhotoOptions = {...defaultPhotoOptions, ...photoOptions},

        takePhoto = useCallback(async cam => {
            const data = await cam.takePictureAsync(finalPhotoOptions)

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

        {editable && <>
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
        </>}

        <Modal
            visible={editable && camShown}
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

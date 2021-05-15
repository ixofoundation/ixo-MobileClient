const
    React = require('react'),
    {useState, useCallback} = React,
    {View, Image, Pressable, Text} = require('react-native'),
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
                source={{uri: value.uri || value}}
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
                style={{height: '100%', justifyContent: 'flex-end'}}
            >
                {({camera}) => <>
                    <Pressable
                        onPress={() => toggleCam(false)}
                        style={backStyle}
                        children={
                            <Text style={backTextStyle} children='Back' />}
                    />

                    <Button
                        type='contained'
                        size='lg'
                        text='Take Photo'
                        onPress={() => takePhoto(camera)}
                    />
                </>}
            </RNCamera>
        </Modal>
    </View>
}

const
    style = {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    backStyle = {
        position: 'absolute',
        top: 5,
        backgroundColor: '#012D42',
        padding: 5,
    },

    backTextStyle = {
        color: 'white',
        textDecorationLine: 'underline',
    }


module.exports = ImageInput

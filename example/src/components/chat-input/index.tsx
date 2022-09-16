/* eslint-disable react-native/no-inline-styles */
import { requestMemoryPermission, requestRecordAudioPermission } from '../../utils'
import * as React from 'react'
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as HeroIcons from 'react-native-heroicons/outline'
import { Asset, launchImageLibrary } from 'react-native-image-picker'
import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
} from 'react-native-audio-recorder-player'

const audioRecorderPlayer = new AudioRecorderPlayer()
interface ChatInputProps {
    onSendMessage: (messageData: { text?: string; file?: Asset }) => void
    onSendAudio: (fileUri: string) => void
}

const ChatInput = ({ onSendMessage, onSendAudio }: ChatInputProps): JSX.Element => {
    const [text, setText] = React.useState<string>()
    const [galleryEnabled, setGalleryEnabled] = React.useState<boolean>(false)
    const [audioEnabled, setAudioEnabled] = React.useState<boolean>(false)

    const [audioRecordState, setAudioRecordState] = React.useState<{ secs: number; time?: string }>()
    const [isAudioRecording, setIsAudioRecording] = React.useState<boolean>(false)

    const handleSendMessagePressed = (): void => {
        if (text !== undefined && text.trim().length >= 0) {
            onSendMessage({ text: text.trim() })
            setText(undefined)
        }
    }

    const handleAddAttachmentPressed = async (): Promise<void> => {
        const result = await launchImageLibrary({ mediaType: 'mixed' })
        console.log('handleAddAttachmentPressed', result)
        if (result.assets && result.assets[0]) onSendMessage({ text: text?.trim(), file: result.assets[0] })
    }

    const handleRecordAudioPressed = (): void => {
        if (isAudioRecording) stopRecord()
        else startRecord()
    }

    const startRecord = async (): Promise<void> => {
        const audioSet: AudioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.min,
            AVNumberOfChannelsKeyIOS: 1,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
            AudioEncodingBitRateAndroid: 10000,
        }
        const result = await audioRecorderPlayer.startRecorder(undefined, audioSet)
        audioRecorderPlayer.addRecordBackListener((e) => {
            setAudioRecordState({
                secs: e.currentPosition,
                time: audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)),
            })
        })
        console.log('start record result', result)
        setIsAudioRecording(true)
    }

    const stopRecord = async (): Promise<void> => {
        const result = await audioRecorderPlayer.stopRecorder()
        audioRecorderPlayer.removeRecordBackListener()
        setAudioRecordState({ secs: 0, time: undefined })
        console.log('stop record result', result)
        setIsAudioRecording(false)
        onSendAudio(result)
        // const stat = await RNFS.stat(result)
        // console.log('audio file stat', stat)
    }

    const cancelRecording = async (): Promise<void> => {
        const result = await audioRecorderPlayer.stopRecorder()
        audioRecorderPlayer.removeRecordBackListener()
        setAudioRecordState({ secs: 0, time: undefined })
        console.log('stop record result', result)
        setIsAudioRecording(false)
    }

    React.useEffect(() => {
        if (Platform.OS === 'android') {
            requestMemoryPermission((granted) => setGalleryEnabled(granted))
            requestRecordAudioPermission((granted) => setAudioEnabled(granted))
        } else {
            setGalleryEnabled(true)
            setAudioEnabled(true)
        }
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.nestedContainer}>
                {isAudioRecording ? (
                    <View style={styles.timeWrapper}>
                        <Text style={styles.timeText}>{audioRecordState?.time}</Text>
                    </View>
                ) : (
                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={text}
                            onChangeText={setText}
                            placeholder="Message"
                            placeholderTextColor="#009ff0"
                            style={styles.input}
                            multiline
                        />
                    </View>
                )}
                {isAudioRecording ? (
                    <TouchableOpacity style={[styles.iconWrapper]} onPress={cancelRecording}>
                        <HeroIcons.TrashIcon color="#005ff0" size={26} />
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    style={[styles.iconWrapper, { opacity: audioEnabled ? 1 : 0.7 }]}
                    onPress={handleRecordAudioPressed}
                    disabled={!audioEnabled}>
                    {isAudioRecording ? (
                        <HeroIcons.PaperAirplaneIcon color="#005ff0" size={26} />
                    ) : (
                        <HeroIcons.MicrophoneIcon color="#005ff0" size={26} />
                    )}
                </TouchableOpacity>
                {!isAudioRecording ? (
                    <>
                        <TouchableOpacity
                            style={[styles.iconWrapper, { opacity: galleryEnabled ? 1 : 0.7 }]}
                            onPress={handleAddAttachmentPressed}
                            disabled={!galleryEnabled}>
                            <HeroIcons.PaperClipIcon color="#005ff0" size={26} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.iconWrapper,
                                { opacity: text === undefined || text.trim().length === 0 ? 0.7 : 1 },
                            ]}
                            onPress={handleSendMessagePressed}
                            disabled={text === undefined || text.trim().length === 0}>
                            <HeroIcons.PaperAirplaneIcon color="#005ff0" size={26} />
                        </TouchableOpacity>
                    </>
                ) : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        paddingBottom: 50,
        backgroundColor: '#005ff0',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
    },

    nestedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 30,
        minHeight: 42,
        justifyContent: 'center',
    },
    iconWrapper: {
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 100,
        marginLeft: 8,
    },
    input: {
        color: '#005ff0',
        minHeight: 42,
        maxHeight: 120,
    },
    timeText: {
        color: '#fff',
    },
    timeWrapper: {
        flex: 1,
    },
})

export default ChatInput

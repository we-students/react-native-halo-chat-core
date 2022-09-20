/* eslint-disable react-native/no-inline-styles */
import { useAuth } from '../../providers/auth'
import * as React from 'react'
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import type * as HaloChat from '@westudents/react-native-halo-chat-core'
import Video from 'react-native-video'
import * as HeroIcons from 'react-native-heroicons/solid'
import { format } from 'date-fns'

interface ChatMessageBubbleProps {
    message: HaloChat.Types.MessageType.Any
    onRequestHandleAudioPlaying: () => void
    playing: boolean
}

interface MessageBubbleProps<T> {
    message: T
    isMine: boolean
    onRequestHandleAudioPlaying?: () => void
    playing?: boolean
}

const TextMessageBubble = ({ message, isMine }: MessageBubbleProps<HaloChat.Types.MessageType.Text>): JSX.Element => {
    return (
        <View style={styles.bubbleWrapper}>
            {isMine ? (
                <Text style={[styles.bubbleDate, { marginRight: 8 }]}>
                    {format(message.created_at.toDate(), 'HH:mm')}
                </Text>
            ) : null}
            <View
                style={[
                    styles.bubble,
                    {
                        backgroundColor: isMine ? '#005ff0' : '#009ff0',
                        borderBottomLeftRadius: isMine ? 8 : 0,
                        borderBottomRightRadius: isMine ? 0 : 8,
                    },
                ]}>
                <Text style={[{ color: '#fff' }]}>{message.text}</Text>
            </View>
            {!isMine ? (
                <Text style={[styles.bubbleDate, { marginLeft: 8 }]}>
                    {format(message.created_at.toDate(), 'HH:mm')}
                </Text>
            ) : null}
        </View>
    )
}

const ImageMessageBubble = ({ message, isMine }: MessageBubbleProps<HaloChat.Types.MessageType.File>): JSX.Element => {
    const { width: screenWidth } = Dimensions.get('screen')

    return (
        <View style={styles.bubbleWrapper}>
            {isMine ? (
                <Text style={[styles.bubbleDate, { marginRight: 8 }]}>
                    {format(message.created_at.toDate(), 'HH:mm')}
                </Text>
            ) : null}
            <View
                style={[
                    styles.bubble,
                    {
                        backgroundColor: isMine ? '#005ff0' : '#009ff0',
                        borderBottomLeftRadius: isMine ? 8 : 0,
                        borderBottomRightRadius: isMine ? 0 : 8,
                        padding: 0,
                    },
                ]}>
                <Image
                    source={{ uri: message.file.uri }}
                    style={{
                        width: screenWidth / 2,
                        height: screenWidth / 2,
                    }}
                />
                {message.text !== null ? (
                    <Text style={[{ color: '#fff', margin: 8, marginTop: 4 }]}>{message.text}</Text>
                ) : null}
            </View>
            {!isMine ? (
                <Text style={[styles.bubbleDate, { marginLeft: 8 }]}>
                    {format(message.created_at.toDate(), 'HH:mm')}
                </Text>
            ) : null}
        </View>
    )
}

const VideoMessageBubble = ({ message, isMine }: MessageBubbleProps<HaloChat.Types.MessageType.File>): JSX.Element => {
    const { width: screenWidth } = Dimensions.get('screen')
    const [paused, setPaused] = React.useState<boolean>(true)
    return (
        <View style={styles.bubbleWrapper}>
            {isMine ? (
                <Text style={[styles.bubbleDate, { marginRight: 8 }]}>
                    {format(message.created_at.toDate(), 'HH:mm')}
                </Text>
            ) : null}
            <View
                style={[
                    styles.bubble,
                    {
                        backgroundColor: isMine ? '#005ff0' : '#009ff0',
                        borderBottomLeftRadius: isMine ? 8 : 0,
                        borderBottomRightRadius: isMine ? 0 : 8,
                        padding: 0,
                    },
                ]}>
                <View
                    style={{
                        width: screenWidth / 2,
                        height: screenWidth / 2,
                    }}>
                    <Video
                        source={{ uri: message.file.uri }}
                        poster={message.file.uri}
                        style={{
                            width: screenWidth / 2,
                            height: screenWidth / 2,
                        }}
                        resizeMode="contain"
                        paused={paused}
                    />
                    <View
                        style={{
                            width: screenWidth / 2,
                            height: screenWidth / 2,
                            position: 'absolute',
                        }}>
                        <Image
                            style={{
                                width: screenWidth / 2,
                                height: screenWidth / 2,
                                bottom: 0,
                                right: 0,
                            }}
                            resizeMode="contain"
                            source={{ uri: message.file.uri }}
                        />
                        <Pressable
                            style={{
                                position: 'absolute',
                                top: screenWidth / 4 - 16,
                                left: screenWidth / 4 - 16,
                            }}
                            onPress={(): void => setPaused((v) => !v)}>
                            {paused ? (
                                <HeroIcons.PlayIcon color="#fff" size={32} opacity={0.7} />
                            ) : (
                                <HeroIcons.StopIcon color="#fff" size={32} opacity={0.7} />
                            )}
                        </Pressable>
                    </View>
                    <View />
                </View>
                {message.text !== null ? (
                    <Text style={[{ color: '#fff', margin: 8, marginTop: 4 }]}>{message.text}</Text>
                ) : null}
            </View>
            {!isMine ? (
                <Text style={[styles.bubbleDate, { marginLeft: 8 }]}>
                    {format(message.created_at.toDate(), 'HH:mm')}
                </Text>
            ) : null}
        </View>
    )
}

const AudioMessageBubble = ({
    message,
    isMine,
    onRequestHandleAudioPlaying,
    playing,
}: MessageBubbleProps<HaloChat.Types.MessageType.File>): JSX.Element => {
    return (
        <View style={styles.bubbleWrapper}>
            {isMine ? (
                <Text style={[styles.bubbleDate, { marginRight: 8 }]}>
                    {format(message.created_at.toDate(), 'HH:mm')}
                </Text>
            ) : null}
            <View
                style={[
                    styles.bubble,
                    {
                        backgroundColor: isMine ? '#005ff0' : '#009ff0',
                        borderBottomLeftRadius: isMine ? 8 : 0,
                        borderBottomRightRadius: isMine ? 0 : 8,
                    },
                ]}>
                <Pressable onPress={onRequestHandleAudioPlaying}>
                    {playing ? (
                        <HeroIcons.StopIcon color="#fff" size={32} />
                    ) : (
                        <HeroIcons.PlayIcon color="#fff" size={32} />
                    )}
                </Pressable>
            </View>
            {!isMine ? (
                <Text style={[styles.bubbleDate, { marginLeft: 8 }]}>
                    {format(message.created_at.toDate(), 'HH:mm')}
                </Text>
            ) : null}
        </View>
    )
}

const ChatMessageItem = ({ message, onRequestHandleAudioPlaying, playing }: ChatMessageBubbleProps): JSX.Element => {
    const { user, agent, isAgent } = useAuth()
    const isMine = React.useMemo(() => {
        return isAgent && agent ? message.created_by === agent.id : message.created_by === user?.id
    }, [agent, isAgent, message.created_by, user?.id])

    const bubble = React.useMemo((): JSX.Element | null => {
        switch (message.content_type) {
            case 'TEXT':
                return <TextMessageBubble message={message as HaloChat.Types.MessageType.Text} isMine={isMine} />
            case 'IMAGE':
                return <ImageMessageBubble message={message as HaloChat.Types.MessageType.File} isMine={isMine} />
            case 'VIDEO':
                return <VideoMessageBubble message={message as HaloChat.Types.MessageType.File} isMine={isMine} />
            case 'AUDIO':
                return (
                    <AudioMessageBubble
                        message={message as HaloChat.Types.MessageType.File}
                        isMine={isMine}
                        onRequestHandleAudioPlaying={onRequestHandleAudioPlaying}
                        playing={playing}
                    />
                )
            default:
                return null
        }
    }, [isMine, message, onRequestHandleAudioPlaying, playing])

    return <View style={[styles.container, { justifyContent: isMine ? 'flex-end' : 'flex-start' }]}>{bubble}</View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 25,
    },
    bubble: {
        padding: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    bubbleWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    bubbleDate: {
        color: '#5d5d5d',
    },
})

export default ChatMessageItem

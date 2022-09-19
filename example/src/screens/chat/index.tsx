import type { ScreenProps } from '../../types'
import * as React from 'react'
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import type { RouteProp } from '@react-navigation/native'
import * as HaloChat from '@westudents/react-native-halo-chat-core'
import { useUser } from '../../providers/user'
import ChatInput from '../../components/chat-input'
import * as HeroIcons from 'react-native-heroicons/outline'
import ChatMessageItem from '../../components/chat-message-item'
import type { Asset } from 'react-native-image-picker'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'

type ChatScreenRouteType = RouteProp<{ Chat: { room: HaloChat.Types.Room } }, 'Chat'>

const audioPlayer = new AudioRecorderPlayer()

const ChatScreen = ({ navigation, route }: ScreenProps<ChatScreenRouteType>): JSX.Element => {
    const { user } = useUser()
    const [chatName, setChatName] = React.useState<string>()
    const [messages, setMessages] = React.useState<HaloChat.Types.MessageType.Any[]>()

    const [currentAudioPlaying, setCurrentAudioPlaying] = React.useState<string>()

    const {
        params: { room },
    } = route

    const handleSendMessage = ({ text, file }: { text?: string; file?: Asset }): void => {
        if (file !== undefined && file.fileName && file.uri && file.type) {
            HaloChat.RoomActions.sendFileMessage({
                roomId: room.id,
                text,
                file: {
                    filename: file.fileName,
                    uri: file.uri,
                    mimeType: file.type,
                },
            })
        } else if (text !== undefined) {
            HaloChat.RoomActions.sendTextMessage({ roomId: room.id, text })
        }
    }

    const handleSendAudio = (filePath: string): void => {
        HaloChat.RoomActions.sendFileMessage({
            roomId: room.id,
            file: {
                filename: `${new Date().toISOString()}_${filePath.split('/').reverse()[0]}`,
                uri: filePath,
                mimeType: 'audio/m4a',
            },
        })
    }

    const handleAudioPlaying = React.useCallback(
        async (message: HaloChat.Types.MessageType.File): Promise<void> => {
            if (currentAudioPlaying !== undefined) {
                await audioPlayer.stopPlayer()
            }
            if (currentAudioPlaying === undefined || currentAudioPlaying !== message.id) {
                setCurrentAudioPlaying(message.id)
                await audioPlayer.startPlayer(message.file.uri)
            } else {
                setCurrentAudioPlaying(undefined)
            }
        },
        [currentAudioPlaying],
    )

    const renderMessage = React.useCallback(
        ({ item }: { item: HaloChat.Types.MessageType.Any }) => {
            return (
                <ChatMessageItem
                    message={item}
                    onRequestHandleAudioPlaying={(): void => {
                        handleAudioPlaying(item as HaloChat.Types.MessageType.File)
                    }}
                    playing={currentAudioPlaying === item.id}
                />
            )
        },
        [currentAudioPlaying, handleAudioPlaying],
    )

    const renderDivider = React.useCallback((): JSX.Element => <View style={styles.divider} />, [])

    React.useEffect(() => {
        HaloChat.RoomActions.fetchMessages(
            room.id,
            (data) => {
                setMessages(data)
            },
            (error): void => console.error('handle here some error', error),
        )
    }, [room.id])

    React.useEffect(() => {
        if (room.scope === 'PRIVATE') {
            const otherUser = room.users.find((u) => u.id !== user?.id)
            setChatName(`${otherUser?.first_name} ${otherUser?.last_name}`)
        }
    }, [room.scope, room.users, user?.id])

    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <View style={styles.titleWrapper}>
                    <Pressable style={styles.iconWrapper} onPress={(): void => navigation.goBack()}>
                        <HeroIcons.ArrowLeftIcon color="#fff" />
                    </Pressable>
                    <Text style={styles.title}>{`${chatName}`}</Text>
                </View>
            </View>
            <FlatList
                keyExtractor={(item): string => item.id}
                data={messages}
                renderItem={renderMessage}
                ItemSeparatorComponent={renderDivider}
                ListHeaderComponent={renderDivider}
                ListFooterComponent={renderDivider}
                onEndReachedThreshold={0.75}
                showsVerticalScrollIndicator={false}
                inverted
            />
            <ChatInput onSendMessage={handleSendMessage} onSendAudio={handleSendAudio} />
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    divider: {
        height: 12,
    },
    header: {
        height: Platform.OS === 'ios' ? 120 : 100,
        paddingHorizontal: 25,
        backgroundColor: '#005ff0',
        paddingVertical: 16,
        justifyContent: 'flex-end',
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        color: '#fff',
    },
    iconWrapper: {
        marginRight: 8,
    },
})

export default ChatScreen

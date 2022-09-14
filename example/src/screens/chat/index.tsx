import type { ScreenProps } from '../../types'
import * as React from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import type { RouteProp } from '@react-navigation/native'
import { fetchMessages, MessageType, Room, sendTextMessage } from 'react-native-firebase-chat-sdk'
import { useUser } from '../../providers/user'
import ChatInput from '../../components/chat-input'
import * as HeroIcons from 'react-native-heroicons/outline'

type ChatScreenRouteType = RouteProp<{ Chat: { room: Room } }, 'Chat'>

const ChatScreen = ({ navigation, route }: ScreenProps<ChatScreenRouteType>): JSX.Element => {
    const { user } = useUser()
    const [chatName, setChatName] = React.useState<string>()
    const [messages, setMessages] = React.useState<MessageType.Any[]>()

    const {
        params: { room },
    } = route

    console.log('mannaggina', room)

    const handleSendMessage = (text: string): void => {
        sendTextMessage({ roomId: room.id, text })
    }

    const renderMessage = React.useCallback(({ item }: { item: MessageType.Any }) => {
        return (
            <View>
                <Text>{item.text}</Text>
            </View>
        )
    }, [])

    const renderDivider = React.useCallback((): JSX.Element => <View style={styles.divider} />, [])

    React.useEffect(() => {
        fetchMessages(
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
            <View style={styles.titleWrapper}>
                <Pressable style={styles.iconWrapper} onPress={(): void => navigation.goBack()}>
                    <HeroIcons.ArrowLeftIcon color="#005ff0" />
                </Pressable>
                <Text style={styles.title}>{`${chatName}`}</Text>
            </View>
            <FlatList data={messages} renderItem={renderMessage} ItemSeparatorComponent={renderDivider} />
            <ChatInput onSendMessage={handleSendMessage} />
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
    titleWrapper: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        borderBottomColor: '#005ff0',
        borderBottomWidth: 1,
        paddingVertical: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        color: '#005ff0',
    },
    iconWrapper: {
        marginRight: 8,
    },
})

export default ChatScreen

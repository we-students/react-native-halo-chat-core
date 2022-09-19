import * as React from 'react'
import type * as HaloChat from '@westudents/react-native-halo-chat-core'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image, StyleSheet, Text, View } from 'react-native'
import { format, isToday } from 'date-fns'

interface ChatItemProps {
    user: HaloChat.Types.User
    room: HaloChat.Types.Room
    onPress: () => void
}
const ChatItem = ({ room, user, onPress }: ChatItemProps): JSX.Element => {
    const u = room.users.find((cu) => cu.id !== user?.id)
    return (
        <TouchableOpacity style={styles.userItem} onPress={onPress}>
            {u?.image === undefined || u?.image === null ? (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{`${u?.first_name?.[0]}${u?.last_name?.[0]}`}</Text>
                </View>
            ) : (
                <Image source={{ uri: u.image }} style={styles.avatar} />
            )}
            <View style={styles.roomDetails}>
                <View style={styles.userNameWrapper}>
                    <Text style={styles.userName}>{`${u?.first_name} ${u?.last_name}`}</Text>
                    {room.last_message ? (
                        <View style={styles.lastMessageWrapper}>
                            <Text>{room.last_message.text}</Text>
                        </View>
                    ) : null}
                </View>
                <Text style={styles.lastMessageDate}>
                    {format(
                        room.last_message ? room.last_message.sent_at.toDate() : room.created_at.toDate(),
                        !isToday((room.last_message?.sent_at || room.created_at).toDate()) ? 'dd/MM/yy' : 'HH:mm',
                    )}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    userItem: {
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userNameWrapper: {
        marginLeft: 8,
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#009ff0',
    },
    avatar: {
        height: 52,
        width: 52,
        borderRadius: 26,
        backgroundColor: '#009ff0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 22,
    },
    lastMessageWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 2,
    },
    lastMessageDate: {
        fontSize: 14,
        color: '#5d5d5d',
        marginRight: 12,
    },
    roomDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
})

export default ChatItem

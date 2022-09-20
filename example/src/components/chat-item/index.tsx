import * as React from 'react'
import type * as HaloChat from '@westudents/react-native-halo-chat-core'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, Text, View } from 'react-native'
import { format, isToday } from 'date-fns'
import Avatar from '../avatar'
import { useAuth } from '../../providers/auth'

interface ChatItemProps {
    room: HaloChat.Types.Room
    onPress: () => void
}
const ChatItem = ({ room, onPress }: ChatItemProps): JSX.Element => {
    const { user } = useAuth()
    const u = room.users.find((cu) => cu.id !== user?.id)
    return (
        <TouchableOpacity style={styles.userItem} onPress={onPress}>
            <Avatar user={u} size={52} />
            <View style={styles.roomDetails}>
                <View style={styles.userNameWrapper}>
                    <Text style={styles.userName}>
                        {room.created_by === user?.id
                            ? `${room.tag}`
                            : `${u?.first_name} ${u?.last_name}${
                                  room.scope === 'AGENT' && room.tag ? ` (${room.tag})` : ''
                              }`}
                    </Text>
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

import * as React from 'react'
import type * as HaloChat from '@westudents/react-native-halo-chat-core'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image, StyleSheet, Text, View } from 'react-native'

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
            <View style={styles.userNameWrapper}>
                <Text style={styles.userName}>{`${u?.first_name} ${u?.last_name}`}</Text>
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
    },
    userName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },
    avatar: {
        height: 42,
        width: 42,
        borderRadius: 21,
        backgroundColor: '#009ff0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 22,
    },
})

export default ChatItem

import * as React from 'react'
import type * as HaloChat from '@westudents/react-native-halo-chat-core'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Image, StyleSheet, Text, View } from 'react-native'

interface UserItemProps {
    user: HaloChat.Types.User
    onPress: () => void
}
const UserItem = ({ user, onPress }: UserItemProps): JSX.Element => {
    return (
        <TouchableOpacity style={styles.userItem} onPress={onPress}>
            {user.image === undefined || user.image === null ? (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{`${user.first_name?.[0]}${user.last_name?.[0]}`}</Text>
                </View>
            ) : (
                <Image source={{ uri: user.image }} style={styles.avatar} />
            )}
            <View style={styles.userNameWrapper}>
                <Text style={styles.userName}>{`${user.first_name} ${user.last_name}`}</Text>
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

export default UserItem

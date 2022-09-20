import * as React from 'react'
import type * as HaloChat from '@westudents/react-native-halo-chat-core'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StyleSheet, Text, View } from 'react-native'
import Avatar from '../avatar'

interface UserItemProps {
    user: HaloChat.Types.User
    onPress: () => void
}
const UserItem = ({ user, onPress }: UserItemProps): JSX.Element => {
    return (
        <TouchableOpacity style={styles.userItem} onPress={onPress}>
            <Avatar user={user} size={42} />
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
})

export default UserItem

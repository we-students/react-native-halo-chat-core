import * as React from 'react'
import type * as HaloChat from '@westudents/react-native-halo-chat-core'
import { View, Text, StyleSheet, Image } from 'react-native'

interface AvatarProps {
    user: HaloChat.Types.User | HaloChat.Types.Agent | HaloChat.Types.UserPreview | null | undefined
    size: number
}

const Avatar = ({ user, size }: AvatarProps): JSX.Element => {
    return user?.image === undefined || user?.image === null ? (
        <View
            style={[
                styles.avatar,
                {
                    height: size,
                    width: size,
                    borderRadius: size / 2,
                },
            ]}>
            <Text style={styles.avatarText}>{`${user?.first_name?.[0]}${user?.last_name?.[0]}`}</Text>
        </View>
    ) : (
        <Image
            source={{ uri: user.image }}
            style={[
                styles.avatar,
                {
                    height: size,
                    width: size,
                    borderRadius: size / 2,
                },
            ]}
        />
    )
}

const styles = StyleSheet.create({
    avatar: {
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

export default Avatar

import type { ScreenProps } from '../../types'
import * as React from 'react'
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { createRoomWithUsers, fetchUsers, User } from 'react-native-firebase-chat-sdk'
import { useUser } from '../../providers/user'
import { StackActions } from '@react-navigation/native'

const CreateChatScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const { user } = useUser()

    const [users, setUsers] = React.useState<User[]>()

    React.useEffect(() => {
        fetchUsers(
            (newUsers) => setUsers(newUsers.filter((u) => u.id !== user?.id)),
            () => {
                // handle error
            },
        )
    }, [user?.id])

    const handleCreateChat = React.useCallback(
        async (otherUser: User): Promise<void> => {
            if (user) {
                const room = await createRoomWithUsers([otherUser])
                navigation.dispatch(StackActions.replace('Chat', { room }))
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user],
    )

    const renderUser = React.useCallback(
        ({ item }: { item: User }): JSX.Element => {
            return (
                <TouchableOpacity
                    style={styles.userItem}
                    onPress={(): void => {
                        handleCreateChat(item)
                    }}>
                    <Text style={styles.userName}>{`${item.first_name} ${item.last_name}`}</Text>
                </TouchableOpacity>
            )
        },
        [handleCreateChat],
    )

    const renderDivider = React.useCallback((): JSX.Element => <View style={styles.divider} />, [])

    const handleBack = (): void => {
        navigation.goBack()
    }

    return (
        <View style={styles.screenContainer}>
            <FlatList
                data={users}
                renderItem={renderUser}
                ItemSeparatorComponent={renderDivider}
                ListFooterComponent={<Button title="back" onPress={handleBack} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: '#4f4f4f',
    },
    userItem: {
        paddingVertical: 12,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: '500',
    },
})

export default CreateChatScreen

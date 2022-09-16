import type { ScreenProps } from '../../types'
import * as React from 'react'
import { Button, FlatList, StyleSheet, View } from 'react-native'
import { createRoomWithUsers, fetchUsers, User } from '@westudents/react-native-halo-chat-core'
import { useUser } from '../../providers/user'
import { StackActions } from '@react-navigation/native'
import UserItem from '../../components/user-item'

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
                <UserItem
                    user={item}
                    onPress={(): void => {
                        handleCreateChat(item)
                    }}
                />
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
        height: 4,
    },
    userItem: {
        paddingVertical: 12,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 16,
        color: '#000',
    },
    userName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },
})

export default CreateChatScreen

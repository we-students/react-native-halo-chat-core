import type { ScreenProps } from '../../types'
import * as React from 'react'
import { Button, FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import * as HaloChat from '@westudents/react-native-halo-chat-core'
import { useUser } from '../../providers/user'
import { StackActions } from '@react-navigation/native'
import UserItem from '../../components/user-item'

const CreateChatScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const { user } = useUser()

    const [users, setUsers] = React.useState<HaloChat.Types.User[]>()

    React.useEffect(() => {
        HaloChat.UserActions.fetchUsers(
            (newUsers) => setUsers(newUsers.filter((u) => u.id !== user?.id)),
            () => {
                // handle error
            },
        )
    }, [user?.id])

    const handleCreateChat = React.useCallback(
        async (otherUser: HaloChat.Types.User): Promise<void> => {
            if (user) {
                const room = await HaloChat.RoomActions.createRoomWithUsers([otherUser])
                navigation.dispatch(StackActions.replace('Chat', { room }))
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user],
    )

    const renderUser = React.useCallback(
        ({ item }: { item: HaloChat.Types.User }): JSX.Element => {
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
            <View style={styles.header}>
                <Text style={styles.title}>Create Chat</Text>
            </View>
            <FlatList
                data={users}
                contentContainerStyle={styles.scrollContenr}
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
        backgroundColor: '#fff',
    },
    divider: {
        height: 4,
    },
    userItem: {
        paddingVertical: 12,
    },
    scrollContenr: {
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 16,
        color: '#fff',
    },
    userName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },
    header: {
        height: Platform.OS === 'ios' ? 150 : 120,
        backgroundColor: '#005ff0',
        paddingHorizontal: 25,
        justifyContent: 'flex-end',
    },
})

export default CreateChatScreen

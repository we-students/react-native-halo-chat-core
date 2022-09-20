import type { ScreenProps } from '../../types'
import * as React from 'react'
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import * as HaloChat from '@westudents/react-native-halo-chat-core'
import { useAuth } from '../../providers/auth'
import { StackActions } from '@react-navigation/native'
import UserItem from '../../components/user-item'
import Button from '../../components/button'
import TagSelector from '../../components/tag-selector'

const CreateChatScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const { user } = useAuth()

    const [users, setUsers] = React.useState<HaloChat.Types.User[]>()

    const [selectedTag, setSelectedTag] = React.useState<string>()

    React.useEffect(() => {
        HaloChat.UserActions.fetchUsers(
            (newUsers) =>
                setUsers(
                    newUsers
                        .filter((u) => u.id !== user?.id)
                        .sort((u1, u2) => {
                            if (u1.last_name === null && u2.last_name !== null) return -1
                            else if (u1.last_name !== null && u2.last_name === null) return 1
                            else if (u1.last_name === null && u2.last_name === null) {
                                if (u1.first_name === null && u2.first_name !== null) return -1
                                else if (u1.first_name !== null && u2.first_name === null) return 1
                                else return 0
                            } else if (u1.last_name! < u2.last_name!) return -1
                            else if (u1.last_name! > u2.last_name!) return 1
                            else {
                                if (u1.first_name! < u2.first_name!) return -1
                                else if (u1.first_name! > u2.first_name!) return 1
                                else return 0
                            }
                        }),
                ),
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

    const handleCreateAgentChat = async (): Promise<void> => {
        if (selectedTag) {
            const room = await HaloChat.RoomActions.createRoomWithAgent(selectedTag)
            navigation.dispatch(StackActions.replace('Chat', { room }))
        }
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
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        <Text style={styles.listHeaderTitle}>Customer Service Chat</Text>
                        <Text>Select the issue scope and open a chat with an agent</Text>
                        <TagSelector onSelect={(tags): void => setSelectedTag(tags.length > 0 ? tags[0] : undefined)} />
                        <Button
                            title="create agent chat"
                            onPress={handleCreateAgentChat}
                            disabled={selectedTag === undefined}
                            style={styles.createChatButton}
                        />
                        <View style={styles.listHeaderDivider} />
                        <Text style={styles.listHeaderTitle}>User to User Chat</Text>
                    </View>
                }
                ListFooterComponent={
                    <Button title="back" onPress={handleBack} style={styles.backButton} status="secondary" />
                }
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
    backButton: { marginBottom: 32 },
    listHeader: {
        paddingTop: 16,
    },
    listHeaderTitle: {
        marginBottom: 4,
        fontSize: 18,
        fontWeight: '700',
    },
    listHeaderDivider: {
        height: 1,
        backgroundColor: '#005aa0',
        marginVertical: 16,
    },
    createChatButton: {
        marginTop: 12,
        marginBottom: 0,
    },
})

export default CreateChatScreen

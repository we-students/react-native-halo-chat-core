import { useAuth } from '../../providers/auth'
import * as React from 'react'
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth'
import * as HaloChat from '@westudents/react-native-halo-chat-core'
import type { ScreenProps } from '../../types'
import ChatItem from '../../components/chat-item'
import Avatar from '../../components/avatar'
import Button from '../../components/button'

const HomeScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const { user, agent, isAgent } = useAuth()
    const [rooms, setRooms] = React.useState<HaloChat.Types.Room[]>()

    const signOut = (): void => {
        auth().signOut()
    }

    React.useEffect(() => {
        if (isAgent && agent)
            HaloChat.RoomActions.fetchAgentRooms(
                agent,
                (updatedRooms) => {
                    console.log('updated agent rooms', updatedRooms)
                    setRooms(
                        updatedRooms.sort((r1, r2) => {
                            const r1Time = r1.last_message
                                ? r1.last_message.sent_at.toDate().getTime()
                                : r1.created_at.toDate().getTime()
                            const r2Time = r2.last_message
                                ? r2.last_message.sent_at.toDate().getTime()
                                : r2.created_at.toDate().getTime()
                            return r2Time - r1Time
                        }),
                    )
                },
                () => {
                    // handle error
                },
            )
        else
            HaloChat.RoomActions.fetchRooms(
                (updatedRooms) =>
                    setRooms(
                        updatedRooms.sort((r1, r2) => {
                            const r1Time = r1.last_message
                                ? r1.last_message.sent_at.toDate().getTime()
                                : r1.created_at.toDate().getTime()
                            const r2Time = r2.last_message
                                ? r2.last_message.sent_at.toDate().getTime()
                                : r2.created_at.toDate().getTime()
                            return r2Time - r1Time
                        }),
                    ),
                () => {
                    // handle error
                },
            )
    }, [isAgent, agent])

    const renderUser = React.useCallback(
        ({ item }: { item: HaloChat.Types.Room }): JSX.Element | null => {
            return <ChatItem room={item} onPress={(): void => navigation.navigate('Chat', { room: item })} />
        },
        [navigation],
    )

    const renderDivider = React.useCallback((): JSX.Element => <View style={styles.divider} />, [])

    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                {user || agent ? (
                    <>
                        <Avatar user={user || agent} size={42} />
                        <Text style={styles.title}>{`Ciao ${(user || agent)?.first_name} ${
                            (user || agent)?.last_name
                        }`}</Text>
                    </>
                ) : undefined}
            </View>
            <FlatList
                data={rooms}
                renderItem={renderUser}
                contentContainerStyle={styles.scrollContainer}
                ItemSeparatorComponent={renderDivider}
                ListFooterComponent={
                    <>
                        {!isAgent ? (
                            <Button title="create chat" onPress={(): void => navigation.navigate('CreateChat')} />
                        ) : null}
                        <Button title="sign out" onPress={signOut} status="secondary" />
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.chatPlaceholder}>
                        <Text style={styles.placeholderText}>No availables chat</Text>
                    </View>
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
        height: 8,
    },
    scrollContainer: {
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 16,
        color: '#fff',
    },
    chatPlaceholder: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    placeholderText: {
        color: '#000',
    },
    header: {
        height: Platform.OS === 'ios' ? 150 : 120,
        backgroundColor: '#005ff0',
        paddingHorizontal: 25,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
})

export default HomeScreen

import { useUser } from '../../providers/user'
import * as React from 'react'
import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth'
import { Room, fetchRooms } from '@westudents/react-native-halo-chat-core'
import type { ScreenProps } from '../../types'
import ChatItem from '../../components/chat-item'

const HomeScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const { user } = useUser()
    const [rooms, setRooms] = React.useState<Room[]>()

    const signOut = (): void => {
        auth().signOut()
    }

    React.useEffect(() => {
        fetchRooms(setRooms, () => {
            // handle error
        })
    }, [])

    const renderUser = React.useCallback(
        ({ item }: { item: Room }): JSX.Element | null => {
            return user ? (
                <ChatItem user={user} room={item} onPress={(): void => navigation.navigate('Chat', { room: item })} />
            ) : null
        },
        [navigation, user],
    )

    const renderDivider = React.useCallback((): JSX.Element => <View style={styles.divider} />, [])

    return (
        <View style={styles.screenContainer}>
            <FlatList
                data={rooms}
                renderItem={renderUser}
                ItemSeparatorComponent={renderDivider}
                ListHeaderComponent={
                    user ? <Text style={styles.title}>{`Ciao ${user?.first_name} ${user?.last_name}`}</Text> : undefined
                }
                ListFooterComponent={
                    <>
                        <Button title="create chat" onPress={(): void => navigation.navigate('CreateChat')} />
                        <Button title="sign out" onPress={signOut} color="#a1a1a1" />
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
        paddingHorizontal: 25,
        backgroundColor: '#fff',
    },
    divider: {
        height: 8,
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
    chatPlaceholder: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    placeholderText: {
        color: '#000',
    },
})

export default HomeScreen

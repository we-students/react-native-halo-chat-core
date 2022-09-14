import { useUser } from '../../providers/user'
import * as React from 'react'
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth'
import { Room, fetchRooms } from 'react-native-firebase-chat-sdk'
import type { ScreenProps } from '../../types'

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
        ({ item }: { item: Room }): JSX.Element => {
            const u = item.users.find((cu) => cu.id !== user?.id)
            return (
                <TouchableOpacity
                    style={styles.userItem}
                    onPress={(): void => navigation.navigate('Chat', { room: item })}>
                    <Text style={styles.userName}>{`${u?.first_name} ${u?.last_name}`}</Text>
                </TouchableOpacity>
            )
        },
        [navigation, user?.id],
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
                        <Text>No availables chat</Text>
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
    chatPlaceholder: {
        alignItems: 'center',
        paddingVertical: 32,
    },
})

export default HomeScreen

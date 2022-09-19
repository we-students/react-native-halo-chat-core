import { useUser } from '../../providers/user'
import * as React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth'
import * as HaloChat from '@westudents/react-native-halo-chat-core'

const firstNames = ['Paolo', 'Matteo', 'Rocco', 'Giuseppe', 'Giorgia', 'Federica', 'Ferdinando']
const lastNames = ['Giardino', 'Destefains', 'Di Bello', 'Morabito', 'Scarcella', 'Sapino', 'Nocera']

const randomFirstName = (): string | undefined => {
    return firstNames[Math.floor(Math.random() * firstNames.length)]
}

const randomLastName = (): string | undefined => {
    return lastNames[Math.floor(Math.random() * lastNames.length)]
}

const LoginScreen = (): JSX.Element => {
    const { setUser } = useUser()

    const signIn = async (): Promise<void> => {
        const userCredentials = await auth().signInAnonymously()
        const u = await HaloChat.UserActions.createUser({
            id: userCredentials.user.uid,
            firstName: randomFirstName(),
            lastName: randomLastName(),
            image: `https://i.pravatar.cc/150?img=${Math.ceil(Math.random() * 69)}`,
        })
        setUser(u)
    }

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.title}>React Native Firebase Chat SDK</Text>

            <Button title="sign in" onPress={signIn} />
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: { textAlign: 'center', fontSize: 28, fontWeight: '700', color: '#000' },
})

export default LoginScreen

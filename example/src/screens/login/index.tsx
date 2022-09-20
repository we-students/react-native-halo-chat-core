import { useAuth } from '../../providers/auth'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth'
import * as HaloChat from '@westudents/react-native-halo-chat-core'
import { randomFirstName, randomLastName } from '../../utils'
import Button from '../../components/button'
import TagSelector from '../../components/tag-selector'
import type { ScreenProps } from 'example/src/types'

const LoginScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const { setUser, setAgent, isAgent } = useAuth()
    const [tags, setTags] = React.useState<string[]>()

    const signIn = async (): Promise<void> => {
        const userCredentials = await auth().signInAnonymously()
        if (isAgent && tags) {
            const a = await HaloChat.AgentActions.createAgent({
                id: userCredentials.user.uid,
                firstName: randomFirstName(),
                lastName: randomLastName(),
                tags,
                image: 'https://firebasestorage.googleapis.com/v0/b/react-native-firebase-chat-sdk.appspot.com/o/federica.jpeg?alt=media&token=ba54ed01-4aa1-477f-8eae-78bfca3d0967',
            })
            setAgent(a)
        } else {
            const u = await HaloChat.UserActions.createUser({
                id: userCredentials.user.uid,
                firstName: randomFirstName(),
                lastName: randomLastName(),
                image: `https://i.pravatar.cc/150?img=${Math.ceil(Math.random() * 69)}`,
            })
            setUser(u)
        }
    }

    return (
        <View style={styles.screenContainer}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>React Native Firebase Chat SDK</Text>
                <Text style={styles.subtitle}>{isAgent ? 'AGENT' : 'CUSTOMER'}</Text>
            </View>
            {isAgent ? <TagSelector onSelect={setTags} multiple /> : null}
            <View>
                <Button
                    title="sign in"
                    onPress={signIn}
                    disabled={isAgent && (tags === undefined || tags.length === 0)}
                />
                <Button title="back" status="secondary" onPress={(): void => navigation.goBack()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: '#fff',
        paddingTop: 80,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    titleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: { textAlign: 'center', fontSize: 28, fontWeight: '700', color: '#000' },
    subtitle: { textAlign: 'center', fontSize: 22, fontWeight: '500', color: '#999' },
})

export default LoginScreen

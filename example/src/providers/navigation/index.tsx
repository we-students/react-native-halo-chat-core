import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import * as HaloChat from '@westudents/react-native-halo-chat-core'
import { useUser } from '../user'

const Stack = createStackNavigator()

const LoggedStack = (): JSX.Element => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
            <Stack.Screen name="Home" getComponent={(): React.ComponentType => require('../../screens/home').default} />
            <Stack.Screen
                name="CreateChat"
                getComponent={(): React.ComponentType => require('../../screens/create-chat').default}
            />
            <Stack.Screen name="Chat" getComponent={(): React.ComponentType => require('../../screens/chat').default} />
        </Stack.Navigator>
    )
}

const LoginStack = (): JSX.Element => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
            <Stack.Screen
                name="Login"
                getComponent={(): React.ComponentType => require('../../screens/login').default}
            />
        </Stack.Navigator>
    )
}
const NavigationProvider = (): JSX.Element => {
    const [logged, setLogged] = React.useState<boolean>(false)
    const { setUser } = useUser()

    React.useEffect(() => {
        const handleOnAuthStateChanged = (fbUser: FirebaseAuthTypes.User | null): void => {
            setLogged(fbUser !== null)
            if (fbUser) {
                HaloChat.UserActions.getUser(fbUser.uid).then((user) => setUser(user))
            }
        }
        const subscriber = auth().onAuthStateChanged(handleOnAuthStateChanged)

        return subscriber
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <NavigationContainer>{logged ? <LoggedStack /> : <LoginStack />}</NavigationContainer>
}

export default NavigationProvider

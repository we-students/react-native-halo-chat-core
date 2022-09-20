import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import * as HaloChat from '@westudents/react-native-halo-chat-core'
import { useAuth } from '../auth'

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
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
            <Stack.Screen
                name="Landing"
                getComponent={(): React.ComponentType => require('../../screens/landing').default}
            />
            <Stack.Screen
                name="Login"
                getComponent={(): React.ComponentType => require('../../screens/login').default}
            />
        </Stack.Navigator>
    )
}

const NavigationProvider = (): JSX.Element => {
    const [logged, setLogged] = React.useState<boolean>(false)
    const { setUser, setAgent, isAgent, setIsAgent } = useAuth()

    React.useEffect(() => {
        const handleOnAuthStateChanged = (fbUser: FirebaseAuthTypes.User | null): void => {
            setLogged(fbUser !== null)
            if (fbUser) {
                if (isAgent) HaloChat.AgentActions.getAgent(fbUser.uid).then((agent) => setAgent(agent))
                else HaloChat.UserActions.getUser(fbUser.uid).then((user) => setUser(user))
            } else {
                setUser(undefined)
                setAgent(undefined)
                setIsAgent(false)
            }
        }
        const subscriber = auth().onAuthStateChanged(handleOnAuthStateChanged)

        return subscriber
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (auth().currentUser !== null && isAgent) {
            HaloChat.AgentActions.getAgent(auth().currentUser!.uid).then((agent) => setAgent(agent))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAgent])

    return <NavigationContainer>{logged ? <LoggedStack /> : <LoginStack />}</NavigationContainer>
}

export default NavigationProvider

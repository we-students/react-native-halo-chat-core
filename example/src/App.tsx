import * as React from 'react'
import { StatusBar } from 'react-native'

import { SafeAreaProvider } from 'react-native-safe-area-context'
import NavigationProvider from './providers/navigation'
import UserProvider from './providers/user'

export default function App(): JSX.Element {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" translucent={true} animated={true} backgroundColor="transparent" />
            <UserProvider>
                <NavigationProvider />
            </UserProvider>
        </SafeAreaProvider>
    )
}

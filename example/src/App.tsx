import * as React from 'react'

import { StyleSheet, View } from 'react-native'
import NavigationProvider from './providers/navigation'
import UserProvider from './providers/user'

export default function App(): JSX.Element {
    return (
        <View style={styles.container}>
            <UserProvider>
                <NavigationProvider />
            </UserProvider>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff',
    },
    title: { textAlign: 'center', fontSize: 28, fontWeight: '700' },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
})

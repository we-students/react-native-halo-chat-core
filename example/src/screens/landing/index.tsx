import Button from '../../components/button'
import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { ScreenProps } from 'example/src/types'
import { useAuth } from '../../providers/auth'

const LandingScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const { setIsAgent } = useAuth()
    const handleNavigation = (agent: boolean): void => {
        setIsAgent(agent)
        navigation.navigate('Login')
    }

    return (
        <View style={styles.screenContainer}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>React Native Firebase Chat SDK</Text>
            </View>

            <Button title="user" onPress={(): void => handleNavigation(false)} />
            <Button title="agent" onPress={(): void => handleNavigation(true)} status="secondary" />
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: '#fff',
        paddingBottom: 40,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    title: { textAlign: 'center', fontSize: 28, fontWeight: '700', color: '#000' },
})

export default LandingScreen

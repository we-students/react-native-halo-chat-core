import * as React from 'react'
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native'

interface ButtonProps {
    title: string
    onPress: () => void
    status?: 'primary' | 'secondary'
    style?: ViewStyle
    disabled?: boolean
}

const Button = ({ title, onPress, status = 'primary', style, disabled = false }: ButtonProps): JSX.Element => {
    const [pressed, setPressed] = React.useState<boolean>(false)

    const backgroundColor = React.useMemo(() => {
        if (disabled) return '#d0d0d0'
        if (status === 'primary') {
            return pressed ? '#009ff0' : '#005ff0'
        } else {
            return pressed ? '#5d5d5d' : '#3c3c3c'
        }
    }, [pressed, status, disabled])

    const handleOnPress = React.useCallback((): void => {
        if (!disabled) onPress()
    }, [disabled, onPress])

    return (
        <Pressable
            style={[
                styles.container,
                {
                    backgroundColor,
                },
                style,
            ]}
            onPress={handleOnPress}
            onPressIn={(): void => setPressed(true)}
            onPressOut={(): void => setPressed(false)}>
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#005ff0',
        minHeight: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
        borderRadius: 10,
    },
    title: {
        color: 'white',
        fontWeight: '500',
        textTransform: 'uppercase',
    },
})

export default Button

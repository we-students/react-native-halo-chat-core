import * as React from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import * as HeroIcons from 'react-native-heroicons/outline'

interface ChatInputProps {
    onSendMessage: (text: string) => void
}

const ChatInput = ({ onSendMessage }: ChatInputProps): JSX.Element => {
    const [text, setText] = React.useState<string>()

    const handleSendMessagePressed = (): void => {
        if (text !== undefined && text.trim().length >= 0) {
            onSendMessage(text)
            setText(undefined)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.nestedContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder="Message"
                        placeholderTextColor="#009ff0"
                        style={styles.input}
                    />
                </View>
                <TouchableOpacity
                    style={styles.iconWrapper}
                    onPress={handleSendMessagePressed}
                    disabled={text === undefined || text.trim().length === 0}>
                    <HeroIcons.PaperAirplaneIcon color="#005ff0" size={26} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        paddingBottom: 50,
        backgroundColor: '#005ff0',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
    },

    nestedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 100,
        height: 34,
        justifyContent: 'center',
        marginRight: 8,
    },
    iconWrapper: {
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 100,
    },
    input: {
        color: '#005ff0',
    },
})

export default ChatInput

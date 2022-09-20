/* eslint-disable react-native/no-inline-styles */
import * as React from 'react'
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native'

const tags = [
    ['SALES', 'ADS'],
    ['TECH', 'PAYMENT'],
    ['REPORT', 'GENERIC ISSUE'],
]

interface TagProps {
    tag: string
    selected: boolean
    onPress: (tag: string) => void
}

interface TagSelectorProps {
    onSelect: (tags: string[]) => void
    multiple?: boolean
}

const Tag = ({ tag, selected, onPress }: TagProps): JSX.Element => {
    return (
        <Pressable
            style={[
                styles.tag,
                {
                    backgroundColor: selected ? '#005ff0' : '#c3c3c3',
                },
            ]}
            onPress={(): void => onPress(tag)}>
            <Text style={{ color: selected ? '#fff' : '#000' }}>{tag}</Text>
        </Pressable>
    )
}
const TagSelector = ({ onSelect, multiple = false }: TagSelectorProps): JSX.Element => {
    const [selectedTags, setSelectedTags] = React.useState<string[]>([])

    const handlePress = (tag: string): void => {
        if (selectedTags.includes(tag)) {
            setSelectedTags((current) => current.filter((t) => t !== tag))
        } else setSelectedTags((current) => (multiple ? [...current, tag] : [tag]))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => onSelect(selectedTags), [selectedTags])

    const renderItem = ({ item }: { item: string[] }): JSX.Element => {
        return (
            <View style={styles.row}>
                <Tag tag={item[0]!} selected={selectedTags.includes(item[0]!)} onPress={handlePress} />
                <Tag tag={item[1]!} selected={selectedTags.includes(item[1]!)} onPress={handlePress} />
            </View>
        )
    }
    return (
        <View>
            <Text style={styles.title}>Select tags</Text>
            <FlatList data={tags} renderItem={renderItem} />
        </View>
    )
}

const styles = StyleSheet.create({
    title: { textAlign: 'center', marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-around' },
    tag: {
        height: 32,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
        borderRadius: 8,
    },
})

export default TagSelector

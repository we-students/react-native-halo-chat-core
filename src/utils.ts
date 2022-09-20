import type { User, UserPreview } from './types'

export const CollectionName = {
    AGENTS: 'agents',
    MESSAGES: 'messages',
    ROOMS: 'rooms',
    USERS: 'users',
}

export const MessageTypeEmoji = {
    TEXT: undefined,
    AUDIO: '🎙',
    IMAGE: '📷',
    VIDEO: '📹',
    CUSTOM: '📎',
}

export const userToPreview = (user: User): UserPreview => {
    const { id, first_name, last_name, image } = user
    return { id, first_name, last_name, image }
}

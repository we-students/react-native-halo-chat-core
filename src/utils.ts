import type { User, UserPreview } from './types'

export const CollectionName = {
    USERS: 'users',
    ROOMS: 'rooms',
    MESSAGES: 'messages',
}

export const userToPreview = (user: User): UserPreview => {
    const { id, first_name, last_name, image } = user
    return { id, first_name, last_name, image }
}

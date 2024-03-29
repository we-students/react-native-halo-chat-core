/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export interface User {
    id: string
    first_name: string | null
    last_name: string | null
    image: string | null
    created_at: FirebaseFirestoreTypes.Timestamp
    device_token: string | null
}

export interface UserPreview {
    id: string
    first_name: string | null
    last_name: string | null
    image: string | null
}

export interface Agent {
    id: string
    first_name: string
    last_name: string
    image: string | null
    created_at: FirebaseFirestoreTypes.Timestamp
    tags: string[]
    device_token: string | null
}

export interface Room {
    id: string
    created_by: string
    created_at: FirebaseFirestoreTypes.Timestamp
    users_ids: string[]
    users: UserPreview[]
    scope: 'PRIVATE' | 'GROUP' | 'AGENT'
    tag: string | null
    name: string | null
    agent: UserPreview | null
    last_message: {
        id: string
        text: string | null
        type: MessageType.ContentType
        sent_by: string
        sent_at: FirebaseFirestoreTypes.Timestamp
    } | null
}

export namespace MessageType {
    export type Any = Text | File | Custom
    export type ContentType = 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'CUSTOM'

    interface Base {
        id: string
        content_type: ContentType
        created_by: string
        room: string
        text: string | null
        metadata: Record<string, any> | null
        delivered: boolean
        read: boolean
        created_at: FirebaseFirestoreTypes.Timestamp
        updated_at: FirebaseFirestoreTypes.Timestamp
    }

    export interface Text extends Base {
        text: string
        content_type: 'TEXT'
    }

    export interface File extends Base {
        content_type: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'CUSTOM'
        file: {
            uri: string
            mimeType: string | null
            name: string
        }
    }

    export interface Custom extends Base {
        content_type: 'CUSTOM'
        uri: string | null
        metadata: Record<string, any>
    }
}

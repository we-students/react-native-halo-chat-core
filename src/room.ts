import type { MessageType, Room, User } from './types'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { CollectionName, userToPreview } from './utils'
import auth from '@react-native-firebase/auth'
import { getUser } from './user'

export const createRoomWithUsers = async (users: User[], name?: string): Promise<Room> => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('createRoomWithUsers: Firebase user not authenticated')
    const creator = await getUser(currentFirebaseUser.uid)
    if (creator === null) throw new Error('createRoomWithUsers: user not exists')
    if (users.length === 0) throw new Error('createRoomWithUsers: no users selected')

    // if room is private, check if already exists
    if (users.length === 1) {
        const snapshot = await firestore()
            .collection(CollectionName.ROOMS)
            .where('scope', '==', 'PRIVATE')
            .where('users_ids', 'array-contains', currentFirebaseUser.uid)
            .get()
        const existingRoom = snapshot.docs.find((d) => (d.data() as Room).users.some((u) => u.id === users[0]?.id))
        if (existingRoom) return existingRoom.data() as Room
    }

    const docRef = firestore().collection(CollectionName.ROOMS).doc()
    const room: Room = {
        id: docRef.id,
        created_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        created_by: creator.id,
        users: [userToPreview(creator), ...users.map((u) => userToPreview(u))],
        users_ids: [creator.id, ...users.map((u) => u.id)],
        scope: users.length > 1 ? 'GROUP' : 'PRIVATE',
        tags: null,
        name: name || null,
        last_message: null,
    }
    await docRef.set(room)
    return room
}

export const createRoomWithAgent = async (tags: string[]): Promise<Room> => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('createRoomWithUsers: Firebase user not authenticated')
    const creator = await getUser(currentFirebaseUser.uid)
    if (creator === null) throw new Error('createRoomWithUsers: user not exists')
    const docRef = firestore().collection(CollectionName.ROOMS).doc()
    const room: Room = {
        id: docRef.id,
        created_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        created_by: creator.id,
        users: [userToPreview(creator)],
        users_ids: [creator.id],
        scope: 'AGENT',
        tags,
        name: null,
        last_message: null,
    }
    await docRef.set(room)
    return room
}

export const fetchRooms = async (onRoomsUpdate: (rooms: Room[]) => void, onError: () => void): Promise<void> => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('createRoomWithUsers: Firebase user not authenticated')

    firestore()
        .collection(CollectionName.ROOMS)
        .where('users_ids', 'array-contains', currentFirebaseUser.uid)
        .onSnapshot((snapshop) => {
            onRoomsUpdate(snapshop.docs.map((rDoc) => rDoc.data() as Room))
        }, onError)
}

export const sendTextMessage = async ({
    roomId,
    text,
    metadata,
}: {
    roomId: string
    text: string
    metadata?: Record<string, any>
}): Promise<void> => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('createRoomWithUsers: Firebase user not authenticated')

    const messageDocRef = firestore()
        .collection(CollectionName.ROOMS)
        .doc(roomId)
        .collection(CollectionName.MESSAGES)
        .doc()

    const message: MessageType.Text = {
        id: messageDocRef.id,
        text,
        created_by: currentFirebaseUser.uid,
        created_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        updated_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        metadata: metadata || null,
        room: roomId,
        content_type: 'TEXT',
        delivered: false,
        read: false,
        deleted_by: [],
    }

    await messageDocRef.set(message)
}

export const messageDelivered = async (roomId: string, messageId: string): Promise<void> => {
    await firestore()
        .collection(CollectionName.ROOMS)
        .doc(roomId)
        .collection(CollectionName.MESSAGES)
        .doc(messageId)
        .update({ delivered: true })
}

export const messageRead = async (roomId: string, messageId: string): Promise<void> => {
    await firestore()
        .collection(CollectionName.ROOMS)
        .doc(roomId)
        .collection(CollectionName.MESSAGES)
        .doc(messageId)
        .update({ read: true })
}

export const fetchMessages = (
    roomId: string,
    onMessagesUpdate: (messages: MessageType.Any[]) => void,
    onError: (error: Error) => void,
): void => {
    firestore()
        .collection(CollectionName.ROOMS)
        .doc(roomId)
        .collection(CollectionName.MESSAGES)
        .onSnapshot((snapshot) => onMessagesUpdate(snapshot.docs.map((d) => d.data() as MessageType.Any)), onError)
}

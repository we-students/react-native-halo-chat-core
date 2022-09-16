import type { MessageType, Room, User } from './types'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { CollectionName, userToPreview } from './utils'
import auth from '@react-native-firebase/auth'
import { getUser } from './user'
import { Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

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

export const sendFileMessage = async ({
    roomId,
    text,
    file,
    metadata,
}: {
    roomId: string
    text?: string
    file: {
        filename: string
        uri: string
        mimeType: string
    }
    metadata?: Record<string, any>
}): Promise<void> => {
    // todo:
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('createRoomWithUsers: Firebase user not authenticated')

    let content_type: 'AUDIO' | 'VIDEO' | 'IMAGE' | 'CUSTOM' = 'CUSTOM'
    if (file.mimeType.match(/^image\//)) {
        content_type = 'IMAGE'
    } else if (file.mimeType.match(/^video\//)) {
        content_type = 'VIDEO'
    } else if (file.mimeType.match(/^audio\//)) {
        content_type = 'AUDIO'
    }

    if (content_type !== 'IMAGE' && content_type !== 'VIDEO' && content_type !== 'AUDIO') return

    let docPath = file.filename
    switch (content_type) {
        case 'IMAGE':
            docPath = `/${roomId}/images/` + docPath
            break
        case 'VIDEO':
            docPath = `/${roomId}/videos/` + docPath
            break
        case 'AUDIO':
            docPath = `/${roomId}/audios/` + docPath
            break
    }

    const attachmentRef = storage().ref(docPath)

    const uri = Platform.OS === 'ios' ? file.uri : (await RNFetchBlob.fs.stat(file.uri)).path
    await attachmentRef.putFile(uri)

    const messageDocRef = firestore()
        .collection(CollectionName.ROOMS)
        .doc(roomId)
        .collection(CollectionName.MESSAGES)
        .doc()

    const message: MessageType.File = {
        id: messageDocRef.id,
        room: roomId,
        content_type,
        text: text || null,
        created_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        updated_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        created_by: currentFirebaseUser.uid,
        file: {
            mimeType: file.mimeType,
            name: file.filename,
            uri: await attachmentRef.getDownloadURL(),
        },
        deleted_by: [],
        delivered: false,
        read: false,
        metadata: metadata || null,
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
        .onSnapshot(
            (snapshot) =>
                onMessagesUpdate(
                    snapshot.docs
                        .map((d) => d.data() as MessageType.Any)
                        .filter((m) => m.created_at !== null)
                        .sort((m1, m2) => m2.created_at.toDate().getTime() - m1.created_at.toDate().getTime()),
                ),
            onError,
        )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MessageType, Room, User, Agent, UserPreview } from './types'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { CollectionName, MessageTypeEmoji, userToPreview } from './utils'
import auth from '@react-native-firebase/auth'
import { getUser } from './user'
import { Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import { getAgent } from './agent'

/**
 * It creates a room with the given users
 * @param {User[]} users - User[] - an array of users to add to the room
 * @param {string} [name] - The name of the room.
 * @returns A promise that resolves to a room object
 */
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
        removed_users_ids: [],
        scope: users.length > 1 ? 'GROUP' : 'PRIVATE',
        tag: null,
        name: name || null,
        last_message: null,
        agent: null,
        metadata: null,
    }
    await docRef.set(room)
    return room
}

/**
 * It creates a room with the current user and the agent
 * @param {string[]} tag - string
 * @returns A room object
 */
export const createRoomWithAgent = async (tag: string): Promise<Room> => {
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
        removed_users_ids: [],
        scope: 'AGENT',
        tag,
        name: null,
        last_message: null,
        agent: null,
        metadata: null,
    }
    await docRef.set(room)
    return room
}

export const joinAgent = async (roomId: string): Promise<Room> => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('createRoomWithUsers: Firebase user not authenticated')
    const agent = await getAgent(currentFirebaseUser.uid)
    if (agent === null) throw new Error('joinAgent: agent not exists')

    await firestore()
        .collection(CollectionName.ROOMS)
        .doc(roomId)
        .update({
            agent: {
                id: agent.id,
                first_name: agent.first_name,
                last_name: agent.last_name,
                image: agent.image,
            },
        })

    const res = await firestore().collection(CollectionName.ROOMS).doc(roomId).get()
    return res.data() as Room
}

export const joinUser = async (roomId: string): Promise<Room> => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('joinUser: Firebase user not authenticated')
    const user = await getUser(currentFirebaseUser.uid)
    if (user === null) throw new Error('joinUser: user not exists')

    const oldRoom = (await (await firestore().collection(CollectionName.ROOMS).doc(roomId).get()).data()) as Room

    const usersIds = [...oldRoom.users_ids, user.id]

    await firestore().collection(CollectionName.ROOMS).doc(roomId).update({
        users_ids: usersIds,
    })

    const res = (await (await firestore().collection(CollectionName.ROOMS).doc(roomId).get()).data()) as Room

    const users: UserPreview[] = []

    for (const uid of usersIds) {
        const u = await getUser(uid)
        users.push(userToPreview(u))
    }

    return { ...res, users }
}

/**
 * It fetches all the rooms that the current user is a member of, and then calls the onRoomsUpdate
 * callback with the list of rooms
 *
 * The onRoomsUpdate function is called whenever the data changes. The onError function is called
 * whenever an error occurs
 * @param onRoomsUpdate - (rooms: Room[]) => void
 * @param onError - (error: Error) => void
 */
export const fetchRooms = (onRoomsUpdate: (rooms: Room[]) => void, onError: (error: Error) => void): void => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('createRoomWithUsers: Firebase user not authenticated')

    firestore()
        .collection(CollectionName.ROOMS)
        .where('users_ids', 'array-contains', currentFirebaseUser.uid)
        .onSnapshot(async (snapshop) => {
            const snapshotData = snapshop.docs.map((rDoc) => rDoc.data() as Room).filter((r) => r.created_at !== null)

            const rooms: Room[] = []

            for (const rData of snapshotData) {
                const users: UserPreview[] = []
                for (const uid of rData.users_ids) {
                    users.push(userToPreview(await getUser(uid)))
                }
                for (const uid of rData.removed_users_ids) {
                    users.push(userToPreview(await getUser(uid)))
                }
                rooms.push({ ...rData, users })
            }

            onRoomsUpdate(rooms)
        }, onError)
}

export const fetchAgentRooms = (
    agent: Agent,
    onRoomsUpdate: (rooms: Room[]) => void,
    onError: (error: Error) => void,
): void => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('createRoomWithUsers: Firebase user not authenticated')

    firestore()
        .collection(CollectionName.ROOMS)
        .where('scope', '==', 'AGENT')
        .where('tag', 'in', agent.tags)
        .onSnapshot(async (snapshop) => {
            const snapshotData = snapshop.docs.map((rDoc) => rDoc.data() as Room).filter((r) => r.created_at !== null)

            const rooms: Room[] = []

            for (const rData of snapshotData) {
                const users: UserPreview[] = []
                for (const uid of rData.users_ids) {
                    users.push(userToPreview(await getUser(uid)))
                }
                for (const uid of rData.removed_users_ids) {
                    users.push(userToPreview(await getUser(uid)))
                }
                rooms.push({ ...rData, users })
            }

            onRoomsUpdate(rooms)
        }, onError)
}

const finalizeSendMessage = async (roomId: string, messageData: any): Promise<void> => {
    const roomRef = firestore().collection(CollectionName.ROOMS).doc(roomId)
    const messageRef = roomRef.collection(CollectionName.MESSAGES).doc()
    const message: MessageType.Any = {
        id: messageRef.id,
        ...messageData,
    }

    const messagePreview = {
        id: messageRef.id,
        type: message.content_type,
        text:
            (MessageTypeEmoji[message.content_type] ? MessageTypeEmoji[message.content_type] + ' ' : '') +
            (message.text || ''),
        sent_at: message.created_at,
        sent_by: message.created_by,
    }

    await firestore().runTransaction(async (transaction) => {
        await transaction.set(messageRef, message)
        await transaction.update(roomRef, {
            last_message: messagePreview,
        })
    })
}

/**
 * It creates and sends a message
 * @param  - roomId - The ID of the room to send the message to
 */
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

    const message = {
        text,
        created_by: currentFirebaseUser.uid,
        created_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        updated_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        metadata: metadata || null,
        room: roomId,
        content_type: 'TEXT',
        delivered: false,
        read_by: [],
    }

    await finalizeSendMessage(roomId, message)
}

/**
 * It uploads the file to Firebase Storage, then creates and sends the message
 * @param  - roomId - The ID of the room to send the message to.
 */
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

    const message = {
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
        delivered: false,
        read_by: [],
        metadata: metadata || null,
    }

    await finalizeSendMessage(roomId, message)
}

/**
 * It sends a message to a room with a file attached
 * @param  - roomId - The ID of the room to send the message to.
 */
export const sendFileMessageWithUrl = async ({
    roomId,
    text,
    file,
    metadata,
}: {
    roomId: string
    text?: string
    file: {
        filename: string
        url: string
        mimeType: string
    }
    metadata?: Record<string, any>
}): Promise<void> => {
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

    const message = {
        room: roomId,
        content_type,
        text: text || null,
        created_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        updated_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        created_by: currentFirebaseUser.uid,
        file: {
            mimeType: file.mimeType,
            name: file.filename,
            uri: file.url,
        },
        delivered: false,
        read_by: [],
        metadata: metadata || null,
    }

    await finalizeSendMessage(roomId, message)
}

/**
 * It marks the message as delivered
 * @param {string} roomId - The id of the room the message was sent to.
 * @param {string} messageId - The message ID of the message that was delivered.
 */
export const messageDelivered = async (roomId: string, messageId: string): Promise<void> => {
    await firestore()
        .collection(CollectionName.ROOMS)
        .doc(roomId)
        .collection(CollectionName.MESSAGES)
        .doc(messageId)
        .update({ delivered: true })
}

/**
 * It marks the message as read
 * @param {string} roomId - The ID of the room that the message is in.
 * @param {string} messageId - The ID of the message to mark as read.
 */
export const messageRead = async (roomId: string, messageId: string): Promise<void> => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('createRoomWithUsers: Firebase user not authenticated')

    const docRef = firestore()
        .collection(CollectionName.ROOMS)
        .doc(roomId)
        .collection(CollectionName.MESSAGES)
        .doc(messageId)
    const message = (await docRef.get()).data()
    await docRef.update({ read_by: [...(message?.read_by ?? []), currentFirebaseUser.uid] })
}

/**
 * It deletes a message from a room
 * @param {string} roomId - The ID of the room that the message is in.
 * @param {string} messageId - The ID of the message to delete.
 */
export const deleteMessage = async (roomId: string, messageId: string): Promise<void> => {
    await firestore()
        .collection(CollectionName.ROOMS)
        .doc(roomId)
        .collection(CollectionName.MESSAGES)
        .doc(messageId)
        .delete()
}

/**
 * It listens to the messages collection of a room and calls
 * @param {string} roomId - The ID of the room to fetch messages from.
 * @param onMessagesUpdate - (messages: MessageType.Any[]) => void
 * @param onError - (error: Error) => void
 */
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

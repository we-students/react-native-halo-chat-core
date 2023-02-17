import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import type { User } from './types'
import auth from '@react-native-firebase/auth'
import { CollectionName } from './utils'

interface CreateUserPayload {
    firstName?: string
    lastName?: string
    image?: string
    nickname?: string
}

/**
 * It creates a new user in the database
 * @param {CreateUserPayload} payload - CreateUserPayload
 * @returns User
 */
export const createUser = async (payload: CreateUserPayload): Promise<User> => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('joinUser: Firebase user not authenticated')

    const docRef = firestore().collection(CollectionName.USERS).doc(currentFirebaseUser.uid)

    const user: User = {
        id: currentFirebaseUser.uid,
        first_name: payload.firstName || null,
        last_name: payload.lastName || null,
        image: payload.image || null,
        nickname: payload.nickname || null,
        created_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        device_token: null,
    }
    await docRef.set(user)
    return user
}

export const updateUser = async (payload: CreateUserPayload): Promise<User> => {
    const currentFirebaseUser = auth().currentUser
    if (currentFirebaseUser === null) throw new Error('joinUser: Firebase user not authenticated')

    const docRef = firestore().collection(CollectionName.USERS).doc(currentFirebaseUser.uid)
    await docRef.update({ ...payload })
    return (await docRef.get()).data() as User
}

/**
 * It gets a user from the database
 * @param {string} userId - The user's ID.
 * @returns User
 */
export const getUser = async (userId: string): Promise<User> => {
    const doc = await firestore().collection(CollectionName.USERS).doc(userId).get()
    return doc.data() as User
}

/**
 * It fetches all users from the database and call onUsersUpdate whenever the data changes.
 *
 * @param onUsersUpdate - (users: User[]) => void
 * @param onError - (error: Error) => void
 */
export const fetchUsers = (onUsersUpdate: (users: User[]) => void, onError: (error: Error) => void): void => {
    firestore()
        .collection(CollectionName.USERS)
        .onSnapshot((snapshot) => {
            onUsersUpdate(snapshot.docs.map((u) => u.data() as User))
        }, onError)
}

export const updateDeviceToken = async (userId: string, token: string): Promise<void> => {
    await firestore().collection(CollectionName.USERS).doc(userId).update({ device_token: token })
}

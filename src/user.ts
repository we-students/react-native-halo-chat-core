import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import type { User } from './types'
import { CollectionName } from './utils'

export const createUser = async (payload: {
    id: string
    firstName?: string
    lastName?: string
    image?: string
}): Promise<User> => {
    const docRef = firestore().collection(CollectionName.USERS).doc(payload.id)
    const user: User = {
        id: payload.id,
        first_name: payload.firstName || null,
        last_name: payload.lastName || null,
        image: payload.image || null,
        created_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
    }
    await docRef.set(user)
    return user
}

export const getUser = async (userId: string): Promise<User> => {
    const doc = await firestore().collection(CollectionName.USERS).doc(userId).get()
    return doc.data() as User
}

export const fetchUsers = (onUsersUpdate: (users: User[]) => void, onError: () => void): void => {
    firestore()
        .collection(CollectionName.USERS)
        .onSnapshot((snapshot) => {
            onUsersUpdate(snapshot.docs.map((u) => u.data() as User))
        }, onError)
}

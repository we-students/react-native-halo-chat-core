import type { Agent } from './types'
import { CollectionName } from './utils'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

interface CreateAgentPayload {
    id: string
    firstName: string
    lastName: string
    image?: string
    tags: string[]
}

export const createAgent = async (payload: CreateAgentPayload): Promise<Agent> => {
    const docRef = firestore().collection(CollectionName.AGENTS).doc(payload.id)
    const agent: Agent = {
        id: payload.id,
        first_name: payload.firstName,
        last_name: payload.lastName,
        image: payload.image || null,
        tags: payload.tags,
        created_at: firestore.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
        device_token: null,
    }
    await docRef.set(agent)
    return agent
}

export const getAgent = async (agentId: string): Promise<Agent> => {
    const doc = await firestore().collection(CollectionName.AGENTS).doc(agentId).get()
    return doc.data() as Agent
}

export const updateDeviceToken = async (agentId: string, token: string): Promise<void> => {
    await firestore().collection(CollectionName.AGENTS).doc(agentId).update({ device_token: token })
}

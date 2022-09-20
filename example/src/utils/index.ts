import { Permission, PermissionsAndroid } from 'react-native'

type PermissionResponseCallback = (granted: boolean) => void

export const requestMemoryPermission = async (onPermissionResponse: PermissionResponseCallback): Promise<void> => {
    try {
        const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE as Permission,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE as Permission,
        ])

        onPermissionResponse(
            grants['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                grants['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED,
        )
    } catch (error) {
        console.warn('handle request permission error', error)
    }
}

export const requestRecordAudioPermission = async (onPermissionResponse: PermissionResponseCallback): Promise<void> => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO as Permission, {
            title: 'Halo Chat Example Record Audio Permission',
            message: 'Halo Chat Example needs access to your microphone',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
            buttonNeutral: 'Ask me later',
        })

        onPermissionResponse(granted === PermissionsAndroid.RESULTS.GRANTED)
    } catch (error) {
        console.warn('handle request permission error', error)
    }
}

const firstNames = [
    'Paolo',
    'Matteo',
    'Rocco',
    'Giuseppe',
    'Giorgia',
    'Federica',
    'Ferdinando',
    'Giorgio',
    'Fabio',
    'Mario',
]
const lastNames = [
    'Giardino',
    'Destefanis',
    'Di Bello',
    'Morabito',
    'Scarcella',
    'Sapino',
    'Nocera',
    'Morelli',
    'Cielo',
    'Francese',
]

export const randomFirstName = (): string => {
    return firstNames[Math.floor(Math.random() * firstNames.length)]!
}

export const randomLastName = (): string => {
    return lastNames[Math.floor(Math.random() * lastNames.length)]!
}

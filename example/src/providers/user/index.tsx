import * as React from 'react'
import type { User } from 'react-native-firebase-chat-sdk'

export const UserContext = React.createContext<{ user?: User; setUser: (user: User) => void }>({
    user: undefined,
    setUser: () => {
        /* nothing here */
    },
})

const UserProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
    const [user, setUser] = React.useState<User>()

    return (
        <UserContext.Provider value={{ user: user, setUser: (value) => setUser(value) }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = (): { user?: User; setUser: (user: User) => void } => {
    const { user, setUser } = React.useContext(UserContext)

    return { user, setUser }
}

export default UserProvider

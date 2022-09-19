import * as React from 'react'
import type * as HaloChat from '@westudents/react-native-halo-chat-core'

export const UserContext = React.createContext<{
    user?: HaloChat.Types.User
    setUser: (user: HaloChat.Types.User) => void
}>({
    user: undefined,
    setUser: () => {
        /* nothing here */
    },
})

const UserProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
    const [user, setUser] = React.useState<HaloChat.Types.User>()

    return (
        <UserContext.Provider value={{ user: user, setUser: (value) => setUser(value) }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = (): { user?: HaloChat.Types.User; setUser: (user: HaloChat.Types.User) => void } => {
    const { user, setUser } = React.useContext(UserContext)

    return { user, setUser }
}

export default UserProvider

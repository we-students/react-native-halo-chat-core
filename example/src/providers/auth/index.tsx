import * as React from 'react'
import type * as HaloChat from '@westudents/react-native-halo-chat-core'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface IAuth {
    user?: HaloChat.Types.User
    setUser: (user?: HaloChat.Types.User) => void
    agent?: HaloChat.Types.Agent
    setAgent: (agent?: HaloChat.Types.Agent) => void
    isAgent: boolean
    setIsAgent: (value: boolean) => void
}

export const AuthContext = React.createContext<IAuth>({
    user: undefined,
    setUser: () => {
        /* nothing here */
    },
    agent: undefined,
    setAgent: () => {
        /* nothing here */
    },
    isAgent: false,
    setIsAgent: () => {
        /* nothing here */
    },
})

const AuthProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
    const [user, setUser] = React.useState<HaloChat.Types.User>()
    const [agent, setAgent] = React.useState<HaloChat.Types.Agent>()
    const [isAgent, setIsAgent] = React.useState<boolean>(false)

    const restoreIsAgent = async (): Promise<void> => {
        const res = await AsyncStorage.getItem('is_agent')
        setIsAgent(res === 'TRUE' ? true : false)
    }

    React.useEffect(() => {
        restoreIsAgent()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user: user,
                setUser: (value) => setUser(value),
                agent: agent,
                setAgent: (value) => setAgent(value),
                isAgent: isAgent,
                setIsAgent: (value): void => {
                    setIsAgent(value)
                    AsyncStorage.setItem('is_agent', value ? 'TRUE' : 'FALSE')
                },
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): IAuth => {
    const { user, setUser, agent, setAgent, isAgent, setIsAgent } = React.useContext(AuthContext)

    return { user, setUser, agent, setAgent, isAgent, setIsAgent }
}

export default AuthProvider

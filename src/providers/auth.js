import React, { useEffect, useState } from 'react'

export const AuthContext = React.createContext({})

export const AuthProvider = (props) => {
    const [token, setToken] = useState(undefined)
    const [data, setData] = useState({})

    useEffect(() => {
        
    }, [token])

    return(
    <AuthContext.Provider value={{token, setToken, data, setData}}>{props.children}</AuthContext.Provider>
    )
}
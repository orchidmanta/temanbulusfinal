import React, { createContext, useContext } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

// Note: This context is kept for compatibility but we're now using direct fetch in subgraph.ts
const client = new ApolloClient({
  uri: import.meta.env.VITE_SUBGRAPH_URL || 'https://api.studio.thegraph.com/query/118181/teambulus/version/latest',
  cache: new InMemoryCache()
})

interface GraphContextType {
  client: ApolloClient<any>
}

const GraphContext = createContext<GraphContextType | undefined>(undefined)

export const useGraph = () => {
  const context = useContext(GraphContext)
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider')
  }
  return context
}

export const GraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <GraphContext.Provider value={{ client }}>
        {children}
      </GraphContext.Provider>
    </ApolloProvider>
  )
}

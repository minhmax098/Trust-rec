import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

// Initialize the Apollo Client to point directly to a single Node.js Web API endpoint.
const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
    </React.StrictMode>,
)
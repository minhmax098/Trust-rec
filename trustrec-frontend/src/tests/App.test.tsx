import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import App from '../App';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql', fetch }),
  cache: new InMemoryCache(),
});

describe('App Component Structure', () => {
  it('renders the main heading', () => {
    render(
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    );
    expect(screen.getByText(/TrustRec Platform/i)).toBeInTheDocument();
  });
});

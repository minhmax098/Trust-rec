const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const resolvers = require('./graphql/resolvers/index');

async function startServer() {
  const app = express();
  
  // Turn on CORS accept Frontend (Vite run port 5173) call API
  app.use(cors());

  // Đọc file schema.graphql
  const typeDefs = fs.readFileSync(
    path.join(__dirname, './graphql/schema.graphql'),
    'utf8'
  );

  // Khởi tạo Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Allows viewing of automatically public API documentation.
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Web API run at http://localhost:${PORT}/graphql`);
    console.log(`Access the link above to test the API using Apollo Sandbox.!`);
  });
}

startServer().catch(err => {
  console.error("Server startup error:", err);
});
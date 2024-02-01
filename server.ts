const express = require('express');
const cors = require('cors');
const gql = require('graphql-tag');
const { ApolloServer } = require('apollo-server-express');
const gqlResolvers = require('./src/resolvers.ts');
const { readFileSync } = require('fs');
const http = require('http');

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

async function startServer() {
  const typeDefs = gql(
    readFileSync('./src/schema.graphql', {
      encoding: 'utf-8',
    }),
  );
  const server = new ApolloServer({
    typeDefs,
    gqlResolvers,
  });
  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) => httpServer.listen({ port: 5000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}

startServer();

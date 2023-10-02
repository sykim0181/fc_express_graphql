const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const path = require('path');

const port = 4000;

// 모든 폴더(**) 속, .graphql로 끝나는 모든 파일(*)
const loadedTypes = loadFilesSync('**/*', {
  extensions: ['graphql'],
});

const loadedResolvers = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"))

async function startApolloServer() {
  const app = express();

  const schema = makeExecutableSchema({
    typeDefs: loadedTypes,
    resolvers: loadedResolvers
  });

  // This Apollo server object contains all the middleware and
  // logic to handle incoming graphical requests.
  const server = new ApolloServer({
    schema
  });

  await server.start();
  // Connect apollo middleware with express server
  server.applyMiddleware({ app, path: '/graphql' });
  
  app.listen(port, () => {
    console.log('Running a GraphQL API server...');
  });
}

startApolloServer();
const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const path = require('path');
const express = require('express');

const { ApolloServer } = require('@apollo/server');
const cors = require('cors');
const { json } = require('body-parser');
const { expressMiddleware } = require('@apollo/server/express4');

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
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token })
    })
  );
  
  app.listen(port, () => {
    console.log('Running a GraphQL API server...');
  });
}

startApolloServer();
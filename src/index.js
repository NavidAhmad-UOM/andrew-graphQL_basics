import { GraphQLServer } from "graphql-yoga";

import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';
import User from './resolvers/User';
// author:User! is used to get user each post ...

const server = new GraphQLServer({
  typeDefs:'./src/schema.graphql',
  resolvers:{
    Query,
    Mutation,
    Post,
    Comment,
    User
  },
  context:{
    db:db
  }
});

server.start(() => {
  console.log("server is running up!");
});

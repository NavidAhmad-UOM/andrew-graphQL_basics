import { GraphQLServer } from "graphql-yoga";

import uuidv4 from 'uuid/v4';

const users = [
  {
    id: "1",
    name: "Andrew",
    email: "Andrew@example.com",
    age: 34
  },
  {
    id: "2",
    name: "Mike",
    email: "Mike@example.com",
    age: 32
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com"
  }
];

const posts = [
  {
    id: 1,
    title: "sunt aut facere repellat ",
    body: "quia et suscipit suscipit",
    published: true,
    author: "1"
  },
  {
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae ",
    published: true,
    author: "2"
  },
  {
    id: 3,
    title: "ea molestias quasi exercitationem",
    body: "et iusto sed quo iure voluptatem ",
    published: true,
    author: "2"
  }
];
const comments = [
  {
    id: 1,
    text: "id labore ex et quam laborum",
    author: "1",
    post: 1
  },
  {
    id: 2,
    text: "quo vero reiciendis velit similique earum",
    author: "2",
    post: 2
  },
  {
    id: 3,
    text: "odio adipisci rerum aut animi",
    author: "2",
    post: 3
  }
];

const typeDefs = `
      type Query {
          users(query:String):[User!]!,
          posts(query:String):[Post!]!,
          me:User!,
          comments(query:String):[Comment!]!
      }

      type Mutation{
          createUser(name: String!,email: String!, age: Int):User!,
          createPost(title:String!,body:String!,published:Boolean!,author:ID!):Post!,
          createComment(text:String!,post:ID!,author:ID!):Comment!
      }

      type User {
          id:ID!,
          name:String!,
          email:String!,
          age:Int,
          posts:[Post!]!,
          comments:[Comment!]!
      }
      type Post {
          id:ID!,
          title: String!,
          body: String!,
          published: Boolean!,
          author:User!,
          comments:[Comment!]!
      }
      type Comment {
          id:ID!,
          text:String!,
          author:User!,
          post:Post
      }
`;
// author:User! is used to get user each post ...
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      } else {
        return users.filter(user => {
          return user.name.toLowerCase().includes(args.query.toLowerCase());
        });
      }
    },
    me() {
      return {
        id: "1323",
        name: "Mike",
        email: "mike@example.com"
      };
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      } else {
        return posts.filter(post => {
          return post.title.toLowerCase().includes(args.query.toLowerCase());
        });
      }
    },
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments;
      } else {
        return comments.filter(c => {
          return c.text.toLowerCase().includes(args.query.toLowerCase());
        });
      }
    }
  },
  Mutation:{
      createUser(parent,args,ctx,info){
          const emailTaken = users.some(user=>user.email===args.email);
          if(emailTaken){
              throw new Error("Email taken..");
          };
          const user = {
              id:uuidv4(),
              ...args
          };
          users.push(user);
          return user;
      },
      createPost(parent,args,ctx,info){
          const userExist = users.some(user=>user.id==args.author);

          if(!userExist){
              throw new Error("User is not Exist");
          }
          const post ={
              id:uuidv4(),
              ...args
          }

          posts.push(post);

          return post;
      },
      createComment(parent,args,ctx,info){
        const userExist = users.some(user=>user.id==args.author); 
        const postExist = posts.some(post=>post.id==args.post);
        if(!userExist && !postExist){
            throw new Error("Post and user not exist")
        }
        if(!userExist){
            throw new Error("User not exist..");
        }
        if(!postExist){
            throw new Error("post not exist");
        }
        const comment={
            id:uuidv4(),
            ...args
        }
        comments.push(comment);
        return comment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(u => u.id === parent.author);
    },
    comments(parent, args, ctx, info) {
        return comments.filter(c => c.post === parent.id);
      }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(p => p.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(c => c.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(u => u.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(p => p.id === parent.post);
    }
  }
};
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("server is running up!");
});

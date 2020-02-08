import {GraphQLServer} from 'graphql-yoga';

const typeDefs =`
      type Query {
          me:User!,
          post:Post!,
          greeting(name:String!,position:String!):String!,
          add(numbers:[Int!]!):Float!,
          grades:[Int!]!
      }
      type User {
          id:ID!,
          name:String!,
          email:String!,
          age:Int
      }
      type Post {
          id:ID!,
          title: String!,
          body: String!,
          published: Boolean!
      }
`
const resolvers ={
    Query:{
        grades(parent,args,ctx,info){
            return [63,76,87]
        },
        add(parent,args,ctx,info){
            if(args.numbers.length===0){
                return 0;
            }else {
                console.log('length',args.numbers.length)
                return args.numbers.reduce((accumulator,currentValue)=>{
                    return accumulator+currentValue;
                })
            }
        },
        greeting(parent,args,ctx,info){
            if(args.name){
                return `${args.name} you are my ${args.position}`
            }else {
                return '';
            }
        },
        me(){
            return {
                id:'1323',
                name:'Mike',
                email:'mike@example.com'
            }
        },
        post(){
            return {
                id:'2332',
                title:'graphQL 101',
                body:'',
                published:false
            }

        }
    }
}
const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log('server is running up!');
})

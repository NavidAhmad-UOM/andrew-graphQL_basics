import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent,args,{db},info){
        const emailTaken = db.users.some(user=>user.email===args.data.email);
        if(emailTaken){
            throw new Error("Email taken..");
        };
        const user = {
            id:uuidv4(),
            ...args.data
        };
        db.users.push(user);
        return user;
    },
    updateUser(parent,args,{db},info){
        const {id,data}=args;
        console.log(args)
        const user = db.users.find((user)=>user.id===id);
        if(!user){
            throw new Error('User not found..');
        }
        if(typeof data.email==='string'){
            const emailTaken = db.users.some((user)=>user.email===data.email);

            if(emailTaken){
                throw new Error("Email taken..");
            }
            user.email = data.email;
        }
        if(typeof data.name ==='string'){
            user.name = data.name
        }
        if(typeof user.age!=='undefined'){
            user.age = data.age
        }
        console.log(user);

        return user;
    },
    createPost(parent,args,{db,pubSub},info){
        const userExist = db.users.some(user=>user.id==args.data.author);

        if(!userExist){
            throw new Error("User is not Exist");
        }
        const post ={
            id:uuidv4(),
            ...args.data
        }

        if(post.published){
            pubSub.publish('post',{createPost:{
                mutation:"CREATED",
                data:post
            }})
        }

        db.posts.push(post);

        return post;
    },
    updatePost(parent,args,{db,pubSub},info){
        const {id,data} = args;
        console.log("...",args);
        const post = db.posts.find((post)=>post.id==args.id);
        const originalPost = {...post};
        if(!post){
            throw new Error("Post not found");
        }
        if(typeof data.title === 'string'){
            post.title = args.data.title
        }
        if(typeof data.body=== 'string'){
            post.body = args.data.body
        }
        if(typeof args.data.published!=='boolean'){
            console.log('published...',args.data.published);
            post.published = args.data.published

            if(originalPost.published && !args.data.published){
                //delete
                console.log('deletd..');
                pubSub.publish('post',{createPost:{
                    mutation:"DELETED",
                    data:post
                }})
            }else if(!originalPost.published && post.published){
                //create
                console.log('created..');
                pubSub.publish('post',{createPost:{
                    mutation:"CREATED",
                    data:post
                }})
            }
        }else if(post.published){
            // updated ..
            pubSub.publish('post',{createPost:{
                mutation:"UPDATED",
                data:post
            }})
        }

        return post;
    },
    createComment(parent,args,{db,pubSub},info){
      const userExist = db.users.some(user=>user.id==args.data.author); 
      const postExist = db.posts.some(post=>post.id==args.data.post);
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
          ...args.data
      }
      db.comments.push(comment);
      pubSub.publish(`comment ${args.data.post}`,{comment:comment})
      return comment;
  },
  updateComment(parent,args,{db,pubSub},info){
    const {id,data} = args;
    const comment = db.comments.find((c)=>c.id==id);
    if(!comment){
        throw new Error("Comment not found");
    }
    if(typeof data.text === 'string'){
        comment.text = data.text
    }
    pubSub.publish('createComment',{createComment:{
        mutation:"UPDATED",
        data:comment
    }})
    return comment;
},
  deleteUser(parent,args,{db},info){
    const userIndex = db.users.findIndex(u=>u.id==args.id);
    if(userIndex===-1){
      throw new Error("user not founded..")
    }
    const deletedUsers = db.users.splice(userIndex,1);

    db.posts = db.posts.filter(post=>{
      let match = post.author==args.id;
      if(match){
        db.comments = db.comments.filter((comment)=>{
          let match = comment.post==post.id
          return !match
        })
      }
      return !match 
    })

    db.comments = db.comments.filter((comment)=>comment.author!=args.id)
    return deletedUsers[0];
  },
  deletePost(parent,args,{db,pubSub},info){
    const postIndex = db.posts.findIndex(post=>post.id==args.id);
    if(postIndex===-1){
      throw new Error("post not founded..")
    }
    const deletedPost = db.posts.splice(postIndex,1);

    db.posts = db.posts.filter(post=>{
      let match = post.id==args.id;
      if(match){
        db.comments = db.comments.filter((comment)=>{
          let match = comment.post==post.id
          return !match
        })
      }

      if(deletedPost[0].published){
        pubSub.publish('post',{createPost:{
            mutation:"DELETED",
            data:deletedPost[0]
        }})
      }

      return !match 
    })
    
    return deletedPost[0];
  },
  deleteComment(parent,args,{db,pubSub},info){
    const commentIndex = db.comments.findIndex(comment=>comment.id==args.id);
    if(commentIndex===-1){
      throw new Error("Comment not founded..")
    }
    const deletedComment = db.comments.splice(commentIndex,1);
    
    pubSub.publish('createComment',{createComment:{
        mutation:"DELETED",
        data:deletedComment[0]
    }})

    return deletedComment[0];
  }
}

export {Mutation as default}
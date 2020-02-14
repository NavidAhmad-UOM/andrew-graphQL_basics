const Subscription = {
    count:{
        subscribe(parent,args,{pubSub},info){
            let count = 0;

            setInterval(()=>{
                count++;
                pubSub.publish('count',{
                    count:count
                })
            },1000)
            return pubSub.asyncIterator('count');
        }
    },
    comment:{
        subscribe(parent,args,{db,pubSub},info){
            const post = db.posts.find((post)=>post.id==args.postId && post.published)
            if(!post){
                throw new Error('Post not found..');
            }
            
            return pubSub.asyncIterator(`comment ${args.postId}`)
        }
    },
    createPost:{
        subscribe(parent,args,{db,pubSub},info){

            return pubSub.asyncIterator(`post`)
        }
    },
    createComment:{
        subscribe(parent,args,{db,pubSub},info){

            return pubSub.asyncIterator(`createComment`)
        }
    }
}

export default Subscription;
const Query = {
    users(parent, args, {db}, info) {
      if (!args.query) {
        return db.users;
      } else {
        return db.users.filter(user => {
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
    posts(parent, args, {db}, info) {
      if (!args.query) {
        return db.posts;
      } else {
        return db.posts.filter(post => {
          return post.title.toLowerCase().includes(args.query.toLowerCase());
        });
      }
    },
    comments(parent, args, {db}, info) {
      if (!args.query) {
        return db.comments;
      } else {
        return db.comments.filter(c => {
          return c.text.toLowerCase().includes(args.query.toLowerCase());
        });
      }
    }
  }

  export {Query as default}
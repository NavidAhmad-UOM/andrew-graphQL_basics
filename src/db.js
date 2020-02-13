let users = [
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
  
  let posts = [
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
  let comments = [
    {
      id: 1,
      text: "id labore ex et quam laborum",
      author: "1",
      post: "1"
    },
    {
      id: 2,
      text: "quo vero reiciendis velit similique earum",
      author: "1",
      post: "2"
    },
    {
      id: 3,
      text: "odio adipisci rerum aut animi",
      author: "2",
      post: "2"
    }
  ];

  const db ={
      users,
      posts,
      comments
  }

  export {db as default};
export const getComments = async () => {
    return [
      {
        id: "1",
        body: "First comment",
        username: "Jack",
        userId: "123",
        star: 5,
        createdAt: "2020-08-16T23:00:33.010+02:00",
      },
      {
        id: "2",
        body: "Second comment",
        username: "John",
        userId: "2456",
        star: 4,
        createdAt: "2021-07-12T23:00:33.010+02:00",
      },
      {
        id: "3",
        body: "Third comment",
        username: "John",
        userId: "287542",
      
        star: 2,
        createdAt: "2022-01-14T23:00:33.010+02:00",
      },
      {
        id: "4",
        body: "I Love this club",
        username: "John",
        userId: "222",
      
        star: 1,
        createdAt: "2022-04-22T23:00:33.010+02:00",
      },
    ];
  };
  
  export const createComment = async (text, parentId = null) => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      body: text,
      userId: "1",
      username: "John",
      star: Math.floor(Math.random() * 6),
      createdAt: new Date().toISOString(),
    };
  };
  
  export const updateComment = async (text) => {
    return { text };
  };
  
  export const deleteComment = async () => {
    return {};
  };
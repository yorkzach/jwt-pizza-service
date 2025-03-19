module.exports = {
  jwtSecret: 'zacharyyork',
  db: {
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'tempdbpassword',
      database: 'pizza',
      connectTimeout: 60000,
    },
    listPerPage: 10,
  },
  factory: {
    url: 'https://pizza-factory.cs329.click',
    apiKey: 'f8e76ea7567d465cb8c5e0c70da31cd7',
  },
};

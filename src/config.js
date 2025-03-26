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
  metrics: {
    source: 'jwt-pizza-service',
    url: 'https://otlp-gateway-prod-us-west-0.grafana.net/otlp/v1/metrics',
    apiKey: 'glc_eyJvIjoiMTM4MDA1MCIsIm4iOiJzdGFjay0xMjAzOTY5LWludGVncmF0aW9uLWp3dC1waXp6YS1tZXRyaWNzIiwiayI6IjhJbzh6MWc1VnZsNFdyRDd2VDNiNzA3WCIsIm0iOnsiciI6InByb2QtdXMtd2VzdC0wIn19',
  },  
  logging:    {
    source: 'jwt-pizza-service',
    userId: 1161768,
    url: 'https://logs-prod-021.grafana.net/loki/api/v1/push',
    apiKey: 'glc_eyJvIjoiMTM4MDA1MCIsIm4iOiJzdGFjay0xMjAzOTY5LWludGVncmF0aW9uLWp3dC1waXp6YS1sb2dzIiwiayI6IncySjRuU2ZyYVIzNDlsMzc5eElwWGczMiIsIm0iOnsiciI6InByb2QtdXMtd2VzdC0wIn19',
  },
};

module.exports =  {
  jwtSecret: 'zacharyyork',
  db: {
    connection: {
      host: '127.0.0.1',
      // host: 'host.docker.internal',
      user: 'root',
      password: 'C1rcle11',
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
    source: 'jwt-pizza-service-dev',
    url: 'https://otlp-gateway-prod-us-west-0.grafana.net/otlp/v1/metrics',
    apiKey: '1203969:glc_eyJvIjoiMTM4MDA1MCIsIm4iOiJzdGFjay0xMjAzOTY5LWludGVncmF0aW9uLWp3dC1waXp6YS1tZXRyaWNzIiwiayI6IjhJbzh6MWc1VnZsNFdyRDd2VDNiNzA3WCIsIm0iOnsiciI6InByb2QtdXMtd2VzdC0wIn19',
  },
};

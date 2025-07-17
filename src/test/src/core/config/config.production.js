const config = {
  apiBaseUrl: "/api/",
  baseUrl: window.location.protocol + "//" + window.location.host,
  streamingUrl: 'https://staging-assets-dev.s3.us-east-2.amazonaws.com',
  title: "EyeMail",
  searchSnippetsParam: [
    { name: 'query', type: 'string' },
    { name: 'status', type: 'bool' }
  ]
};

export default config;  
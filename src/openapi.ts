const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'PD G3 Backend API',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
  tags: [
    { name: 'Vuelo', description: 'Vuelo es un modelo de datos dedicado a describir las sesiones de vuelo de un dron' },
  ],
  paths: {
    '/vuelo': {
      get: {
        tags: ['Vuelo'],
        summary: 'Get all vuelos',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' }, description: 'Page number', default: 1 },
          { name: 'limit', in: 'query', schema: { type: 'integer' }, description: 'Number of items per page', default: 10 },
        ],
        responses: {
          200: { description: 'List of vuelos' },
        },
      },
      post: {
        tags: ['Vuelo'],
        summary: 'Create vuelo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VueloInput' },
            },
          },
        },
        responses: {
          201: { description: 'Vuelo created' },
          500: { description: 'Error creating vuelo' },
        },
      },
    },
    '/vuelo/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      get: {
        tags: ['Vuelo'],
        summary: 'Get vuelo by ID',
        responses: {
          200: { description: 'Vuelo found' },
          404: { description: 'Vuelo not found' },
        },
      },
      put: {
        tags: ['Vuelo'],
        summary: 'Update vuelo',
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VueloInput' },
            },
          },
        },
        responses: {
          200: { description: 'Vuelo updated' },
          404: { description: 'Vuelo not found' },
        },
      },
      delete: {
        tags: ['Vuelo'],
        summary: 'Delete vuelo',
        responses: {
          200: { description: 'Vuelo deleted' },
          404: { description: 'Vuelo not found' },
        },
      },
    },
  },
  components: {
    schemas: {
      VueloInput: {
        type: 'object',
        required: ['nametag'],
        properties: {
          nametag: { type: 'string', example: 'Dronelab-1234' },
          datetime: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

export default openApiSpec;

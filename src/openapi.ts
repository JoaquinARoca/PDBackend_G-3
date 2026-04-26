const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'PD G3 Backend API',
    version: '1.0.0',
    description: 'API para gestionar vuelos de drones',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'API Base URL',
    },
  ],
  tags: [
    {
      name: 'Vuelo',
      description: 'Vuelo es un modelo de datos dedicado a describir las sesiones de vuelo de un dron',
    },
  ],
  paths: {
    '/vuelo': {
      get: {
        tags: ['Vuelo'],
        summary: 'Get all vuelos',
        description: 'Obtiene una lista paginada de todos los vuelos registrados',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1 },
            description: 'Número de página (comienza en 1)',
            example: 1,
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100 },
            description: 'Cantidad de elementos por página',
            example: 10,
          },
        ],
        responses: {
          200: {
            description: 'Lista de vuelos obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Vuelo' },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      id: '507f1f77bcf86cd799439011',
                      nametag: 'DroneLab1234',
                      datetime: '2024-01-15T10:30:00Z',
                    },
                  ],
                  pagination: {
                    page: 1,
                    limit: 10,
                    total: 25,
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Vuelo'],
        summary: 'Create a vuelo',
        description: 'Crea una nueva sesión de vuelo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VueloInput' },
              example: {
                nametag: 'DroneLab1234',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Vuelo creado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vuelo' },
                example: {
                  id: '507f1f77bcf86cd799439011',
                  nametag: 'DroneLab1234',
                  datetime: '2024-01-15T10:30:00Z',
                },
              },
            },
          },
          400: {
            description: 'Datos inválidos en la solicitud',
          },
          500: {
            description: 'Error interno del servidor',
          },
        },
      },
    },
    '/vuelo/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'ID único del vuelo',
          example: '507f1f77bcf86cd799439011',
        },
      ],
      get: {
        tags: ['Vuelo'],
        summary: 'Get a vuelo by ID',
        description: 'Obtiene los detalles de un vuelo específico por su ID',
        responses: {
          200: {
            description: 'Vuelo encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vuelo' },
                example: {
                  id: '507f1f77bcf86cd799439011',
                  nametag: 'DroneLab1234',
                  datetime: '2024-01-15T10:30:00Z',
                },
              },
            },
          },
          404: {
            description: 'Vuelo no encontrado',
          },
        },
      },
      put: {
        tags: ['Vuelo'],
        summary: 'Update a vuelo',
        description: 'Actualiza una sesión de vuelo existente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VueloInput' },
              example: {
                nametag: 'DroneLab1235',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Vuelo actualizado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Vuelo' },
                example: {
                  id: '507f1f77bcf86cd799439011',
                  nametag: 'DroneLab1235',
                  datetime: '2024-01-16T14:45:00Z',
                },
              },
            },
          },
          404: {
            description: 'Vuelo no encontrado',
          },
          400: {
            description: 'Datos inválidos',
          },
        },
      },
      delete: {
        tags: ['Vuelo'],
        summary: 'Delete a vuelo',
        description: 'Elimina una sesión de vuelo',
        responses: {
          200: {
            description: 'Vuelo eliminado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    id: { type: 'string' },
                  },
                },
                example: {
                  message: 'Vuelo eliminado correctamente',
                  id: '507f1f77bcf86cd799439011',
                },
              },
            },
          },
          404: {
            description: 'Vuelo no encontrado',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Vuelo: {
        type: 'object',
        description: 'Modelo que representa una sesión de vuelo de un dron',
        required: ['id', 'nametag', 'datetime'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID único del vuelo',
            example: '507f1f77bcf86cd799439011',
          },
          nametag: {
            type: 'string',
            description: 'Identificador del vuelo (código)',
            example: 'DroneLab1234',
            minLength: 1,
            maxLength: 50,
          },
          datetime: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora del vuelo en formato ISO 8601',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },
      VueloInput: {
        type: 'object',
        description: 'Datos necesarios para crear o actualizar un vuelo',
        required: ['nametag'],
        properties: {
          nametag: {
            type: 'string',
            description: 'Identificador del vuelo',
            example: 'DroneLab1234',
            minLength: 1,
            maxLength: 50,
          },
          datetime: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora del vuelo (opcional)',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },
    },
  },
};

export default openApiSpec;
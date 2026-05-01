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
    {
      name: 'Punto',
      description: 'Punto es un modelo de datos que representa una coordenada GPS con altitud y orientación del dron',
    },
    {
      name: 'Instruccion',
      description: 'Instruccion es un modelo de datos que representa una orden de vuelo asociada a un punto GPS y un vuelo. Cada instrucción genera un nuevo trail y puede crear nuevas versiones al ser actualizada',
    },
    {
      name: 'Media',
      description: 'Media es un modelo de datos que representa un archivo multimedia (imagen o vídeo) subido a Cloudinary y asociado a una instrucción de vuelo',
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
              schema: { $ref: '#/components/schemas/_VueloInput' },
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
              schema: { $ref: '#/components/schemas/_VueloInput' },
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
    '/punto': {
      get: {
        tags: ['Punto'],
        summary: 'Get all puntos',
        description: 'Obtiene una lista paginada de todos los puntos registrados',
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
            description: 'Lista de puntos obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Punto' },
                },
                example: [
                  { id: '507f1f77bcf86cd799439011', Latitud: -46.075, Longitud: -4.034, Altitud: 17.0, Heading: 170.4 },
                ],
              },
            },
          },
        },
      },
      post: {
        tags: ['Punto'],
        summary: 'Create a punto',
        description: 'Crea un nuevo punto GPS',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/_PuntoInput' },
              example: { Latitud: -46.075, Longitud: -4.034, Altitud: 17.0, Heading: 170.4 },
            },
          },
        },
        responses: {
          201: {
            description: 'Punto creado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Punto' },
                example: { id: '507f1f77bcf86cd799439011', Latitud: -46.075, Longitud: -4.034, Altitud: 17.0, Heading: 170.4 },
              },
            },
          },
          500: { description: 'Error interno del servidor' },
        },
      },
    },
    '/punto/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID único del punto',
          example: '507f1f77bcf86cd799439011',
        },
      ],
      get: {
        tags: ['Punto'],
        summary: 'Get a punto by ID',
        description: 'Obtiene los detalles de un punto específico por su ID',
        responses: {
          200: {
            description: 'Punto encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Punto' },
                example: { id: '507f1f77bcf86cd799439011', Latitud: -46.075, Longitud: -4.034, Altitud: 17.0, Heading: 170.4 },
              },
            },
          },
          404: { description: 'Punto no encontrado' },
        },
      },
      put: {
        tags: ['Punto'],
        summary: 'Update a punto',
        description: 'Actualiza un punto GPS existente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/_PuntoInput' },
              example: { Latitud: -47.0, Longitud: -5.0, Altitud: 20.0, Heading: 180.0 },
            },
          },
        },
        responses: {
          200: {
            description: 'Punto actualizado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Punto' },
                example: { id: '507f1f77bcf86cd799439011', Latitud: -47.0, Longitud: -5.0, Altitud: 20.0, Heading: 180.0 },
              },
            },
          },
          404: { description: 'Punto no encontrado' },
        },
      },
      delete: {
        tags: ['Punto'],
        summary: 'Delete a punto',
        description: 'Elimina un punto GPS',
        responses: {
          200: {
            description: 'Punto eliminado exitosamente',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string' } } },
                example: { message: 'Punto deleted successfully' },
              },
            },
          },
          404: { description: 'Punto no encontrado' },
        },
      },
    },
    '/instruccion': {
      get: {
        tags: ['Instruccion'],
        summary: 'Get all instrucciones or one by query ID',
        description: 'Si se proporciona el parámetro `id`, devuelve la instrucción con ese ID. Si no, devuelve una lista paginada de todas las instrucciones',
        parameters: [
          {
            name: 'id',
            in: 'query',
            schema: { type: 'string' },
            description: 'ID de la instrucción a obtener (si se proporciona, ignora page y limit)',
            example: '507f1f77bcf86cd799439011',
          },
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
            description: 'Instrucción o lista de instrucciones obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/Instruccion' },
                    { type: 'array', items: { $ref: '#/components/schemas/Instruccion' } },
                  ],
                },
                example: [
                  {
                    _id: '507f1f77bcf86cd799439011',
                    ID_Vuelo: '507f1f77bcf86cd799439020',
                    version: 1,
                    trail: 1,
                    Punto: { _id: '507f1f77bcf86cd799439030', Latitud: -46.075, Longitud: -4.034, Altitud: 17.0, Heading: 170.4 },
                    directriz: 'Volar hacia el norte',
                    datetime: '2024-01-15T10:30:00Z',
                  },
                ],
              },
            },
          },
          404: { description: 'Instrucción no encontrada (cuando se usa el parámetro id)' },
          500: { description: 'Error interno del servidor' },
        },
      },
      post: {
        tags: ['Instruccion'],
        summary: 'Create a instruccion',
        description: 'Crea una nueva instrucción de vuelo. El campo `trail` se asigna automáticamente como el siguiente número secuencial para el vuelo dado',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/_InstruccionInput' },
              example: {
                ID_Vuelo: '507f1f77bcf86cd799439020',
                Punto: { Latitud: -46.075, Longitud: -4.034, Altitud: 17.0, Heading: 170.4 },
                directriz: 'Volar hacia el norte',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Instrucción creada exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Instruccion' },
                example: {
                  _id: '507f1f77bcf86cd799439011',
                  ID_Vuelo: '507f1f77bcf86cd799439020',
                  version: 1,
                  trail: 1,
                  Punto: { _id: '507f1f77bcf86cd799439030', Latitud: -46.075, Longitud: -4.034, Altitud: 17.0, Heading: 170.4 },
                  directriz: 'Volar hacia el norte',
                  datetime: '2024-01-15T10:30:00Z',
                },
              },
            },
          },
          500: { description: 'Error interno del servidor' },
        },
      },
    },
    '/instruccion/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID único de la instrucción',
          example: '507f1f77bcf86cd799439011',
        },
      ],
      get: {
        tags: ['Instruccion'],
        summary: 'Get a instruccion by ID',
        description: 'Obtiene los detalles de una instrucción específica por su ID, con el punto GPS populado',
        responses: {
          200: {
            description: 'Instrucción encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Instruccion' },
                example: {
                  _id: '507f1f77bcf86cd799439011',
                  ID_Vuelo: '507f1f77bcf86cd799439020',
                  version: 1,
                  trail: 1,
                  Punto: { _id: '507f1f77bcf86cd799439030', Latitud: -46.075, Longitud: -4.034, Altitud: 17.0, Heading: 170.4 },
                  directriz: 'Volar hacia el norte',
                  datetime: '2024-01-15T10:30:00Z',
                },
              },
            },
          },
          404: { description: 'Instrucción no encontrada' },
          500: { description: 'Error interno del servidor' },
        },
      },
      put: {
        tags: ['Instruccion'],
        summary: 'Update a instruccion',
        description: 'Crea una nueva instrucción como nueva versión de la existente (inmutabilidad por versiones). El campo `version` se incrementa automáticamente y se actualiza el contador `numVersiones` del vuelo',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/_InstruccionUpdateBody' },
              example: {
                Punto: { Latitud: -47.0, Longitud: -5.0, Altitud: 20.0, Heading: 180.0 },
                directriz: 'Volar hacia el sur',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Nueva versión de la instrucción creada exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Instruccion' },
                example: {
                  _id: '507f1f77bcf86cd799439099',
                  ID_Vuelo: '507f1f77bcf86cd799439020',
                  version: 2,
                  trail: 1,
                  Punto: { _id: '507f1f77bcf86cd799439031', Latitud: -47.0, Longitud: -5.0, Altitud: 20.0, Heading: 180.0 },
                  directriz: 'Volar hacia el sur',
                  datetime: '2024-01-16T14:45:00Z',
                },
              },
            },
          },
          404: { description: 'Instrucción no encontrada' },
          500: { description: 'Error interno del servidor' },
        },
      },
      delete: {
        tags: ['Instruccion'],
        summary: 'Delete a instruccion',
        description: 'Elimina una instrucción y su punto GPS asociado',
        responses: {
          200: {
            description: 'Instrucción eliminada exitosamente',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string' } } },
                example: { message: 'Instruccion deleted successfully' },
              },
            },
          },
          404: { description: 'Instrucción no encontrada' },
          500: { description: 'Error interno del servidor' },
        },
      },
    },
    '/instrucciones': {
      post: {
        tags: ['Instruccion'],
        summary: 'Create multiple instrucciones',
        description: 'Crea varias instrucciones en una sola operación. El campo `trail` es obligatorio en este endpoint y los valores deben ser secuenciales empezando en 1 (el vuelo no debe tener instrucciones previas). Se procesan en orden de trail',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'array', items: { $ref: '#/components/schemas/_InstruccionInput' } },
              example: [
                {
                  ID_Vuelo: '507f1f77bcf86cd799439020',
                  trail: 1,
                  Punto: { Latitud: -46.075, Longitud: -4.034, Altitud: 17.0, Heading: 170.4 },
                  directriz: 'Despegar',
                },
                {
                  ID_Vuelo: '507f1f77bcf86cd799439020',
                  trail: 2,
                  Punto: { Latitud: -46.080, Longitud: -4.040, Altitud: 30.0, Heading: 90.0 },
                  directriz: 'Avanzar al norte',
                },
              ],
            },
          },
        },
        responses: {
          201: {
            description: 'Instrucciones creadas exitosamente',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Instruccion' } },
              },
            },
          },
          500: { description: 'Error interno del servidor o secuencia de trail inválida' },
        },
      },
      put: {
        tags: ['Instruccion'],
        summary: 'Update multiple instrucciones',
        description: 'Actualiza varias instrucciones en una sola operación creando nuevas versiones de cada una. Los trails de las instrucciones deben ser consecutivos. Todas las instrucciones actualizadas comparten el mismo número de versión incrementado',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'array', items: { $ref: '#/components/schemas/_InstruccionBulkUpdate' } },
              example: [
                {
                  _id: '507f1f77bcf86cd799439011',
                  Punto: { Latitud: -47.0, Longitud: -5.0, Altitud: 20.0, Heading: 180.0 },
                  directriz: 'Volar hacia el sur',
                },
                {
                  _id: '507f1f77bcf86cd799439012',
                  directriz: 'Aterrizar',
                },
              ],
            },
          },
        },
        responses: {
          200: {
            description: 'Instrucciones actualizadas exitosamente',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Instruccion' } },
              },
            },
          },
          500: { description: 'Error interno del servidor, instrucción no encontrada o secuencia de trail inválida' },
        },
      },
    },
    '/media': {
      post: {
        tags: ['Media'],
        summary: 'Upload media',
        description: 'Sube un archivo de imagen o vídeo a Cloudinary y lo asocia a una instrucción de vuelo',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file', 'instruccionId'],
                properties: {
                  file: { type: 'string', format: 'binary', description: 'Archivo de imagen o vídeo' },
                  instruccionId: { type: 'string', description: 'ID de la instrucción a la que pertenece el archivo', example: '507f1f77bcf86cd799439011' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Archivo subido y guardado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Media' },
                example: {
                  _id: '507f1f77bcf86cd799439050',
                  url: 'https://res.cloudinary.com/demo/video/upload/pd-g3/abc123.mp4',
                  publicId: 'pd-g3/abc123',
                  type: 'video',
                  instruccionId: '507f1f77bcf86cd799439011',
                  createdAt: '2024-01-15T10:30:00Z',
                },
              },
            },
          },
          400: { description: 'No se proporcionó archivo o instruccionId inválido' },
          500: { description: 'Error interno del servidor o fallo al subir a Cloudinary' },
        },
      },
    },
    '/media/{instruccionId}': {
      parameters: [
        {
          name: 'instruccionId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID de la instrucción',
          example: '507f1f77bcf86cd799439011',
        },
      ],
      get: {
        tags: ['Media'],
        summary: 'Get media by instruccion',
        description: 'Obtiene todos los archivos multimedia asociados a una instrucción, ordenados por fecha de creación descendente',
        responses: {
          200: {
            description: 'Lista de archivos multimedia',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Media' } },
                example: [
                  {
                    _id: '507f1f77bcf86cd799439050',
                    url: 'https://res.cloudinary.com/demo/video/upload/pd-g3/abc123.mp4',
                    publicId: 'pd-g3/abc123',
                    type: 'video',
                    instruccionId: '507f1f77bcf86cd799439011',
                    createdAt: '2024-01-15T10:30:00Z',
                  },
                ],
              },
            },
          },
          500: { description: 'Error interno del servidor' },
        },
      },
    },
    '/media/{publicId}': {
      parameters: [
        {
          name: 'publicId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Public ID del archivo en Cloudinary (la "/" debe codificarse como %2F)',
          example: 'pd-g3%2Fabc123',
        },
      ],
      delete: {
        tags: ['Media'],
        summary: 'Delete media',
        description: 'Elimina un archivo de Cloudinary y su registro en MongoDB. El publicId tiene formato `pd-g3/nombre`, donde la barra debe ir codificada como `%2F` en la URL',
        responses: {
          200: {
            description: 'Archivo eliminado exitosamente',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { message: { type: 'string' } } },
                example: { message: 'Deleted successfully' },
              },
            },
          },
          500: { description: 'Error al eliminar de Cloudinary o de la base de datos' },
        },
      },
    },
    '/puntos': {
      put: {
        tags: ['Punto'],
        summary: 'Update multiple puntos',
        description: 'Actualiza varios puntos GPS en una sola operación',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/_PuntoUpdate' },
              },
              example: [
                { _id: '507f1f77bcf86cd799439011', Latitud: -47.0, Longitud: -5.0 },
                { _id: '507f1f77bcf86cd799439012', Altitud: 22.0, Heading: 90.0 },
              ],
            },
          },
        },
        responses: {
          200: {
            description: 'Puntos actualizados exitosamente',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Punto' } },
              },
            },
          },
          500: { description: 'Error interno del servidor' },
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
      Punto: {
        type: 'object',
        description: 'Coordenada GPS con altitud y orientación del dron',
        required: ['id', 'Latitud', 'Longitud', 'Altitud', 'Heading'],
        properties: {
          id: { type: 'string', description: 'ID único del punto', example: '507f1f77bcf86cd799439011' },
          Latitud: { type: 'number', description: 'Latitud en grados decimales', example: -46.075 },
          Longitud: { type: 'number', description: 'Longitud en grados decimales', example: -4.034 },
          Altitud: { type: 'number', description: 'Altitud en metros', example: 17.0 },
          Heading: { type: 'number', description: 'Orientación en grados (0-360)', example: 170.4 },
        },
      },
      Instruccion: {
        type: 'object',
        description: 'Instrucción de vuelo con su punto GPS populado',
        required: ['_id', 'ID_Vuelo', 'version', 'trail', 'Punto', 'directriz', 'datetime'],
        properties: {
          _id: { type: 'string', description: 'ID único de la instrucción', example: '507f1f77bcf86cd799439011' },
          ID_Vuelo: { type: 'string', description: 'ID del vuelo al que pertenece la instrucción', example: '507f1f77bcf86cd799439020' },
          version: { type: 'integer', description: 'Versión de la instrucción (se incrementa en cada actualización)', example: 1 },
          trail: { type: 'integer', description: 'Número de orden de la instrucción dentro del vuelo', example: 1 },
          Punto: { $ref: '#/components/schemas/Punto' },
          directriz: { type: 'string', description: 'Texto de la instrucción de vuelo', example: 'Volar hacia el norte' },
          datetime: { type: 'string', format: 'date-time', description: 'Fecha y hora de creación en formato ISO 8601', example: '2024-01-15T10:30:00Z' },
        },
      },
      Media: {
        type: 'object',
        description: 'Archivo multimedia (imagen o vídeo) almacenado en Cloudinary y asociado a una instrucción',
        required: ['_id', 'url', 'publicId', 'type', 'instruccionId', 'createdAt'],
        properties: {
          _id: { type: 'string', description: 'ID único del documento en MongoDB', example: '507f1f77bcf86cd799439050' },
          url: { type: 'string', format: 'uri', description: 'URL pública del archivo en Cloudinary', example: 'https://res.cloudinary.com/demo/video/upload/pd-g3/abc123.mp4' },
          publicId: { type: 'string', description: 'Identificador del archivo en Cloudinary (necesario para borrarlo)', example: 'pd-g3/abc123' },
          type: { type: 'string', enum: ['image', 'video'], description: 'Tipo de archivo', example: 'video' },
          instruccionId: { type: 'string', description: 'ID de la instrucción a la que pertenece el archivo', example: '507f1f77bcf86cd799439011' },
          createdAt: { type: 'string', format: 'date-time', description: 'Fecha y hora de subida', example: '2024-01-15T10:30:00Z' },
        },
      },
      _VueloInput: {
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
      _PuntoInput: {
        type: 'object',
        description: 'Datos para crear o actualizar un punto GPS',
        required: ['Latitud', 'Longitud', 'Altitud', 'Heading'],
        properties: {
          Latitud: { type: 'number', example: -46.075 },
          Longitud: { type: 'number', example: -4.034 },
          Altitud: { type: 'number', example: 17.0 },
          Heading: { type: 'number', example: 170.4 },
        },
      },
      _InstruccionInput: {
        type: 'object',
        description: 'Datos para crear una instrucción de vuelo. El Punto se proporciona como objeto completo y se crea automáticamente. En creación individual (POST /instruccion), el trail se asigna siempre de forma automática (el valor proporcionado se ignora). En creación masiva (POST /instrucciones), el campo trail es obligatorio, debe empezar en 1 y ser secuencial',
        required: ['ID_Vuelo', 'Punto', 'directriz'],
        properties: {
          ID_Vuelo: { type: 'string', description: 'ID del vuelo al que pertenece la instrucción', example: '507f1f77bcf86cd799439020' },
          trail: { type: 'integer', description: 'Número de orden de la instrucción. Ignorado en creación individual (siempre auto-asignado). Obligatorio y secuencial desde 1 en creación masiva', example: 1 },
          Punto: { $ref: '#/components/schemas/_PuntoInput' },
          directriz: { type: 'string', description: 'Texto de la instrucción de vuelo', example: 'Volar hacia el norte' },
        },
      },
      _InstruccionUpdateBody: {
        type: 'object',
        description: 'Datos opcionales para actualizar una instrucción. Genera una nueva versión inmutable conservando el trail y el vuelo originales',
        properties: {
          Punto: { $ref: '#/components/schemas/_PuntoInput' },
          directriz: { type: 'string', description: 'Nuevo texto de la instrucción', example: 'Volar hacia el sur' },
        },
      },
      _InstruccionBulkUpdate: {
        type: 'object',
        description: 'Datos para actualizar una instrucción dentro de una operación masiva (requiere _id)',
        required: ['_id'],
        properties: {
          _id: { type: 'string', description: 'ID de la instrucción a actualizar', example: '507f1f77bcf86cd799439011' },
          Punto: { $ref: '#/components/schemas/_PuntoInput' },
          directriz: { type: 'string', description: 'Nuevo texto de la instrucción', example: 'Volar hacia el sur' },
        },
      },
      _PuntoUpdate: {
        type: 'object',
        description: 'Datos para actualizar un punto existente (requiere _id)',
        required: ['_id'],
        properties: {
          _id: { type: 'string', description: 'ID del punto a actualizar', example: '507f1f77bcf86cd799439011' },
          Latitud: { type: 'number', example: -46.075 },
          Longitud: { type: 'number', example: -4.034 },
          Altitud: { type: 'number', example: 17.0 },
          Heading: { type: 'number', example: 170.4 },
        },
      },
    },
  },
};

export default openApiSpec;
# API Proyecto de drones
## Descripción

API para gestion de datos de aplicacion de drones, desarrollada en Node.js con TypeScript usando Express y Mongoose para la gestion de base de datos en MongoDB.

## Requisitos previos
Es necesario tener instalado
- Node.js
- MongoDB

## Instalación
Clona el repositorio y ejecuta el siguiente comando para instalar las dependencias:
```sh
npm install
```
## Configuración
Crea un fichero `.env` en la raíz del proyecto y define las siguientes variables de entorno
```sh
MONGO_URI=mongodb://localhost:27017/tu_base_de_datos
PORT=9000
```

## Ejecución
Para iniciar la API (tsc + cd ./dist + node server.js) o usar:
```sh
npm start
```

## Documentación
Scalar para visualizacion de las rutas está disponible en:
```
http://localhost:Puerto-configurado-dotenv/docs
```

## Deployment
### CI/CD automático

Cualquier push a la rama `main` dispara el workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que:

1. Construye la imagen Docker usando el [Dockerfile](Dockerfile) multi-stage.
2. La sube al GitHub Container Registry:
   ```
   ghcr.io/joaquinaroca/pdbackend_g-3:latest
   ```

### Deploy manual en el servidor

Una vez la imagen está publicada, conéctate al servidor y ejecuta:

```sh
# Autenticarse en GHCR (solo la primera vez)
echo <GITHUB_TOKEN> | docker login ghcr.io -u <usuario_github> --password-stdin

# Descargar la última imagen
docker pull ghcr.io/joaquinaroca/pdbackend_g-3:latest

# Arrancar el contenedor
docker run -d \
  --name pdbackend \
  --restart unless-stopped \
  -p 8104:8104 \
  --env-file .env \
  ghcr.io/joaquinaroca/pdbackend_g-3:latest
```

El fichero `.env` en el servidor debe contener como mínimo:

```sh
MONGO_URI=mongodb://<host>:<puerto>/<base_de_datos>
PORT=9000
```

Para actualizar a una nueva versión:

```sh
docker pull ghcr.io/joaquinaroca/pdbackend_g-3:latest
docker stop pdbackend && docker rm pdbackend
# volver a ejecutar el docker run de arriba
```

## Dependencies Principales
- `dotenv`: Gestión de variables de entorno.
- `mongodb` i `mongoose`: Base de datos MongoDB.
- `@scalar/express-api-reference`: Generación de documentación.
- `express`: Framework para la API.
- `bigint-crypto-utils`: Configuraciones de RSA

## Dependencies de Desarrollo
- `typescript`: Suport per a TypeScript.
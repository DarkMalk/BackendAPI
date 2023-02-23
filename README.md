# notes-api

### Como iniciar proyecto.

*Requisitos:*
- NodeJS
- MongoDB


Instalación de dependencias
```
npm install
```

Configurar archivo .env

**NOTA:** Las configuraciones del .env dependen de que se quiera realizar, hay tres URI para la base de datos de mongoDB las cuales corresponden
a los distintos estados de la app, una de ellas corresponde para el comando de `npm start` (Modo Producción - URI_DATABASE), `npm run dev` (Modo Desarrollo - URI_DATABASE_LOCAL) y `npm run test` (Modo de Tests - URI_DATABASE_LOCAL_TEST)
```
URI_DATABASE_LOCAL= <String>
URI_DATABASE_LOCAL_TEST= <String>
URI_DATABASE= <String>
PORT= <Number>
PASSJWT= <String>
```

Una vez tengamos configurado en el .env la base de datos en conjunto de la clave de JsonWebToken podremos poner a andar el proyecto junto con los siguientes comandos

Para modo producción
```
npm run start o npm start
```

Para modo desarrollo
```
npm run dev
```

Para modo de tests
```
npm run test
npm run test:watch
```

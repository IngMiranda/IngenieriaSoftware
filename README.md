# Sistema de Reservaciones - No tenemos nombre :(

Este es un sistema de reservaciones desarrollado con Node.js y Express.js, y diseñado bajo una Arquitectura de Tres Capas con un enfoque en seguridad (doble base de datos) y enfocado a controladores y servicios.

## Arquitectura y Estructura

El proyecto sigue una **Arquitectura de Tres Capas** con separación responsabilidades (SoC).

| Capa                     | Responsabilidad                         | Tecnologías                           |
| :----------------------- | :-------------------------------------- | :------------------------------------ |
| **Presentación**         | Interfaz de Usuario y Lógica de Vista.  | HTML, JavaScript jQuery, Tailwind CSS |
| **Aplicación (Backend)** | Lógica de Negocio, API REST, Seguridad. | Node.js, Express.js                   |
| **Datos**                | Persistencia de Información.            | MariaDB (Doble Instancia)             |

---

### Estructura del Backend (`/api`)

El backend utiliza el patrón **Controller-Service-DataHandler** :

1.  **`/controllers`**: Reciben peticiones HTTP (req, res), validan inputs, y llaman a los Servicios. **No contienen lógica de negocio.**
2.  **`/services`**: Contienen toda la Lógica de Negocio. Interactúan con el `QueryHandler`.
3.  **`/config`**: Configuración de la aplicación (conexión a MariaDB).
4.  **`/utils`**: Utilidades generales:
    - `QueryHandler.js`: Abstracción para **consultas preparadas** (seguridad contra Inyección SQL).
    - `Logger.js`: Clase centralizada para el registro de eventos y errores.

### Seguridad y Base de Datos

Se utiliza una estrategia de **Doble Base de Datos (MariaDB)** para una mayor seguridad y aislamiento:

- **DB AUTH**: Almacena exclusivamente información sensible de **Usuarios** (credenciales, permisos).
- **DB MAIN**: Almacena todos los **Datos de Reservaciones** y la lógica de negocio (Empresas, Reservas, Horarios).

---

## Tecnologías Utilizadas

### Backend y Despliegue

| Rol               | Tecnología | Propósito Específico                                                     |
| :---------------- | :--------- | :----------------------------------------------------------------------- |
| **Plataforma**    | Node.js    | Entorno de ejecución asíncrono.                                          |
| **Framework**     | Express.js | Creación de la API REST.                                                 |
| **Base de Datos** | MariaDB    | Sistema de gestión de bases de datos relacional.                         |
| **Driver/ORM**    | `mariadb`  | Conexión directa y uso de Pools para la BD.                              |
| **Hosting**       | Vercel     | Despliegue como _Serverless Function_ y _Hosting_ estático del Frontend. |

### Frontend

| Rol            | Tecnología        | Propósito Específico                                          |
| :------------- | :---------------- | :------------------------------------------------------------ |
| **Estructura** | HTML              | Marcado de la interfaz.                                       |
| **Lógica**     | JavaScript jQuery | Manipulación del DOM y manejo de peticiones a la API.         |
| **Diseño**     | Tailwind CSS      | Framework CSS de utilidad para el diseño responsivo y rápido. |

### Prerequisitos

- Node.js (versión 16 o superior)
- Una instancia de MariaDB (o un Docker, pero ahorita no).

### Instalación

1.  Clona este repositorio:
    ```bash
    git clone [https://github.com/IngMiranda/IngenieriaSoftware.git](https://github.com/IngMiranda/IngenieriaSoftware.git) IngenieriaSoftware
    cd IngenieriaSoftware
    ```
2.  Instala las dependencias del Backend:
    ```bash
    npm install
    ```
3.  Crea tu archivo `.env` en la raíz del proyecto y configúralo

### Desarrollo

Para iniciar el servidor en modo de desarrollo (con `nodemon`):

```bash
npm run dev
```

### Notas

Si cuentas con probleas con los logs, procura otorgar los permisos correspondientes para crear y escribir en archivos de tu sistema de directorios.

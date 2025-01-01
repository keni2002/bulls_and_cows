![Logo](https://github.com/keni2002/bulls_and_cows/blob/main/fronted/public/logo.png)

# Bulls and Cows Game

Bienvenido a **Bulls and Cows**, un clásico juego de deducción reinventado para la web. En este proyecto, hemos creado una aplicación completa con un backend robusto y un frontend interactivo que permite a los usuarios jugar, ver solicitudes de juego y administrar sus perfiles.

## Descripción del Proyecto

**Bulls and Cows** es un juego de lápiz y papel tradicional en el que los jugadores intentan adivinar un número secreto de cuatro dígitos de su oponente. Este proyecto toma el concepto clásico y lo transforma en una experiencia interactiva en línea, permitiendo a los usuarios registrarse, iniciar sesión, iniciar partidas y mucho más.

### Funcionalidades Principales

- **Registro y Autenticación**: Los usuarios pueden registrarse e iniciar sesión en sus cuentas.
- **Solicitudes de Juego**: Los usuarios pueden enviar y recibir solicitudes de juego.
- **Juego Interactivo**: Los jugadores pueden hacer conjeturas y ver las respuestas en tiempo real.
- **Administración de Perfiles**: Los usuarios pueden actualizar sus perfiles y fotos de perfil.
- **Lista de Juegos**: Los usuarios pueden ver una lista de sus juegos activos y completados.

## Tecnologías Utilizadas

### Backend

- **Django**: Framework de desarrollo web utilizado para construir el backend.
- **Django REST Framework**: Utilizado para construir la API RESTful.
- **PostgreSQL**: Base de datos utilizada para almacenar los datos de la aplicación.

### Frontend

- **React**: Biblioteca de JavaScript utilizada para construir la interfaz de usuario.
- **Bootstrap**: Framework CSS utilizado para el diseño y la presentación.
- **Cloudinary**: Servicio externo utilizado para almacenar y gestionar las fotos de perfil de los usuarios.

## Instalación y Configuración

### Backend

1. Clona el repositorio:
    ```bash
    git clone https://github.com/keni2002/bulls_and_cows.git
    cd bulls_and_cows/backend
    ```

2. Crea un entorno virtual e instala las dependencias:
    ```bash
    python3 -m venv env
    source env/bin/activate  # En Windows usa `env\Scripts\activate`
    pip install -r requirements.txt
    ```

3. Configura la base de datos en el archivo `settings.py`.

4. Ejecuta las migraciones:
    ```bash
    python manage.py migrate
    ```

5. Inicia el servidor de desarrollo:
    ```bash
    python manage.py runserver
    ```

### Frontend

1. Ve al directorio del frontend:
    ```bash
    cd ../frontend
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Configura Cloudinary en el archivo `.env`:
    ```env
    REACT_APP_CLOUDINARY_CLOUD_NAME=tu_cloud_name
    REACT_APP_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
    ```

4. Inicia el servidor de desarrollo:
    ```bash
    npm start
    ```

## Uso

1. Abre tu navegador y ve a `http://localhost:3000` para ver la aplicación en acción.
2. Regístrate o inicia sesión en tu cuenta.
3. Explora las funcionalidades del juego: envía solicitudes, acepta solicitudes y juega.
4. Administra tu perfil y actualiza tu foto de perfil utilizando el servicio Cloudinary.

## Contribuir

¡Las contribuciones son bienvenidas! Para contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu función o corrección de errores (`git checkout -b feature/nueva-funcion`).
3. Realiza tus cambios y haz commits con mensajes descriptivos (`git commit -m 'Añadir nueva función'`).
4. Empuja tus cambios a la rama (`git push origin feature/nueva-funcion`).
5. Abre una Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Puedes ver los detalles de la licencia [aquí](https://github.com/keni2002/bulls_and_cows/blob/main/LICENSE).

## Contacto

Para cualquier pregunta o información adicional, siéntete libre de contactarnos a través de [GitHub](https://github.com/keni2002/bulls_and_cows).

---

¡Gracias por utilizar **Bulls and Cows**! ¡Diviértete jugando!



# bulls_and_cows
Bulls and Cows is a fun game played online with friends. Let's eat green grass, as green as the Django logo.
https://github.com/keni2002/bulls_and_cows/blob/main/fronted/public/logo.png

````
#good if you delete the random key

 python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
````


````
    npm create vite@latest fronted --  --template react 
    
````
https://getbootstrap.com/docs/5.2/getting-started/vite/

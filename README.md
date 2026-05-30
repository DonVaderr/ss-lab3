Claro, aquí tienes un `README.md` completo para copiar y pegar en tu proyecto.

# Laboratorio 3: Detector de Malware en Archivos Adjuntos

## Descripción del proyecto

Este proyecto consiste en el desarrollo de un sistema web completo que permite subir archivos adjuntos y analizarlos mediante ClamAV, un motor antivirus open source. El sistema cuenta con una interfaz web responsiva para la carga de archivos y un backend desarrollado con Flask que recibe, valida, almacena temporalmente y escanea los documentos enviados por el usuario.

El objetivo principal del sistema es detectar posibles amenazas en archivos antes de considerarlos seguros, mostrando al usuario un resultado dinámico que indica si el archivo está limpio, infectado o si ocurrió un error durante el proceso.

## Objetivo general

Desarrollar un sistema web completo que permita subir documentos, escanearlos con ClamAV para detectar malware y presentar los resultados de forma dinámica al usuario, utilizando herramientas de inteligencia artificial para acelerar el desarrollo.

## Objetivos específicos

* Crear una interfaz web responsiva para la subida de archivos.
* Implementar una API RESTful para el procesamiento de archivos.
* Integrar ClamAV como motor antivirus open source.
* Validar archivos por tipo y tamaño.
* Mostrar respuestas dinámicas según el resultado del escaneo.
* Utilizar herramientas de inteligencia artificial como apoyo para la generación, revisión y corrección de código.

## Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript
* Python
* Flask
* Flask-CORS
* Werkzeug
* ClamAV
* PowerShell
* Visual Studio Code

## Estructura del proyecto

```text
seguridad/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── uploads/
├── temp/
├── .gitignore
└── README.md
```

Nota: la carpeta `venv/` se utiliza localmente para el entorno virtual, pero no debe subirse al repositorio.

## Requisitos previos

Antes de ejecutar el proyecto, es necesario contar con lo siguiente instalado:

* Python 3
* Visual Studio Code
* ClamAV para Windows
* PowerShell
* Navegador web actualizado

## Instalación de dependencias

Primero se debe abrir PowerShell y entrar a la carpeta del backend:

```powershell
cd "C:\Users\Usuario\OneDrive\Escritorio\seguridad\backend"
```

Crear el entorno virtual:

```powershell
python -m venv venv
```

Activar el entorno virtual:

```powershell
.\venv\Scripts\Activate.ps1
```

Si PowerShell bloquea la activación del entorno virtual, ejecutar:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego volver a activar el entorno virtual:

```powershell
.\venv\Scripts\Activate.ps1
```

Instalar las dependencias necesarias:

```powershell
pip install flask flask-cors werkzeug clamd
```

Guardar las dependencias en `requirements.txt`:

```powershell
pip freeze > requirements.txt
```

## Configuración de ClamAV en Windows

ClamAV debe estar instalado en el sistema. Normalmente se instala en la siguiente ruta:

```text
C:\Program Files\ClamAV
```

Para ejecutar ClamAV, abrir PowerShell como administrador y entrar a la carpeta de instalación:

```powershell
cd "C:\Program Files\ClamAV"
```

Ejecutar el servicio de ClamAV:

```powershell
.\clamd.exe
```

Esta terminal debe permanecer abierta mientras se utiliza el sistema, ya que el backend se comunica con ClamAV para realizar el escaneo de archivos.

## Ejecución del backend

Con ClamAV ejecutándose en otra terminal, abrir PowerShell en la carpeta del backend:

```powershell
cd "C:\Users\Usuario\OneDrive\Escritorio\seguridad\backend"
```

Activar el entorno virtual:

```powershell
.\venv\Scripts\Activate.ps1
```

Ejecutar la aplicación Flask:

```powershell
python app.py
```

Si todo funciona correctamente, se mostrará un mensaje similar a:

```text
Running on http://127.0.0.1:5000
```

Para comprobar que la API está funcionando, abrir en el navegador:

```text
http://127.0.0.1:5000
```

La respuesta esperada es:

```json
{
  "message": "API del detector de malware funcionando"
}
```

## Ejecución del frontend

Abrir otra terminal de PowerShell y entrar a la carpeta del frontend:

```powershell
cd "C:\Users\Usuario\OneDrive\Escritorio\seguridad\frontend"
```

Abrir el archivo `index.html`:

```powershell
start index.html
```

También se puede abrir desde Visual Studio Code usando la extensión Live Server.

## Funcionamiento general del sistema

El funcionamiento del sistema es el siguiente:

1. El usuario selecciona o arrastra un archivo en la interfaz web.
2. El frontend valida que el archivo tenga una extensión permitida.
3. El frontend valida que el archivo no supere el tamaño máximo permitido.
4. El archivo se envía al backend mediante una petición HTTP.
5. El backend recibe el archivo y lo almacena temporalmente.
6. El backend solicita a ClamAV realizar el escaneo.
7. ClamAV analiza el archivo y devuelve el resultado.
8. El backend envía el resultado al frontend.
9. La interfaz muestra si el archivo está limpio, infectado o si ocurrió un error.

## Tipos de archivo permitidos

El sistema permite subir los siguientes tipos de archivo:

* PDF
* DOC
* DOCX
* TXT
* ZIP

## Tamaño máximo permitido

El tamaño máximo permitido por archivo es de 10 MB.

Esta validación se realiza tanto en el frontend como en el backend.

## Endpoints de la API

### GET /

Verifica que la API esté funcionando correctamente.

Respuesta esperada:

```json
{
  "message": "API del detector de malware funcionando"
}
```

### POST /api/upload

Recibe un archivo mediante una petición `multipart/form-data`, valida su tipo y tamaño, y lo guarda temporalmente en la carpeta `uploads`.

Respuesta exitosa:

```json
{
  "message": "Archivo subido correctamente",
  "fileId": "identificador-del-archivo",
  "filename": "archivo.txt"
}
```

### POST /api/scan/:fileId

Inicia el escaneo del archivo usando ClamAV.

Respuesta exitosa:

```json
{
  "message": "Escaneo realizado",
  "scanId": "identificador-del-escaneo"
}
```

### GET /api/status/:scanId

Consulta el estado actual del escaneo.

Estados posibles:

```text
pending
scanning
completed
error
```

Respuesta esperada:

```json
{
  "scanId": "identificador-del-escaneo",
  "status": "completed"
}
```

### GET /api/result/:scanId

Obtiene el resultado final del escaneo.

Respuesta para archivo limpio:

```json
{
  "status": "completed",
  "fileId": "identificador-del-archivo",
  "filename": "archivo.txt",
  "result": "clean",
  "threat": null
}
```

Respuesta para archivo infectado:

```json
{
  "status": "completed",
  "fileId": "identificador-del-archivo",
  "filename": "eicar.txt",
  "result": "infected",
  "threat": "Eicar-Signature"
}
```

### DELETE /api/cleanup/:fileId

Elimina archivos temporales almacenados en el servidor.

Respuesta esperada:

```json
{
  "message": "Archivo temporal eliminado correctamente"
}
```

## Validaciones implementadas

### Validaciones en frontend

* Validación de extensión del archivo.
* Validación de tamaño máximo.
* Interfaz drag and drop.
* Barra de progreso.
* Mensajes de estado.
* Resultado visual para archivo limpio.
* Resultado visual para archivo infectado.
* Resultado visual para errores.

### Validaciones en backend

* Validación de existencia del archivo.
* Validación de nombre del archivo.
* Validación de extensiones permitidas.
* Validación de tamaño máximo mediante Flask.
* Uso de nombres seguros con `secure_filename`.
* Manejo de errores con respuestas JSON.
* Almacenamiento temporal del archivo.
* Escaneo con ClamAV.

## Casos de prueba realizados

### Caso 1: Subida de archivo limpio

Se creó y subió un archivo de texto normal llamado `prueba.txt`.

Resultado esperado:

```text
Archivo limpio
```

Resultado obtenido:

```text
No se detectaron amenazas.
```

### Caso 2: Archivo de prueba EICAR

Se utilizó el archivo de prueba EICAR para comprobar la detección de amenazas por parte de ClamAV.

Contenido utilizado:

```text
X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*
```

Resultado esperado:

```text
Archivo infectado
```

Nota: en Windows, Microsoft Defender puede detectar y eliminar el archivo EICAR antes de que sea procesado por el sistema. Por esta razón, para realizar la prueba puede ser necesario usar una carpeta controlada y agregarla temporalmente como exclusión en Windows Defender. Al finalizar la prueba, la exclusión debe eliminarse.

### Caso 3: Archivo no permitido

Se intentó subir un archivo con una extensión no permitida, por ejemplo `.png`, `.jpg` o `.exe`.

Resultado esperado:

```text
Tipo de archivo no permitido.
```

### Caso 4: Límite de tamaño

Se configuró un límite máximo de 10 MB por archivo.

Resultado esperado:

```text
El archivo supera el límite de 10MB.
```

### Caso 5: Prueba de disponibilidad del backend

Se accedió al endpoint principal:

```text
http://127.0.0.1:5000
```

Resultado esperado:

```json
{
  "message": "API del detector de malware funcionando"
}
```

## Uso de inteligencia artificial

Durante el desarrollo de esta práctica se utilizaron herramientas de inteligencia artificial para acelerar el proceso de construcción del sistema. La IA fue utilizada como apoyo para:

* Generar una estructura inicial del frontend.
* Proponer el diseño visual de la interfaz.
* Crear la lógica de validación de archivos.
* Diseñar los endpoints principales de la API REST.
* Corregir errores de dependencias en Python.
* Adaptar la configuración del proyecto a Windows y PowerShell.
* Resolver problemas relacionados con Flask, ClamAV y el entorno virtual.
* Mejorar la documentación del proyecto.

Aunque la IA ayudó a acelerar el desarrollo, el código fue revisado, adaptado y probado manualmente para asegurar su funcionamiento.

## Problemas encontrados

Durante el desarrollo se presentaron algunos problemas técnicos:

1. PowerShell no permitía activar el entorno virtual por políticas de ejecución.
2. VS Code no detectaba correctamente las dependencias instaladas.
3. Flask no se encontraba instalado inicialmente en el entorno virtual.
4. ClamAV requería configuración especial en Windows.
5. Windows Defender detectaba el archivo EICAR antes de que pudiera ser escaneado desde la aplicación.
6. Fue necesario verificar rutas absolutas para evitar errores al ejecutar archivos desde PowerShell.

## Soluciones aplicadas

* Se creó y activó correctamente un entorno virtual de Python.
* Se instalaron las dependencias dentro del entorno virtual.
* Se seleccionó el intérprete correcto en Visual Studio Code.
* Se ejecutó Flask desde PowerShell con el entorno virtual activo.
* Se utilizó ClamAV desde Windows mediante `clamd.exe`.
* Se probó el backend desde el navegador.
* Se realizaron pruebas con archivos limpios y archivos de prueba.

## Evidencias recomendadas

Para documentar la práctica, se recomienda incluir capturas de:

* Estructura de carpetas del proyecto.
* Terminal con Flask corriendo.
* Terminal con ClamAV corriendo.
* Interfaz web principal.
* Archivo limpio detectado correctamente.
* Archivo EICAR detectado como amenaza o evidencia de bloqueo por Windows Defender.
* Archivo no permitido rechazado.
* Código de los endpoints principales.
* Archivo `requirements.txt`.

## Archivo .gitignore recomendado

El proyecto debe incluir un archivo `.gitignore` con el siguiente contenido:

```gitignore
backend/venv/
backend/__pycache__/
uploads/*
temp/*
*.log
.env
```

Esto evita subir al repositorio archivos innecesarios, temporales o dependencias locales.

## Comandos útiles de Git

Inicializar repositorio:

```powershell
git init
```

Agregar archivos:

```powershell
git add .
```

Crear commit:

```powershell
git commit -m "Laboratorio 3 detector de malware con Flask y ClamAV"
```

Conectar con repositorio remoto:

```powershell
git remote add origin URL_DEL_REPOSITORIO
```

Subir cambios:

```powershell
git branch -M main
git push -u origin main
```

## Conclusión

Esta práctica permitió desarrollar un sistema web funcional para la detección de malware en archivos adjuntos. A través de la integración de Flask, JavaScript y ClamAV, se comprendió la importancia de validar y analizar archivos antes de procesarlos dentro de una aplicación web.

También se reforzaron conocimientos sobre APIs REST, manejo de archivos, validaciones de seguridad, comunicación entre frontend y backend, configuración de entornos virtuales y uso de herramientas antivirus open source.

El uso de inteligencia artificial facilitó la generación de código y la resolución de problemas, pero fue necesario realizar pruebas, ajustes y validaciones manuales para asegurar que el sistema funcionara correctamente en un entorno Windows con PowerShell.

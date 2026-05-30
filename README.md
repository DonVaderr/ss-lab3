# Laboratorio 3: Detector de Malware en Archivos Adjuntos

## Descripción

Este proyecto consiste en un sistema web que permite subir archivos adjuntos y escanearlos mediante ClamAV para detectar posibles amenazas. El sistema cuenta con un frontend desarrollado con HTML, CSS y JavaScript, y un backend desarrollado con Python y Flask.

## Objetivo

Desarrollar una aplicación web completa que permita cargar documentos, procesarlos desde una API REST y mostrar al usuario si el archivo se encuentra limpio, infectado o si ocurrió algún error durante el escaneo.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Python
- Flask
- Flask-CORS
- ClamAV
- PowerShell
- Visual Studio Code

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
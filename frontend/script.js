const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const selectFileBtn = document.getElementById("select-file-btn");
const scanBtn = document.getElementById("scan-btn");
const fileInfo = document.getElementById("file-info");
const fileNameText = document.getElementById("file-name");
const progressBar = document.getElementById("progress-bar");
const statusText = document.getElementById("status-text");
const resultBox = document.getElementById("result-box");

const API_URL = "http://127.0.0.1:5000";

// Laboratorio 3: Detector de Malware en Archivos Adjuntos
// Frontend desarrollado con HTML, CSS y JavaScript.
// Se utilizó IA como apoyo para crear la lógica de drag & drop,
// validación de archivos, conexión con la API y visualización dinámica de resultados.

let selectedFile = null;

const allowedExtensions = ["pdf", "doc", "docx", "txt", "zip"];
const maxFileSize = 10 * 1024 * 1024;

selectFileBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    handleFile(fileInput.files[0]);
  }
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.classList.remove("active");

  if (event.dataTransfer.files.length > 0) {
    handleFile(event.dataTransfer.files[0]);
  }
});

scanBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  resetResult();

  try {
    statusText.textContent = "Subiendo archivo...";
    progressBar.style.width = "25%";

    const formData = new FormData();
    formData.append("file", selectedFile);

    const uploadResponse = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(uploadData.error || "Error al subir el archivo.");
    }

    progressBar.style.width = "50%";
    statusText.textContent = "Archivo subido. Escaneando con ClamAV...";

    const scanResponse = await fetch(`${API_URL}/api/scan/${uploadData.fileId}`, {
      method: "POST",
    });

    const scanData = await scanResponse.json();

    if (!scanResponse.ok) {
      throw new Error(scanData.details || scanData.error || "Error al escanear.");
    }

    progressBar.style.width = "80%";
    statusText.textContent = "Obteniendo resultado...";

    const resultResponse = await fetch(`${API_URL}/api/result/${scanData.scanId}`);
    const resultData = await resultResponse.json();

    if (!resultResponse.ok) {
      throw new Error(resultData.error || "No se pudo obtener el resultado.");
    }

    progressBar.style.width = "100%";
    showResult(resultData);
  } catch (error) {
    progressBar.style.width = "100%";
    statusText.textContent = "Ocurrió un error durante el proceso.";
    showError(error.message);
  }
});

function handleFile(file) {
  resetResult();
  progressBar.style.width = "0%";

  const extension = getFileExtension(file.name);

  if (!allowedExtensions.includes(extension)) {
    selectedFile = null;
    scanBtn.disabled = true;
    fileInfo.classList.add("hidden");
    statusText.textContent = "Tipo de archivo no permitido. Usa PDF, DOC, DOCX, TXT o ZIP.";
    return;
  }

  if (file.size > maxFileSize) {
    selectedFile = null;
    scanBtn.disabled = true;
    fileInfo.classList.add("hidden");
    statusText.textContent = "El archivo supera el límite de 10MB.";
    return;
  }

  selectedFile = file;
  fileNameText.textContent = `${file.name} (${formatFileSize(file.size)})`;
  fileInfo.classList.remove("hidden");
  scanBtn.disabled = false;
  statusText.textContent = "Archivo listo para subir y escanear.";
}

function showResult(data) {
  resultBox.classList.remove("hidden");
  resultBox.classList.remove("result-clean", "result-infected", "result-error");

  if (data.result === "clean") {
    statusText.textContent = "Escaneo completado.";
    resultBox.classList.add("result-clean");
    resultBox.innerHTML = `
      ✅ Archivo limpio<br>
      Nombre: ${data.filename}<br>
      Estado: No se detectaron amenazas.
    `;
  } else if (data.result === "infected") {
    statusText.textContent = "Amenaza detectada.";
    resultBox.classList.add("result-infected");
    resultBox.innerHTML = `
      ⚠️ Archivo infectado<br>
      Nombre: ${data.filename}<br>
      Amenaza: ${data.threat}
    `;
  } else {
    showError("El escaneo terminó con un estado desconocido.");
  }
}

function showError(message) {
  resultBox.classList.remove("hidden");
  resultBox.classList.remove("result-clean", "result-infected", "result-error");
  resultBox.classList.add("result-error");
  resultBox.innerHTML = `
    ❌ Error<br>
    ${message}
  `;
}

function resetResult() {
  resultBox.classList.add("hidden");
  resultBox.innerHTML = "";
  resultBox.classList.remove("result-clean", "result-infected", "result-error");
}

function getFileExtension(filename) {
  return filename.split(".").pop().toLowerCase();
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
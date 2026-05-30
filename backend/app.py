import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import clamd

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "..", "uploads")

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "txt", "zip"}
MAX_FILE_SIZE = 10 * 1024 * 1024

files_storage = {}
scan_results = {}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No se recibió ningún archivo"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "El archivo no tiene nombre"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Tipo de archivo no permitido"}), 400

    filename = secure_filename(file.filename)
    file_id = str(uuid.uuid4())
    saved_filename = f"{file_id}_{filename}"
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], saved_filename)

    file.save(file_path)

    files_storage[file_id] = {
        "original_name": filename,
        "path": file_path,
        "size": os.path.getsize(file_path)
    }

    return jsonify({
        "message": "Archivo subido correctamente",
        "fileId": file_id,
        "filename": filename
    }), 200


@app.route("/api/scan/<file_id>", methods=["POST"])
def scan_file(file_id):
    if file_id not in files_storage:
        return jsonify({"error": "Archivo no encontrado"}), 404

    scan_id = str(uuid.uuid4())
    file_info = files_storage[file_id]
    file_path = file_info["path"]

    scan_results[scan_id] = {
        "status": "scanning",
        "fileId": file_id,
        "filename": file_info["original_name"],
        "result": None,
        "threat": None
    }

    try:
        cd = clamd.ClamdNetworkSocket(host="127.0.0.1", port=3310)
        result = cd.scan(file_path)

        if result is None:
            scan_results[scan_id]["status"] = "completed"
            scan_results[scan_id]["result"] = "clean"
            scan_results[scan_id]["threat"] = None
        else:
            scan_data = result.get(file_path)

            if scan_data is None:
                scan_results[scan_id]["status"] = "completed"
                scan_results[scan_id]["result"] = "clean"
                scan_results[scan_id]["threat"] = None
            else:
                status = scan_data[0]
                threat = scan_data[1]

                if status == "FOUND":
                    scan_results[scan_id]["status"] = "completed"
                    scan_results[scan_id]["result"] = "infected"
                    scan_results[scan_id]["threat"] = threat
                else:
                    scan_results[scan_id]["status"] = "completed"
                    scan_results[scan_id]["result"] = "clean"
                    scan_results[scan_id]["threat"] = None

        return jsonify({
            "message": "Escaneo realizado",
            "scanId": scan_id
        }), 200

    except Exception as e:
        scan_results[scan_id]["status"] = "error"
        scan_results[scan_id]["result"] = "error"
        scan_results[scan_id]["threat"] = str(e)

        return jsonify({
            "error": "Error al escanear el archivo",
            "details": str(e),
            "scanId": scan_id
        }), 500


@app.route("/api/status/<scan_id>", methods=["GET"])
def get_status(scan_id):
    if scan_id not in scan_results:
        return jsonify({"error": "Escaneo no encontrado"}), 404

    return jsonify({
        "scanId": scan_id,
        "status": scan_results[scan_id]["status"]
    }), 200


@app.route("/api/result/<scan_id>", methods=["GET"])
def get_result(scan_id):
    if scan_id not in scan_results:
        return jsonify({"error": "Resultado no encontrado"}), 404

    return jsonify(scan_results[scan_id]), 200


@app.route("/api/cleanup/<file_id>", methods=["DELETE"])
def cleanup_file(file_id):
    if file_id not in files_storage:
        return jsonify({"error": "Archivo no encontrado"}), 404

    file_path = files_storage[file_id]["path"]

    try:
        if os.path.exists(file_path):
            os.remove(file_path)

        del files_storage[file_id]

        return jsonify({
            "message": "Archivo temporal eliminado correctamente"
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Error al eliminar archivo",
            "details": str(e)
        }), 500


@app.errorhandler(413)
def file_too_large(error):
    return jsonify({"error": "El archivo supera el límite de 10MB"}), 413


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "API del detector de malware funcionando"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
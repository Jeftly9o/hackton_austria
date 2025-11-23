import pandas as pd
import ollama
import os
from pathlib import Path
import sys
import json
from flask import Flask, jsonify
from flask_cors import CORS

# -------------------------
# CARGAR CSV
# -------------------------

current_dir = Path(__file__).resolve().parent
csv_path = current_dir.parent / 'database' / 'base_datos.csv'

if not csv_path.exists():
    print("Error: No se encuentra el archivo CSV")
    sys.exit(1)

# -------------------------
# FUNCIÓN DE ANÁLISIS
# -------------------------

def analizar_correo_local(asunto, contenido):
    prompt = f"""
    Analiza el siguiente correo.
    Asunto: {asunto}
    Contenido: {contenido}
    
    Responde ÚNICAMENTE con un JSON válido con este formato exacto:
    {{
        "sentimiento": "Positivo/Negativo/Neutral",
        "problemas": "Resumen breve o 'Ninguno'",
        "calificacion": Entero del 1 al 10
    }}
    """
    try:
        response = ollama.chat(model='llama3.1', messages=[
            {'role': 'user', 'content': prompt}
        ])

        texto = response['message']['content']
        inicio = texto.find('{')
        fin = texto.rfind('}') + 1

        if inicio != -1 and fin != -1:
            return json.loads(texto[inicio:fin])
        else:
            return {"sentimiento": "Neutral", "problemas": "Error Formato", "calificacion": 5}

    except Exception as e:
        return {"sentimiento": "Error", "problemas": str(e), "calificacion": 0}


# -------------------------
# PROCESAR CSV UNA VEZ
# -------------------------

df = pd.read_csv(csv_path).head(5)

resultados_individuales = []
todos_los_problemas = []
todas_las_calificaciones = []

for _, row in df.iterrows():
    asunto = row['Asunto']
    contenido = row['Contenido']

    resultado = analizar_correo_local(asunto, contenido)

    resultados_individuales.append({
        "asunto": asunto,
        "contenido": contenido,
        "sentimiento": resultado["sentimiento"],
        "problemas": resultado["problemas"],
        "calificacion": resultado["calificacion"]
    })

    # Acumular para resumen general
    if resultado["problemas"] not in ["Ninguno", "Error"]:
        todos_los_problemas.append(resultado["problemas"])

    if isinstance(resultado["calificacion"], (int, float)) and resultado["calificacion"] > 0:
        todas_las_calificaciones.append(resultado["calificacion"])


# Calcular promedio
promedio = sum(todas_las_calificaciones) / len(todas_las_calificaciones) if todas_las_calificaciones else 0


# -------------------------
# CREAR RESUMEN GLOBAL
# -------------------------

prompt_final = f"""
Genera un resumen ejecutivo basado en estos problemas:

{todos_los_problemas}

Promedio de calificaciones: {promedio:.2f}/10

Dame:
- Los 3 problemas principales
- Una conclusión general
"""

try:
    resumen = ollama.chat(model='llama3.1', messages=[
        {'role': 'user', 'content': prompt_final}
    ])
    resumen_texto = resumen["message"]["content"]

except:
    resumen_texto = "Error al generar resumen."


# -------------------------
# FLASK API
# -------------------------

app = Flask(__name__)
CORS(app)

@app.route('/api/analisis-individual', methods=['GET'])
def obtener_datos():
    return jsonify(resultados_individuales)

@app.route('/api/resumen-global', methods=['GET'])
def obtener_datos_finales():
    respuesta_final = {
        "problemas_detectados": todos_los_problemas,
        "calificacion_promedio": promedio,
        "resumen_ejecutivo": resumen_texto
    }
    return jsonify(respuesta_final)

app.run(debug=True, port=5000)

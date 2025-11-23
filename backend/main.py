import pandas as pd
import ollama
import os
from pathlib import Path
import sys
import json
from flask import Flask, jsonify
from flask_cors import CORS

current_dir = Path(__file__).resolve().parent
csv_path = current_dir.parent / 'database' / 'base_datos.csv'
print(f"Buscando archivo en: {csv_path}")
if not csv_path.exists():
    print("Error: No se encuentra el archivo")
    sys.exit(1)

app = Flask(__name__)
# Habilita CORS para permitir peticiones desde React
CORS(app)
@app.route('/api/llama', methods=['GET'])


def obtener_datos():
    respuesta = {
        "asunto":{asunto},
        "contenido":{contenido},
        "sentimiento": resultado['sentimiento'],
        "problemas": resultado['problemas'],
        "calificacion": resultado['calificacion']   
    }

    return jsonify(respuesta)
def obtener_datos_finales():
    respuesta_final = {
        "problemas_detectados": todos_los_problemas,
        "calificacion_promedio": promedio,
        "resumen_ejecutivo": resumen['message']['content']
    }
    return {"mensaje": "API funcionando correctamente"}


def analizar_correo_local(asunto, contenido):
    prompt = f"""
    Analiza el siguiente correo.
    Asunto: {asunto}
    Contenido: {contenido}
    
    Responde ÚNICAMENTE con un JSON válido con este formato exacto:
    {{
        "sentimiento": "Positivo/Negativo/Neutral",
        "problemas": "Resumen muy breve del problema o 'Ninguno'",
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
        return {"sentimiento": "Error", "problemas": f"Error: {e}", "calificacion": 0}
    
try:
    df = pd.read_csv(csv_path)
    df = df.head(5)
except Exception as e:
    sys.exit(1)

todos_los_problemas = []
todas_las_calificaciones = []

for index, row in df.iterrows():
    asunto = row['Asunto']
    contenido = row['Contenido']
    
    resultado = analizar_correo_local(asunto, contenido)
    enviar=obtener_datos
    if resultado['problemas'] != 'Ninguno' and resultado['problemas'] != 'Error':
        todos_los_problemas.append(resultado['problemas'])
    
    if isinstance(resultado['calificacion'], (int, float)) and resultado['calificacion'] > 0:
        todas_las_calificaciones.append(resultado['calificacion'])

print("\n Generando Resumen General...\n")

if todas_las_calificaciones:
    promedio = sum(todas_las_calificaciones) / len(todas_las_calificaciones)
else:
    promedio = 0

texto_problemas = "\n- ".join(todos_los_problemas[:50]) 

prompt_final = f"""
Genera un resumen ejecutivo breve basado en estos datos:
1. Lista de problemas detectados:
{texto_problemas}

2. Calificación promedio matemática calculada: {promedio:.2f}/10

Dame:
- Los 3 problemas principales.
- Una conclusión de la calidad del servicio.
"""

try:
    resumen = ollama.chat(model='llama3.1', messages=[
        {'role': 'user', 'content': prompt_final}
    ])
except Exception as e:
    resumen = {"message": {"content": "Error al generar el resumen."}}
    

app.run(debug=True, port=5000)


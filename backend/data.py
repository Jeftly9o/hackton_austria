import pandas as pd
import ollama
from pathlib import Path
import sys
import json
from flask import Flask, jsonify
from flask_cors import CORS

current_dir = Path(__file__).resolve().parent
csv_path = current_dir.parent / 'database' / 'base_datos.csv'

if not csv_path.exists():
    print("Error: No se encuentra el archivo CSV")
    sys.exit(1)

# Cargar el DataFrame una vez al inicio
df = pd.read_csv(csv_path)

def analizar_correo_local(asunto, contenido):
    prompt = f"""
    Analiza el siguiente correo.
    Asunto: {asunto}
    Contenido: {contenido}
    
    Responde ÚNICAMENTE con un JSON válido con este formato exacto:
    {{
        "Calidad": "buena/regular/mala",
        "Categorías": "retrasos, limpieza, seguridad, horarios, atención o 'otros'",
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

        if inicio != -1 and fin != 0:
            return json.loads(texto[inicio:fin])
        else:
            return {"sentimiento": "Neutral", "problemas": "Error Formato", "calificacion": 5}

    except Exception as e:
        return {"sentimiento": "Error", "problemas": str(e), "calificacion": 0}

app = Flask(__name__)
CORS(app)

@app.route('/api/analisis-individual', methods=['GET'])
def obtener_datos():
    # Analizar solo las primeras 2 filas para cada request
    df_analizar = df.head(2)
    
    resultados_individuales = []
    for _, row in df_analizar.iterrows():
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
    
    return jsonify(resultados_individuales)

@app.route('/api/resumen-global', methods=['GET'])
def obtener_datos_finales():
    # Analizar todas las filas para el resumen global
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

        if resultado["problemas"] not in ["Ninguno", "Error"]:
            todos_los_problemas.append(resultado["problemas"])

        if isinstance(resultado["calificacion"], (int, float)) and resultado["calificacion"] > 0:
            todas_las_calificaciones.append(resultado["calificacion"])

    promedio = sum(todas_las_calificaciones) / len(todas_las_calificaciones) if todas_las_calificaciones else 0

    prompt_final = f"""
    Genera un resumen ejecutivo basado en estos problemas:

    {todos_los_problemas}

    Promedio de calificaciones: {promedio:.2f}/10

    Dame:
    - Los 3 problemas principales
    - Una conclusión general
    """

    try:
        response = ollama.chat(model='llama3.1', messages=[
            {'role': 'user', 'content': prompt_final}
        ])
        
        resumen_texto = response["message"]["content"]
    except:
        resumen_texto = "Error al generar resumen."

    respuesta_final = {
        "problemas_detectados": todos_los_problemas,
        "calificacion_promedio": promedio,
        "resumen_ejecutivo": resumen_texto
    }
    
    return jsonify(respuesta_final)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
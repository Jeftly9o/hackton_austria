
import pandas as pd
import ollama
import os
from pathlib import Path
import sys
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Habilita CORS para permitir peticiones desde React
CORS(app)

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
        return {"sentimiento": "Error", "problemas": str(e), "calificacion": 0}

def process_data(df):
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

        if resultado['problemas'] not in ['Ninguno', 'Error', 'Error Formato']:
            todos_los_problemas.append(resultado['problemas'])
        
        if isinstance(resultado['calificacion'], (int, float)) and resultado['calificacion'] > 0:
            todas_las_calificaciones.append(resultado['calificacion'])

    promedio = sum(todas_las_calificaciones) / len(todas_las_calificaciones) if todas_las_calificaciones else 0

    return resultados_individuales, todos_los_problemas, promedio

def generate_summary(todos_los_problemas, promedio):
    texto_problemas = "\n- ".join(todos_los_problemas) 

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
        return resumen["message"]["content"]
    except Exception as e:
        return f"Error al generar el resumen: {e}"

def create_app():
    current_dir = Path(__file__).resolve().parent
    csv_path = current_dir.parent / 'database' / 'base_datos.csv'
    
    if not csv_path.exists():
        print(f"Error: No se encuentra el archivo en {csv_path}")
        sys.exit(1)
    
    df = pd.read_csv(csv_path).head(5)
    
    resultados_individuales, todos_los_problemas, promedio = process_data(df)
    resumen_texto = generate_summary(todos_los_problemas, promedio)

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
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)

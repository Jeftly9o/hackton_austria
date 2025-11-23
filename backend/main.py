import pandas as pd
import ollama
import os
from pathlib import Path
import sys
import json

current_dir = Path(__file__).resolve().parent
csv_path = current_dir.parent / 'database' / 'base_datos.csv'
print(f"Buscando archivo en: {csv_path}")
if not csv_path.exists():
    print("Error: No se encuentra el archivo")
    sys.exit(1)

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
except Exception as e:
    print(f"Error al abrir el archivo: {e}")
    sys.exit(1)

print(f"Archivo cargado prcesando {len(df)} correos...\n")

todos_los_problemas = []
todas_las_calificaciones = []

for index, row in df.iterrows():
    asunto = row['Asunto']
    contenido = row['Contenido']
    
    resultado = analizar_correo_local(asunto, contenido)
    
    if resultado['problemas'] != 'Ninguno' and resultado['problemas'] != 'Error':
        todos_los_problemas.append(resultado['problemas'])
    
    if isinstance(resultado['calificacion'], (int, float)) and resultado['calificacion'] > 0:
        todas_las_calificaciones.append(resultado['calificacion'])

    print(f"--- Correo {index + 1} ---")
    print(f"Asunto: {asunto}")
    print(f"Sentimiento: {resultado['sentimiento']}")
    print(f"Problema: {resultado['problemas']}")
    print(f"Calificación: {resultado['calificacion']}/10")
    print("-" * 30)

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
    
    print("="*40)
    print("REPORTE FINAL")
    print("="*40)
    print(resumen['message']['content'])

except Exception as e:
    print(f"Error generando resumen: {e}")

print("\nFin del programa")
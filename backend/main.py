import pandas as pd
import ollama
import json

def analizar_correo_local(asunto, contenido):
    prompt = f"""
    Analiza el siguiente correo.
    Asunto: {asunto}
    Contenido: {contenido}
    
    Responde ÚNICAMENTE con un JSON válido con este formato exacto (sin texto extra):
    {{
        "sentimiento": "Positivo/Negativo/Neutral",
        "problemas": "Resumen del problema o 'Ninguno'",
        "calificacion": Entero del 1 al 10
    }}
    """

    try:
        response = ollama.chat(model='llama3.1', messages=[
            {
                'role': 'user',
                'content': prompt,
            },
        ])
        
        respuesta_texto = response['message']['content']
        
        start = respuesta_texto.find('{')
        end = respuesta_texto.rfind('}') + 1
        if start != -1 and end != -1:
            json_str = respuesta_texto[start:end]
            return json.loads(json_str)
        else:
            return {"sentimiento": "Error Formato", "problemas": "Error", "calificacion": 0}

    except Exception as e:
        print(f"Error con Ollama: {e}")
        return {"sentimiento": "Error", "problemas": "Error", "calificacion": 0}

df = pd.read_csv('tu_archivo.csv')

print("Analizando con Ollama local (Llama 3.1)...")

sentimientos = []
problemas = []
calificaciones = []

for index, row in df.iterrows():
    print(f"Procesando correo {index + 1} de {len(df)}...") 
    
    resultado = analizar_correo_local(row['Asunto'], row['Contenido'])
    
    sentimientos.append(resultado.get('sentimiento'))
    problemas.append(resultado.get('problemas'))
    calificaciones.append(resultado.get('calificacion'))

df['IA_Sentimiento'] = sentimientos
df['IA_Problemas'] = problemas
df['IA_Calificacion'] = calificaciones

df.to_csv('resultado_ollama.csv', index=False)
print("¡Listo!")
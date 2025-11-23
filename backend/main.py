import pandas as pd
from textblob import TextBlob  

df = pd.read_csv('tu_archivo.csv')

columnas_requeridas = [
    'Nombre_remitente',
    'Email_remitente',
    'Nombre_destinatario',
    'Email_destinatario',
    'Asunto',
    'Contenido',
    'Fecha',
    'Message-ID'
]

df.columns = [c.strip() for c in df.columns] 

reseñas = []
for _, row in df.iterrows():
    contenido = str(row['Contenido'])
    
    analysis = TextBlob(contenido)
    polaridad = analysis.sentiment.polarity  # Rango: [-1, 1]

    reseña_escala = (polaridad + 1) * 2.5  # Ejemplo: -1 -> 1, 0 -> 3, 1 -> 5
    reseñas.append(reseña_escala)

    # Opcional: Imprimir datos procesados
    print(f"Remitente: {row['Nombre_remitente']} | Asunto: {row['Asunto']} | Reseña: {reseña_escala:.2f}")

# Calcular reseña promedio
if reseñas:
    reseña_promedio = sum(reseñas) / len(reseñas)
    print(f"\n--- Reseña Promedio de todos los datos: {reseña_promedio:.2f} ---")
else:
    print("No se encontraron datos para analizar.")
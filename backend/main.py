import pandas as pd
from ntscraper import Nitter
from time import sleep

def buscar_tweets(termino, cantidad=10, desde=None, hasta=None):
    """
    Busca tweets usando Nitter (para evitar la API de pago de Twitter).
    """
    print(f"🔎 Buscando '{termino}'... esto puede tardar unos segundos dependiendo de la instancia de Nitter.")
    
    scraper = Nitter(log_level=1, skip_instance_check=False)
    
    # Realizamos la búsqueda
    # mode='term' busca la palabra clave. 
    # mode='hashtag' buscaría #Palabra
    tweets_data = scraper.get_tweets(
        termino,
        mode='term',
        number=cantidad,
        since=desde, # Formato "2023-01-01" (Opcional)
        until=hasta  # Formato "2023-12-31" (Opcional)
    )
    
    lista_final = []
    
    # Filtramos y limpiamos los datos
    if tweets_data.get('tweets'):
        for tweet in tweets_data['tweets']:
            datos = {
                'fecha': tweet['date'],
                'texto': tweet['text'],
                'usuario': tweet['user']['username'],
                'enlace': tweet['link']
            }
            lista_final.append(datos)
            
        return lista_final
    else:
        print("⚠️ No se encontraron tweets o hubo un error con la instancia.")
        return []

# --- CONFIGURACIÓN ---
PALABRA_CLAVE = "Metro CDMX"
CANTIDAD = 50  # Número de tweets a bajar

# --- EJECUCIÓN ---
if __name__ == "__main__":
    resultados = buscar_tweets(PALABRA_CLAVE, CANTIDAD)
    
    if resultados:
        # Crear un DataFrame con Pandas
        df = pd.DataFrame(resultados)
        
        # Guardar en CSV
        nombre_archivo = "tweets_metro.csv"
        df.to_csv(nombre_archivo, index=False, encoding='utf-8')
        
        print(f"\n✅ Éxito. Se guardaron {len(df)} tweets en '{nombre_archivo}'")
        
        # Muestra los primeros 3 resultados en pantalla
        print("\n--- Ejemplo de datos ---")
        print(df[['fecha', 'texto']].head(3))
    else:
        print("❌ No se pudieron guardar datos.")
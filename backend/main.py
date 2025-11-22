from fastapi import FastAPI
import pandas as pd
import os

app = FastAPI()

CSV_PATH = os.path.join("database", "data.csv")

# Asegurar CSV si no existe
if not os.path.exists(CSV_PATH):
    df = pd.DataFrame(columns=["id", "nombre", "edad"])
    df.to_csv(CSV_PATH, index=False)

@app.get("/data")
def leer_datos():
    df = pd.read_csv(CSV_PATH)
    return df.to_dict(orient="records")

@app.post("/data")
def agregar_dato(id: int, nombre: str, edad: int):
    df = pd.read_csv(CSV_PATH)
    nuevo = {"id": id, "nombre": nombre, "edad": edad}
    df = pd.concat([df, pd.DataFrame([nuevo])], ignore_index=True)
    df.to_csv(CSV_PATH, index=False)
    return {"message": "Dato agregado", "data": nuevo}

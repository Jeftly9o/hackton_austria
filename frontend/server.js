import express from 'express';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ---> NUEVO: Esta línea hace la magia <---
// Le dice al servidor que sirva cualquier archivo estático (html, css, imágenes)
// que encuentre en la carpeta actual.
app.use(express.static(__dirname)); 

// (Tu ruta principal puede quedarse o borrarse, express.static ya cubre esto,
// pero déjala por si acaso quieres asegurar que la raíz cargue index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ... (El resto de tu código de guardar-encuesta sigue igual)
app.post('/guardar-encuesta', (req, res) => {
    // 1. CHISMOSO: Ver si entra la petición
    console.log("¡Petición recibida en /guardar-encuesta!"); 
    
    // 2. CHISMOSO: Ver qué datos llegaron
    console.log("Datos recibidos:", req.body); 

    const nuevaRespuesta = req.body;

    // Validación básica: Si no hay datos, no hacemos nada
    if (!nuevaRespuesta || Object.keys(nuevaRespuesta).length === 0) {
        console.log("ERROR: El cuerpo (body) está vacío.");
        return res.status(400).send('No se recibieron datos');
    }

    fs.readFile('respuestas.json', 'utf8', (err, data) => {
        if (err) {
            // Si el archivo no existe, iniciamos con array vacío
            if (err.code === 'ENOENT') {
                console.log("El archivo no existía, creando uno nuevo...");
                data = '[]';
            } else {
                console.error("Error leyendo archivo:", err);
                return res.status(500).send('Error al leer el archivo');
            }
        }

        let json = [];
        try {
            json = JSON.parse(data || '[]');
        } catch (e) {
            console.log("El JSON estaba corrupto, reiniciando...");
            json = [];
        }

        json.push(nuevaRespuesta);

        fs.writeFile('respuestas.json', JSON.stringify(json, null, 2), (err) => {
            if (err) {
                console.error("Error escribiendo archivo:", err);
                return res.status(500).send('Error al guardar');
            }
            console.log("¡Guardado exitoso en el archivo!"); // 3. CHISMOSO FINAL
            res.send('¡Encuesta guardada con éxito!');
        });
    });
});
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
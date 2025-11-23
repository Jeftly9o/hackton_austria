import unittest
import json
from unittest.mock import patch, MagicMock
import io
import pandas as pd
# We need to import the app from the data module.
# The logic in data.py will run upon import.
from backend import data

class TestAnalisisCorreo(unittest.TestCase):

    @patch('backend.data.ollama.chat')
    def test_analizar_correo_local_success(self, mock_ollama_chat):
        """
        Tests successful analysis and JSON parsing.
        """
        # Mock the response from ollama.chat
        mock_response = {
            "message": {
                "content": '''```json
                {
                    "Calidad": "mala",
                    "Categorías": "retrasos",
                    "sentimiento": "Negativo",
                    "problemas": "El tren llegó tarde.",
                    "calificacion": 2
                }
                ```'''
            }
        }
        mock_ollama_chat.return_value = mock_response

        asunto = "Retraso en el servicio"
        contenido = "El tren de las 8am llegó con 30 minutos de retraso."
        resultado = data.analizar_correo_local(asunto, contenido)

        self.assertEqual(resultado['sentimiento'], 'Negativo')
        self.assertEqual(resultado['problemas'], 'El tren llegó tarde.')
        self.assertEqual(resultado['calificacion'], 2)

    @patch('backend.data.ollama.chat')
    def test_analizar_correo_local_json_error(self, mock_ollama_chat):
        """
        Tests handling of a malformed (non-JSON) response from Ollama.
        """
        mock_response = {
            "message": {
                "content": "Lo siento, no puedo generar un JSON."
            }
        }
        mock_ollama_chat.return_value = mock_response

        resultado = data.analizar_correo_local("test", "test")

        self.assertEqual(resultado['sentimiento'], 'Neutral')
        self.assertEqual(resultado['problemas'], 'Error Formato')
        self.assertEqual(resultado['calificacion'], 5)

    @patch('backend.data.ollama.chat')
    def test_analizar_correo_local_exception(self, mock_ollama_chat):
        """
        Tests handling of an exception during the Ollama API call.
        """
        mock_ollama_chat.side_effect = Exception("Connection failed")

        resultado = data.analizar_correo_local("test", "test")

        self.assertEqual(resultado['sentimiento'], 'Error')
        self.assertEqual(resultado['problemas'], 'Connection failed')
        self.assertEqual(resultado['calificacion'], 0)


class TestApiEndpoints(unittest.TestCase):

    def setUp(self):
        """
        Set up a test client for the Flask application.
        This runs before each test.
        """
        # Patch dependencies before creating the app
        self.pd_patcher = patch('backend.data.pd.read_csv')
        self.ollama_patcher = patch('backend.data.ollama.chat')

        self.mock_read_csv = self.pd_patcher.start()
        self.mock_ollama_chat = self.ollama_patcher.start()

        # Mock the CSV data that will be read
        csv_data = "Asunto,Contenido\nQueja,Servicio lento\nFelicitacion,Muy buen servicio"
        self.mock_read_csv.return_value = pd.read_csv(io.StringIO(csv_data))

        # Mock the ollama responses
        # First two for individual analysis, third for the final summary
        self.mock_ollama_chat.side_effect = [
            # Response for "Queja"
            {"message": {"content": '{"sentimiento": "Negativo", "problemas": "lentitud", "calificacion": 3}'}},
            # Response for "Felicitacion"
            {"message": {"content": '{"sentimiento": "Positivo", "problemas": "Ninguno", "calificacion": 9}'}},
            # Response for the summary
            {"message": {"content": "El resumen ejecutivo es sobre la lentitud."}}
        ]

        # Create the app with mocked data processing
        app = data.create_app()
        app.config['TESTING'] = True
        self.client = app.test_client()

    def tearDown(self):
        """Stop the patchers."""
        self.pd_patcher.stop()
        self.ollama_patcher.stop()

    def test_analisis_individual_endpoint(self):
        """Test the individual analysis endpoint with controlled mock data."""
        response = self.client.get('/api/analisis-individual')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIsInstance(json_data, list)
        self.assertEqual(len(json_data), 2)
        self.assertEqual(json_data[0]['problemas'], 'lentitud')
        self.assertEqual(json_data[1]['sentimiento'], 'Positivo')

    def test_resumen_global_endpoint(self):
        """Test the global summary endpoint with controlled mock data."""
        response = self.client.get('/api/resumen-global')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIn('lentitud', json_data['problemas_detectados'])
        self.assertEqual(json_data['calificacion_promedio'], 6.0) # (3+9)/2
        self.assertEqual(json_data['resumen_ejecutivo'], 'El resumen ejecutivo es sobre la lentitud.')


if __name__ == '__main__':
    unittest.main()
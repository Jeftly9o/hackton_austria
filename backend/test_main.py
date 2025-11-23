import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
import io

from backend import main

class TestMainLogic(unittest.TestCase):

    @patch('backend.main.analizar_correo_local')
    def test_process_data(self, mock_analizar_correo):
        """
        Tests the data processing logic that iterates through the dataframe.
        """
        # Sample dataframe to be returned by pd.read_csv
        csv_data = "Asunto,Contenido\nRetraso,El tren llego tarde\nCalidad,Asiento roto"
        df = pd.read_csv(io.StringIO(csv_data))

        # Mock responses from aallama analysis
        mock_analizar_correo.side_effect = [
            {"sentimiento": "Negativo", "problemas": "retraso de tren", "calificacion": 2},
            {"sentimiento": "Negativo", "problemas": "asiento en mal estado", "calificacion": 4},
        ]

        resultados_individuales, todos_los_problemas, promedio = main.process_data(df)

        self.assertEqual(len(resultados_individuales), 2)
        self.assertEqual(resultados_individuales[0]['problemas'], 'retraso de tren')
        self.assertEqual(len(todos_los_problemas), 2)
        self.assertIn('retraso de tren', todos_los_problemas)
        self.assertIn('asiento en mal estado', todos_los_problemas)
        self.assertEqual(promedio, 3.0)

    @patch('backend.main.ollama.chat')
    def test_generate_summary(self, mock_ollama_chat):
        """
        Tests the summary generation logic.
        """
        mock_response = {
            "message": {
                "content": "El principal problema son los retrasos."
            }
        }
        mock_ollama_chat.return_value = mock_response

        problemas = ["retraso", "asiento roto"]
        promedio = 3.5

        resumen = main.generate_summary(problemas, promedio)

        self.assertEqual(resumen, "El principal problema son los retrasos.")
        # Check that ollama.chat was called with the correct prompt structure
        mock_ollama_chat.assert_called_once()
        call_args = mock_ollama_chat.call_args
        prompt = call_args[1]['messages'][0]['content']
        self.assertIn("retraso", prompt)
        self.assertIn("asiento roto", prompt)
        self.assertIn("3.50/10", prompt)


class TestMainApiEndpoints(unittest.TestCase):

    def setUp(self):
        """
        Set up a test client for the Flask application.
        This runs before each test.
        """
        # We need to patch the dependencies before creating the app
        self.pd_patcher = patch('backend.main.pd.read_csv')
        self.ollama_patcher = patch('backend.main.ollama.chat')

        self.mock_read_csv = self.pd_patcher.start()
        self.mock_ollama_chat = self.ollama_patcher.start()

        # Mock the CSV data
        csv_data = "Asunto,Contenido\nTest,Contenido de prueba"
        self.mock_read_csv.return_value = pd.read_csv(io.StringIO(csv_data))

        # Mock the ollama responses
        # First call is for analysis, second is for summary
        self.mock_ollama_chat.side_effect = [
            {
                "message": {"content": '{"sentimiento": "Neutral", "problemas": "prueba", "calificacion": 7}'}
            },
            {
                "message": {"content": "Este es un resumen de prueba."}
            }
        ]

        # Create the app with mocked data processing
        app = main.create_app()
        app.config['TESTING'] = True
        self.client = app.test_client()

    def tearDown(self):
        """Stop the patchers."""
        self.pd_patcher.stop()
        self.ollama_patcher.stop()

    def test_analisis_individual_endpoint(self):
        """Test the individual analysis endpoint."""
        response = self.client.get('/api/analisis-individual')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertEqual(len(json_data), 1)
        self.assertEqual(json_data[0]['problemas'], 'prueba')

    def test_resumen_global_endpoint(self):
        """Test the global summary endpoint."""
        response = self.client.get('/api/resumen-global')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertEqual(json_data['calificacion_promedio'], 7.0)
        self.assertEqual(json_data['resumen_ejecutivo'], 'Este es un resumen de prueba.')

if __name__ == '__main__':
    unittest.main()
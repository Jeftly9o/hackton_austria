from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        # Lanzamos el navegador (headless=False para verlo en pantalla)
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        print("Navegando a example.com...")
        page.goto("https://example.com")
        
        # Tomamos una captura de pantalla
        page.screenshot(path="prueba_arch.png")
        print("Captura guardada como prueba_arch.png")
        
        browser.close()

if __name__ == "__main__":
    run()
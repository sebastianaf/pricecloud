from libcloud.compute.types import Provider
from libcloud.compute.providers import get_driver

def list_images():
    Driver = get_driver(Provider.YOUR_PROVIDER)  # Reemplaza YOUR_PROVIDER con el proveedor adecuado
    conn = Driver('your_access_id', 'your_secret_key')
    images = conn.list_images()
    return images

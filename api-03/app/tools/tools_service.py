from libcloud.compute.types import Provider
from libcloud.compute.providers import get_driver

ACCESS_ID = ''
SECRET_KEY = ''

Driver = get_driver(Provider.EC2)
conn = Driver(ACCESS_ID, SECRET_KEY,region='us-west-1')


image_id = 'ami-07d8158d9d4df3bde'
size_id = 't2.micro'  

try:
    image = [img for img in conn.list_images() if img.id == image_id][0]
except IndexError:
    raise ValueError(f"No se encontró ninguna imagen con el ID: {image_id}")

size = [sz for sz in conn.list_sizes() if sz.id == size_id][0]


node = conn.create_node(name='NuevaInstancia', image=image, size=size)


conn.wait_until_running(nodes=[node])

print(f'Instancia {node.name} desplegada con ID {node.id}')

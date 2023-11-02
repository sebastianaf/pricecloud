from flask import jsonify
from libcloud.compute.types import Provider
from libcloud.compute.providers import get_driver


def list_images(access_id, secret_key):
    Driver = get_driver(Provider.EC2)
    conn = Driver(access_id, secret_key)
    images = conn.list_images()
    serialized_images = []
    for image in images:
        serialized_image = {
            'id': image.id,
            'name': image.name,
        }
        serialized_images.append(serialized_image)
    return jsonify(serialized_images)    


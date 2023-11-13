from flask import jsonify
from libcloud.compute.types import Provider
from libcloud.compute.providers import get_driver
from ..common import common_service


def list_locations(access_id, secret_key):
    try:
        Driver = get_driver(Provider.EC2)
        conn = Driver(access_id, secret_key)
        locations = conn.list_locations()
        serialized_locations = []
        for location in locations:
            serialized_location = {
                'id': location.id,
                'name': location.name,
                'country': location.country,
                'extra': common_service.serialize(location.extra)
            }
            serialized_locations.append(serialized_location)
        return jsonify(serialized_locations)
    except Exception as e:
        return jsonify({"error": "Error al listar las ubicaciones"}), 500


def list_images(access_id, secret_key, location):
    try:
        Driver = get_driver(Provider.EC2)
        conn = Driver(access_id, secret_key)
        images = conn.list_images(location=location)
        serialized_images = []

        for image in images:
            serialized_image = {
                'id': image.id,
                'name': image.name,
                'extra': image.extra
            }
            serialized_images.append(serialized_image)
        return jsonify(serialized_images)
    except Exception as e:
        return jsonify({"error": f"Error al listar las imágenes"}), 500


def list_sizes(access_id, secret_key):
    try:
        Driver = get_driver(Provider.EC2)
        conn = Driver(access_id, secret_key)
        sizes = conn.list_sizes()
        serialized_sizes = []
        for size in sizes:
            serialized_size = common_service.serialize(
                size,
                exclude_keys=['driver'],
                max_depth=3
            )
            serialized_sizes.append(serialized_size)
        return jsonify(serialized_sizes)
    except Exception as e:
        return jsonify({"error": f"Error al listar los tamaños: {e}"}), 500


def deploy_node(access_id, secret_key, node_name, image_id, size_id):
    try:
        Driver = get_driver(Provider.EC2)
        conn = Driver(access_id, secret_key)
        image = conn.get_image(image_id)

        size = next((s for s in conn.list_sizes() if s.id == size_id), None)
        if size is None:
            return jsonify({"error": "Tamaño no encontrado"}), 404

        node = conn.create_node(name=node_name, image=image, size=size)

        node_info = common_service.serialize(
            node,
            exclude_keys=['driver'],
            max_depth=6
        )

        return node_info

    except Exception as e:
        return jsonify({"error": f"Error al crear el nodo: {e}"}), 500

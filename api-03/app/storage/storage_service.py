from flask import jsonify
from libcloud.storage.types import Provider
from libcloud.storage.providers import get_driver
from ..common import common_service


def s3_container(access_id, secret_key, node_name):
    try:
        Driver = get_driver(Provider.S3)
        conn = Driver(access_id, secret_key)
        container = conn.create_container(node_name)

        container_info = common_service.serialize(
            container,
            exclude_keys=['driver'],
            max_depth=3
        )

        return container_info

    except Exception as e:
        print(e)
        return jsonify({"error": f"Error al crear el nodo: {e}"}), 500

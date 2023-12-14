from flask import jsonify
from libcloud.storage.types import Provider
from libcloud.storage.providers import get_driver
from ..common import common_service


def create_s3_bucket(access_id, secret_key, bucket_name):
    try:
        Driver = get_driver(Provider.S3)
        conn = Driver(access_id, secret_key)
        bucket = conn.create_container(bucket_name)
        bucket_info = common_service.serialize(
            bucket,
            exclude_keys=['driver'],
            max_depth=4
        )
        return bucket_info

    except Exception as e:
        print(e)
        return jsonify({"error": f"Error al crear el contenedor: {e}"}), 500


def list_s3_buckets(access_id, secret_key):
    try:
        Driver = get_driver(Provider.S3)
        conn = Driver(access_id, secret_key)
        buckets = conn.list_containers()
        serialized_buckets = []
        for bucket in buckets:
            serialized_bucket = common_service.serialize(
                bucket,
                exclude_keys=['driver', 'attach_time'],
                max_depth=2
            )
            serialized_buckets.append(serialized_bucket)
        return jsonify(serialized_buckets)
    except Exception as e:
        return jsonify({"error": f"Error al listar los buckets"}), 500

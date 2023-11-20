from flask import Blueprint, request
from . import storage_service

storage_blueprint = Blueprint('storage', __name__)


@storage_blueprint.route('/buckets', methods=['POST'])
def list_s3_buckets():
    request_data = request.json
    buckets = storage_service.list_s3_buckets(
        request_data['access_id'],
        request_data['secret_key'],
    )
    return buckets


@storage_blueprint.route('/create', methods=['POST'])
def create_s3_bucket():
    request_data = request.json
    bucket = storage_service.create_s3_bucket(
        request_data['access_id'],
        request_data['secret_key'],
        request_data['bucket_name']
    )
    return bucket

from flask import Blueprint, request
from . import storage_service

storage_blueprint = Blueprint('storage', __name__)

@storage_blueprint.route('/container', methods=['POST'])
def s3_container():
    request_data = request.json
    locations = storage_service.s3_container(
        request_data['access_id'],
        request_data['secret_key'],
        request_data['node_name']
    )
    return locations

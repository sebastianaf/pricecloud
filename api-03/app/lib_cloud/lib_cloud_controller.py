from flask import Blueprint, jsonify, request
from flasgger import swag_from
from .lib_cloud_service import list_images
from .lib_cloud_schema import list_images_schema

lib_cloud_blueprint = Blueprint('lib_cloud', __name__)


@lib_cloud_blueprint.route('/list_images', methods=['POST'])
@swag_from(list_images_schema)
def list_images_endpoint():
    request_data = request.json
    images = list_images(request_data['access_id'], request_data['secret_key'])
    return images

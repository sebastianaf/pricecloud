from flask import Blueprint, jsonify, request
from flasgger import swag_from
from .compute_service import list_images
from .compute_schema import list_images_schema

compute_blueprint = Blueprint('compute', __name__)


@compute_blueprint.route('/list_images', methods=['POST'])
@swag_from(list_images_schema)
def list_images_endpoint():
    request_data = request.json
    images = list_images(request_data['access_id'], request_data['secret_key'])
    return images

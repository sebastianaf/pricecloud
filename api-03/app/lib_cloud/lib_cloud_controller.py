from flask import Blueprint, jsonify
from flasgger import swag_from
from .lib_cloud_service import list_images

lib_cloud_blueprint = Blueprint('lib_cloud', __name__)

@lib_cloud_blueprint.route('/listImages', methods=['GET'])
@swag_from({
    'responses': {
        200: {
            'description': 'List of available images',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'string'},
                        'name': {'type': 'string'},
                        # ... otros campos de la imagen
                    }
                }
            }
        }
    }
})
def list_images_endpoint():
    images = list_images()
    return jsonify(images)

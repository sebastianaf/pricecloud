from flask import Blueprint, request
from . import compute_service

compute_blueprint = Blueprint('compute', __name__)


@compute_blueprint.route('/locations', methods=['POST'])
def ec2_locations():
    request_data = request.json
    locations = compute_service.list_locations(
        request_data['access_id'],
        request_data['secret_key']
    )
    return locations

@compute_blueprint.route('/images', methods=['POST'])
def ec2_images():
    request_data = request.json
    images = compute_service.list_images(
        request_data['access_id'],
        request_data['secret_key'],
        request_data.get('location')
    )
    return images


@compute_blueprint.route('/sizes', methods=['POST'])
def ec2_sizes():
    request_data = request.json
    sizes = compute_service.list_sizes(
        request_data['access_id'],
        request_data['secret_key']
    )
    return sizes


@compute_blueprint.route('/deploy', methods=['POST'])
def ec2_deploy():
    request_data = request.json
    deploy_data = compute_service.deploy_node(
        request_data['access_id'],
        request_data['secret_key'],
        request_data['node_name'],
        request_data['image_id'],
        request_data['size_id']
    )
    return deploy_data

compute_list_images_schema = {
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
                    }
                }
            }
        }
    }
}

from flask import Flask
from .compute.compute_controller import compute_blueprint
from .storage.storage_controller import storage_blueprint

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    app.register_blueprint(compute_blueprint, url_prefix='/compute')
    app.register_blueprint(storage_blueprint, url_prefix='/storage')
    return app

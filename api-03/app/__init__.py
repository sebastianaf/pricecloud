from flask import Flask
from .lib_cloud.lib_cloud_controller import lib_cloud_blueprint

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    app.register_blueprint(lib_cloud_blueprint, url_prefix='/lib_cloud')
    return app

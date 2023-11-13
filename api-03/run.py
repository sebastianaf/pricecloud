from app import create_app
from flasgger import Swagger

app = create_app()

swagger = Swagger(app)

if __name__ == '__main__':
    app.run()

import os

from flask import Flask
from flask.json import jsonify
from flask_cors import CORS

from blueprints.groups import social_groups_blueprint
from blueprints.posts import posts_blueprint
from blueprints.users import users_blueprint
from common.exceptions import Forbidden, InvalidUsage
from common.mysql_connector import MySQLConnector


app = Flask(__name__)
app.register_blueprint(users_blueprint)
app.register_blueprint(posts_blueprint)
app.register_blueprint(social_groups_blueprint)

app.config['mysql_connector'] = MySQLConnector(os.environ.get('MYSQL_PROD'))
CORS(app)


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.errorhandler(Forbidden)
def handle_forbidden_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


if __name__ == "__main__":
    app.run(use_reloader=False)

import os

import pytest

from common.mysql_connector import MySQLConnector
from common.testing.constants import TEST_API_KEY, TEST_UID, TEST_USER_ID
from common.testing.utils import _db_session
from main import app


@pytest.fixture(scope='session')
def db_session():
    """
    sqlalchemy.orm.scoped_session fixture, so tests can access SQL DB easily
    """

    yield _db_session


@pytest.fixture(scope='session')
def client(db_session):
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            app.config['mysql_connector'] = MySQLConnector(os.environ.get('MYSQL_TEST'))
            app.config['api_key'] = TEST_API_KEY
        yield client


@pytest.fixture(scope='session')
def context():
    yield {
        'api_key': TEST_API_KEY,
        'uid': TEST_UID,
        'user_id': TEST_USER_ID,
    }

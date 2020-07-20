import os

from sqlalchemy.orm import scoped_session, sessionmaker

from common.mysql_connector import MySQLConnector


def get_scoped_db_session():
    mysql_connector = MySQLConnector(os.environ.get('MYSQL_TEST'))

    session_factory = sessionmaker()
    session_factory.configure(bind=mysql_connector.engine, expire_on_commit=True)
    session = scoped_session(session_factory)
    return session


_db_session = get_scoped_db_session()

import os
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from common.logging import logger
from common.messages import Errors


class MySQLConnector:
    def __init__(self):
        if not os.environ.get('MYSQL_PROD'):
            raise Exception(Errors.MYSQL_SERVER_NOT_SET)

        mysql_engine = create_engine(
            os.environ.get('MYSQL_PROD')
        )
        try:
            self.Session = sessionmaker(bind=mysql_engine)
        except Exception:
            logger.warning(str(Exception))

    @contextmanager
    def session(self):
        session = self.Session()
        try:
            yield session
            session.commit()
        except Exception:
            logger.warning(str(Exception))
            session.rollback()
            raise
        finally:
            session.close()

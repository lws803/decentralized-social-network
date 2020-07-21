from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from common.logging import logger
from common.messages import Errors


class MySQLConnector:
    def __init__(self, uri):
        if not uri:
            raise Exception(Errors.MYSQL_SERVER_NOT_SET)

        self.engine = create_engine(uri)
        try:
            self.Session = sessionmaker(bind=self.engine)
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

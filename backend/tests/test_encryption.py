import struct
from http import HTTPStatus

import pytest
from Crypto.Cipher import AES
from pytest_voluptuous import Partial, S as Schema

from common.authentication import encode_auth_token
from common.constants import SocialGroupRole
from common.models import Post, SocialGroup, SocialGroupMember, Tag
from common.testing.factories import (
    SocialGroupFactory,
    SocialGroupMemberFactory,
)


def convert_string_to_bytes(string):
    bytes = b''
    for i in string:
        bytes += struct.pack("B", ord(i))
    return bytes


@pytest.fixture
def populate_db(db_session, context, secondary_context):
    yield
    for model in (Post, SocialGroup, SocialGroupMember, Tag):
        db_session.query(model).delete()
    db_session.commit()


@pytest.fixture
def init_group_and_membership(populate_db, db_session, context):
    new_group = SocialGroupFactory.create(name='test_group')
    SocialGroupMemberFactory.create(
        user_id=context['user_id'],
        social_group_id=new_group.id,
        role=SocialGroupRole.ADMIN
    )
    db_session.commit()
    yield new_group


@pytest.fixture
def init_second_membership(init_group_and_membership, db_session, secondary_context):
    group = init_group_and_membership
    SocialGroupMemberFactory.create(
        user_id=secondary_context['user_id'],
        social_group_id=group.id,
        role=SocialGroupRole.MEMBER
    )
    db_session.commit()
    yield group


class TestEncryptedPost(object):

    @pytest.mark.parametrize(
        'data',
        [
            'hello world, how are you?',
            'the quick brown fox jumped over the rainbow and had a stroke',
            '🤪🚗',
        ]
    )
    def test_encrypted_post(
        self, init_group_and_membership, db_session, data, client, context
    ):
        key = b'Sixteen byte key'
        cipher = AES.new(key, AES.MODE_EAX)
        ciphertext, tag = cipher.encrypt_and_digest(str.encode(data))
        nonce = cipher.nonce

        new_group = init_group_and_membership
        response = client.post(
            '/api/v1/post/new',
            headers={
                'key': context['api_key'],
                'Authorization': encode_auth_token(context['user_id']).decode()
            },
            json={
                'social_group_id': new_group.id,
                'metadata_json': {'data': ''.join(chr(x) for x in ciphertext)},
                'visibility': 'private'
            }
        )
        assert response.status_code == HTTPStatus.ACCEPTED
        assert response.json == Schema(
            Partial(
                {
                    'metadata_json': {'data': ''.join(chr(x) for x in ciphertext)},
                    'user_id': context['user_id'],
                }
            )
        )
        descrypt_cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
        byte_payload = convert_string_to_bytes(response.json['metadata_json']['data'])
        assert descrypt_cipher.decrypt(byte_payload).decode("utf-8") == data

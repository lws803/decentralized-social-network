import os

import requests
from Crypto.Cipher import AES

api_url = os.environ.get('API')
api_key = os.environ.get('API_KEY')

uid = 'test_uid'

response = requests.post(
    f'{api_url}/api/v1/user/new',
    json={
        'metadata_json': {
            'description': 'cool'
        },
        'name': 'wilson'
    },
    headers={
        'user': uid,
        'key': api_key
    }
)
print(response.json())

token = response.json()['token']

response = requests.post(
    f'{api_url}/api/v1/social_group/new',
    json={
        'name': 'test_group'
    },
    headers={
        'Authorization': token,
        'key': api_key
    }
)
print(response.json())

group_id = response.json()['id']
data = 'hello world 🎨'

key = b'Sixteen byte key'
cipher = AES.new(key, AES.MODE_EAX)
ciphertext, tag = cipher.encrypt_and_digest(str.encode(data))
nonce = cipher.nonce

response = requests.post(
    f'{api_url}/api/v1/post/new',
    json={
        'social_group_id': group_id,
        'metadata_json': {
            'data': ''.join(chr(x) for x in ciphertext)
        },
        'visibility': 'private',
        'tags': ['new']
    },
    headers={
        'Authorization': token,
        'key': api_key
    }
)

print(response.json())

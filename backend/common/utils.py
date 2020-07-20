import re

from common.exceptions import InvalidUsage
from common.messages import Errors


class DictArgParser(object):
    key_split_expression = re.compile('[\\[\\]]+')

    @classmethod
    def parse(cls, args):
        '''
        Takes an ImmutableMultiDict (Flask's request.args) & returns a dict of
        parsed args. It adds the feature to interpret parameters like
        "key[a]=b" as {"key": {"a": "b"}}, instead of flask's default way,
        which is {"key[a]": "b"}
        '''
        final_args = dict()

        for key_string, value in args.to_dict(flat=False).items():
            keys = cls.key_split_expression.split(key_string)
            if keys[-1] == '':
                keys.pop()

            ref = final_args
            for key in keys[:-1]:
                key = str(key)

                if key not in ref:
                    ref[key] = {}

                if not isinstance(ref[key], dict):
                    raise InvalidUsage(Errors.PARAM_DICTIONARY_CHECK % keys[0])

                ref = ref[key]

            if str(keys[-1]) in ref:
                raise InvalidUsage(Errors.PARAM_DICTIONARY_CHECK % keys[0])

            ref[str(keys[-1])] = value if len(value) > 1 else value[0]

        return final_args


def get_offset(page, num_results):
    """
    Calculates the start_result offset and number of results to fetch for each section
    """
    start_result = (page - 1) * num_results if page > 0 else 0
    return start_result, num_results

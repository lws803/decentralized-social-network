from voluptuous import PREVENT_EXTRA, All, Coerce, Optional, Range, Schema


DEFAULT_PAGE = 1
DEFAULT_NUM_RESULTS_PER_PAGE = 20
DEFAULT_MAX_NUM_RESULTS_PER_PAGE = 100


def get_pagination_schema(
    default_page=DEFAULT_PAGE,
    default_num_results_per_page=DEFAULT_NUM_RESULTS_PER_PAGE,
    extra=PREVENT_EXTRA, max_num_results_per_page=DEFAULT_MAX_NUM_RESULTS_PER_PAGE
):
    """Get pagination schema with proper defaults for page and num_results_per_page.

    :param default_page: Default page when no value is passed.
    :type default_page: int
    :param default_num_results_per_page: Default number of results per page
    :type default_num_results_per_page: int
    :return: Pagination schema that can be used to extend other schemas
    :rtype: voluptuous.Schema

    """
    return Schema({
        Optional('page', default=str(default_page)): All(str, Coerce(int), Range(min=1)),
        Optional('num_results_per_page', default=str(default_num_results_per_page)): All(
            str,
            Coerce(int),
            Range(min=1, max=max_num_results_per_page),
        ),
    }, extra=extra)

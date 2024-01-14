from typing import Dict, List

import numpy as np
from alligator.service.recs.n_dim_operations import vec1_to_vec2
from alligator.service.recs.rec import angle_between
from alligator.service.recs.rec import anketa_vectors as av
from alligator.service.recs.rec import base_vectors as bv


def _(i, v1, v2):
    v1 = np.array(v1)
    v2 = np.array(v2)
    if i == 0:
        return vec1_to_vec2(
            v1, (-1) * v2, 0.5 * (angle_between(v1, v2) / angle_between(v1, (-1) * v2))
        )
    elif i == 1:
        return vec1_to_vec2(
            v1, (-1) * v2, 0.25 * (angle_between(v1, v2) / angle_between(v1, (-1) * v2))
        )
    elif i == 2:
        return v1
    elif i == 3:
        return vec1_to_vec2(v1, v2, 0.25)
    else:
        return vec1_to_vec2(v1, v2, 0.5)


def get_interest_dict(anketa: List[int]) -> Dict[str, List[float]]:
    _0 = _(anketa[1], _(anketa[0], bv[0], av[0]), av[1])
    _0 = [el.item() for el in _0]
    _1 = _(anketa[3], _(anketa[2], bv[1], av[2]), av[3])
    _1 = [el.item() for el in _1]
    _2 = _(anketa[5], _(anketa[4], bv[2], av[4]), av[5])
    _2 = [el.item() for el in _2]
    _3 = _(anketa[7], _(anketa[6], bv[3], av[6]), av[7])
    _3 = [el.item() for el in _3]
    _4 = _(anketa[9], _(anketa[8], bv[4], av[8]), av[9])
    _4 = [el.item() for el in _4]
    return {"0": _0, "1": _1, "2": _2, "3": _3, "4": _4}

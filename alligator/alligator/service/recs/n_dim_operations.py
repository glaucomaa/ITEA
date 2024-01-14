import math

import numpy as np
from alligator.service.recs.rec import angle_between


def rotation_from_angle_and_plane(angle, vector1, vector2, abs_tolerance=1e-10):
    vector1_length = np.linalg.norm(vector1)
    if math.isclose(vector1_length, 0.0, abs_tol=abs_tolerance):
        raise ValueError()

    vector2_length = np.linalg.norm(vector2)
    if math.isclose(vector2_length, 0.0, abs_tol=abs_tolerance):
        raise ValueError()

    vector2 /= vector2_length
    dot_value = np.dot(vector1, vector2)

    if abs(dot_value / vector1_length) > 1 - abs_tolerance:
        raise ValueError(
            "Given vectors are parallel within the given tolerance: {:.0e}".format(
                abs_tolerance
            )
        )

    if abs(dot_value / vector1_length) > abs_tolerance:
        vector1 = vector1 - dot_value * vector2
        vector1 /= np.linalg.norm(vector1)
    else:
        vector1 /= vector1_length

    vectors = np.vstack([vector1, vector2]).T
    vector1, vector2 = np.linalg.qr(vectors)[0].T

    V = np.outer(vector1, vector1) + np.outer(vector2, vector2)
    W = np.outer(vector1, vector2) - np.outer(vector2, vector1)

    return np.eye(len(vector1)) + (math.cos(angle) - 1) * V - math.sin(angle) * W


def rot(X: np.ndarray, part_of_angle=1) -> np.ndarray:
    N = X.shape[0]
    R = np.eye(N)
    step = 1
    while step < N:
        A = np.eye(N)
        n = 0
        while n < N - step:
            r2 = X[n] * X[n] + X[n + step] * X[n + step]
            if r2 > 0:
                r = np.sqrt(r2)
                pcos = np.cos(np.arccos(X[n] / r) * part_of_angle)
                psin = np.sin(np.arcsin(-X[n + step] / r) * part_of_angle)
                A[n, n] = pcos
                A[n, n + step] = -psin
                A[n + step, n] = psin
                A[n + step, n + step] = pcos
            n += 2 * step
        step *= 2
        X = np.transpose((A @ (np.transpose(X))))
        R = A @ R
    return R


def vec1_to_vec2(vec1, vec2, part_of_angle):
    _ = rotation_from_angle_and_plane(
        angle_between(vec1, vec2) * part_of_angle, *vecs_with_plane_span(vec1, vec2)
    ) @ np.transpose(vec1)
    if np.allclose(
        angle_between(vec1, _), angle_between(vec1, vec2) * part_of_angle
    ) and np.allclose(
        angle_between(vec2, _), angle_between(vec1, vec2) * (1 - part_of_angle)
    ):
        return _
    return rotation_from_angle_and_plane(
        -angle_between(vec1, vec2) * part_of_angle, *vecs_with_plane_span(vec1, vec2)
    ) @ np.transpose(vec1)


def vec1_to_vec2_inv(vec1, vec2, part_of_angle):
    _ = rotation_from_angle_and_plane(
        angle_between(vec1, vec2) * part_of_angle, *vecs_with_plane_span(vec1, vec2)
    ) @ np.transpose(vec1)
    if np.allclose(
        angle_between(vec1, _), angle_between(vec1, vec2) * part_of_angle
    ) and np.allclose(
        angle_between(vec2, _), angle_between(vec1, vec2) * (1 - part_of_angle)
    ):
        return rotation_from_angle_and_plane(
            -angle_between(vec1, vec2) * part_of_angle,
            *vecs_with_plane_span(vec1, vec2)
        ) @ np.transpose(vec1)
    return _


def vecs_with_plane_span(vec1, vec2):
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    _x = vec1 / np.linalg.norm(vec1)
    _y = vec2 - np.dot(_x, vec2) * _x
    _y = (_y) / np.linalg.norm(_y)
    return _x, _y


def visit(v1, v2):
    v1 = np.array(v1)
    v2 = np.array(v2)
    return vec1_to_vec2(v1, v2, 0.2)


def visit_inv(v1, v2):
    v1 = np.array(v1)
    v2 = np.array(v2)
    return vec1_to_vec2_inv(
        # v1, v2, 0.2
        v1,
        v2,
        0.25,
    )


def saved(v1, v2):
    v1 = np.array(v1)
    v2 = np.array(v2)
    return vec1_to_vec2(
        # v1, v2, 0.2
        v1,
        v2,
        0.1,
    )


def saved_inv(v1, v2):
    v1 = np.array(v1)
    v2 = np.array(v2)
    return vec1_to_vec2_inv(
        # v1, v2, 0.2
        v1,
        v2,
        1 / 9,
    )

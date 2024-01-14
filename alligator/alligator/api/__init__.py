import toolz
from fastapi import FastAPI

from . import auth, event, user


def create_app() -> FastAPI:
    return toolz.pipe(
        FastAPI(),
        auth.bootstrap,
        event.bootstrap,
        user.bootstrap,
    )

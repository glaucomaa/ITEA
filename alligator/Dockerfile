# pull official base image
FROM python:3.10.8-slim-buster

# set working directory
WORKDIR /usr/src/alligator

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV ALGORITHM HS256
ENV SECRET_KEY 292168e4b5aa82a005b886ccb7e7500d1a78d55360964fc50c45d42c555acfb3

# install system dependencies
RUN apt-get update && apt-get clean

# install python dependencies
RUN pip install --upgrade pip
RUN pip install poetry
COPY poetry.lock .
COPY pyproject.toml .
RUN poetry install --no-root

# add app
COPY . .
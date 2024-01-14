# pull official base image
FROM python:3.10.8-slim-buster

# set working directory
WORKDIR /usr/src/event-loader

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV ICT2GO_BASE_URL https://ict2go.ru
ENV ICT2GO_EVENTS_URL https://ict2go.ru/events
ENV IT_WORLD_EVENTS_URL https://www.it-world.ru/events/
ENV IT_WORLD_BASE_URL https://www.it-world.ru
ENV IT_EVENTS_BASE_URL https://it-events.com

# install system dependencies
RUN apt-get update && apt-get clean

# install python dependencies
RUN pip install --upgrade pip
RUN pip install poetry
#COPY poetry.lock .
#COPY pyproject.toml .
COPY . .
RUN poetry install

# add app
#COPY . .
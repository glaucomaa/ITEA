import requests
import toolz
from bs4 import BeautifulSoup
from datetime import datetime
from event_loader.model import Event
from functools import partial
from pydantic import AnyHttpUrl, BaseSettings, Field
from typing import Iterable, List


class Settings(BaseSettings):
    """Base request settings"""

    BASE_URL: AnyHttpUrl = Field()
    EVENTS_URL: AnyHttpUrl = Field()

    class Config:
        env_prefix = "ICT2GO_"
        env_file = "config/.env"


def get_events_table_page(settings: Settings) -> str:
    """Function that gets response from 'EVENTS_TABLE_ICT2GO_URL'.
    Args:
        settings: Base request settings.
    Returns:
        Html response of the page.
    """
    response = requests.get(url=settings.EVENTS_URL)
    return response.text


def parse_events_links(html: str, settings: Settings) -> Iterable[str]:
    """Function that parses all events links from 'EVENTS_TABLE_ICT2GO_URL'.
    Args:
        html: The given html response from the 'EVENTS_TABLE_ICT2GO_URL'.
        settings: Base request settings.
    Returns:
        The list of all events links.
    """
    return [
        settings.BASE_URL + link.get("href")
        for link in BeautifulSoup(html, "lxml").find_all(class_="media-left image-link")
    ]


def get_event_page(event_url: str) -> str:
    """Function that gets response for the given event.
    Args:
        event_url: The event's url.
    Returns:
        Html response of the page.
    """
    response = requests.get(url=event_url)
    return response.text


def parse_event(html: str, settings: Settings) -> Event:
    """Function that parses the given event.
    Args:
        html: Html response of the event's page.
        settings: Base request settings.
    Returns:
        The Event pydantic BaseModel

    """
    soup = BeautifulSoup(html, "lxml")

    event_title = soup.find(class_="event-h1").text
    event_format = soup.find(class_="event-type").text
    event_category_list = [
        item.text for item in soup.find(class_="event-themes").find_all("a")
    ][1:]
    event_full_date_time = (
        soup.find(class_="date-info").text.removeprefix("Дата проведения:").strip()
    )
    event_date_time = datetime.strptime(
        event_full_date_time[
            :event_full_date_time.find(" ")
        ]
        .rstrip(".")
        .replace('.', '/', 2),
        '%d/%m/%Y'
    )

    event_full_place = (
        soup.find(class_="place-info")
        .text.removeprefix("Место проведения:")
        .strip()
        .rstrip(",")
    )
    event_image = settings.BASE_URL + soup.find(class_="event-info media").find(
        "img"
    ).get("src")
    event_description = soup.find(class_="tab-item description-info").text

    try:
        event_site = soup.find(class_="www-info invoke-count").get("href")
    except AttributeError:
        event_site = None

    try:
        event_organizers = [
            item.text for item in soup.find(class_="organizers").find_all("a")
        ]
    except AttributeError:
        event_organizers = None

    return Event(
        title=event_title,
        kind=event_format,
        category_list=event_category_list,
        date_time=event_date_time,
        full_date_time=event_full_date_time,
        full_place=event_full_place,
        site=event_site,
        organizers=event_organizers,
        image_url=event_image,
        description=event_description,
    )


def loader() -> List[Event]:
    """The main function that parses all events from 'EVENTS_TABLE_ICT2GO_URL'.
    Returns:
        The list of events.
    """
    settings = Settings()
    try:
        events_link_list = parse_events_links(get_events_table_page(settings), settings)
        return toolz.pipe(
            events_link_list,
            toolz.curried.map(get_event_page),
            toolz.curried.map(partial(parse_event, settings=settings)),
            list,
        )
    except (requests.exceptions.ConnectionError, ConnectionError, AttributeError):
        return []

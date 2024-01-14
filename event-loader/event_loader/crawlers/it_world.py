import requests
import re
import toolz
from bs4 import BeautifulSoup
from datetime import datetime
from event_loader.model import Event
from functools import partial
from pydantic import AnyHttpUrl, BaseSettings, Field
from typing import List


class Settings(BaseSettings):
    """Base request settings"""

    BASE_URL: AnyHttpUrl = Field()
    EVENTS_URL: AnyHttpUrl = Field()

    class Config:
        env_prefix = "IT_WORLD_"
        env_file = "config/.env"


def get_number_of_pages(html: str) -> int:
    """
    Function that counts number of pages to parse on IT_WORLD_EVENTS_URL.
    Args:
        html: Html response of the IT_WORLD_EVENTS_URL.
    Returns:
        Number of pages.
    """
    return max(
        len(BeautifulSoup(html, "lxml").find(class_="part_2").find_all("a")) - 1,
        1
    )


def get_events_table_page(settings: Settings, number: int = 1) -> str:
    """Function that gets response from 'IT_WORLD_EVENTS_URL' with chosen page.
    Args:
        settings: Base request settings.
        number: Number of the page.
    Returns:
        Html response of the page.
    """
    response = requests.get(url=settings.EVENTS_URL + f"?PAGEN_1={number}&IBLOCK_CODE=events")
    return response.text


def parse_events_links(html: str, settings: Settings) -> List[str]:
    """Function that parses all events links from 'EVENTS_TABLE_IT_WORLD_URL'.
    Args:
        html: The given html response from the 'EVENTS_TABLE_IT_WORLD_URL'.
        settings: Base request settings.
    """
    return [
        settings.BASE_URL + link.find("a").get("href")
        for link in BeautifulSoup(html, "lxml").find_all(class_="event-list")
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


def parse_event(html: str, settings: Settings):
    """Function that parses the given event.
    Args:
        html: Html response of the event's page.
        settings: Base request settings.
    Returns:
        The Event pydantic BaseModel
    """
    soup = BeautifulSoup(html, "lxml")

    event_title = soup.find("h1").text

    path = soup.find(class_="page-content__breadcrumb").find_all("li")
    event_format = path[-1].find("span").text

    try:
        event_time = (
            " - " +
            soup.find(class_="ico-line ico-time")
            .text
            .strip()
        )
    except AttributeError:
        event_time = ""
    event_date = soup.find(class_="ico-line ico-date").text.strip()
    event_full_date_time = event_date + event_time

    len_of_date = min(8, len(event_date))
    event_date_time = datetime.strptime(
        event_date[:len_of_date]
        .replace('.', '/', 2),
        "%d/%m/%y"
    )

    try:
        event_place = (
            ", " +
            soup.find(class_="ico-line ico-place")
            .find("a")
            .text
            .strip()
        )
    except AttributeError:
        event_place = ""
    online_or_offline = soup.find(class_="ico-line ico-type").text.strip()
    event_full_place = online_or_offline + event_place

    event_description = re.sub(
        r'\s+',
        ' ',
        soup.find(class_="news-detail__content").text
    )

    return Event(
        title=event_title,
        kind=event_format,
        date_time=event_date_time,
        full_date_time=event_full_date_time,
        full_place=event_full_place,
        description=event_description,
    )


def loader() -> List[Event]:
    """The main function that parses all events from 'EVENTS_TABLE_IT_WORLD_URL'.
    Returns:
        The list of events.
    """
    settings = Settings()
    try:
        number_of_pages = get_number_of_pages(get_events_table_page(settings))

        event_links_list = []
        for num in range(1, number_of_pages + 1):
            event_links_list.extend(parse_events_links(get_events_table_page(settings, num), settings))

        return toolz.pipe(
            event_links_list,
            toolz.curried.map(get_event_page),
            toolz.curried.map(partial(parse_event, settings=settings)),
            list,
        )
    except (ConnectionError, requests.exceptions.ConnectionError, AttributeError):
        return []

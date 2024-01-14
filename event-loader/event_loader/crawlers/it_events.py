import re
import requests
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

    class Config:
        env_prefix = "IT_EVENTS_"
        env_file = "config/.env"


def get_number_of_pages(html: str) -> int:
    """
    Function that counts number of pages to parse on IT_EVENTS_BASE_URL.
    Args:
        html: Html response of the IT_EVENTS_BASE_URL.
    Returns:
        Number of pages.
    """
    return max(
        len(BeautifulSoup(html, "lxml").find(class_="paging").find_all("a")) - 1,
        1
    )


def get_events_table_page(settings: Settings, number: int = 1) -> str:
    """Function that gets response from 'IT_EVENTS_BASE_URL' with chosen page.
    Args:
        settings: Base request settings.
        number: Number of the page.
    Returns:
        Html response of the page.
    """
    response = requests.get(url=settings.BASE_URL + f"/?page={number}")
    return response.text


def parse_events_links(html: str, settings: Settings) -> List[str]:
    """Function that parses all events links from 'IT_EVENTS_BASE_URL'.
    Args:
        html: The given html response from the 'IT_EVENTS_BASE_URL'.
        settings: Base request settings.
    """
    return [
        settings.BASE_URL + link.get("href")
        for link in BeautifulSoup(html, "lxml").find_all(class_="event-list-item__title")
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


def parse_event(html: str, settings: Settings) -> Event | None:
    """Function that parses the given event.
    Args:
        html: Html response of the event's page.
        settings: Base request settings.
    Returns:
        The Event pydantic BaseModel
    """
    soup = BeautifulSoup(html, "lxml")

    try:
        event_title = soup.find(class_="event-header__title").text.strip()
    except AttributeError:
        return None

    try:
        online_or_offline = (
            ", " +
            soup.find(
                class_="event-header__line event-header__line_icon event-header__line_icon_online"
            )
            .text
            .strip()
        )
    except AttributeError:
        online_or_offline = ""
    event_format = soup.find(class_="nav-tabs-item nav-tabs-item_active").text.strip() + online_or_offline

    event_full_date_time = re.sub(
        r'\s+',
        ' ',
        soup.find(
            class_="event-header__line event-header__line_bold event-header__line_icon"
        ).text.strip()
    )

    def str_to_datetime(date_str: str) -> datetime:
        """Function that converts date string from it-events to datetime format.
            Args:
                date_str: Date string from it-events.
            Returns:
                Datetime format of it-events date string.
        """
        months = {
            "января": "1",
            "февраля": "2",
            "марта": "3",
            "апреля": "4",
            "мая": "5",
            "июня": "6",
            "июля": "7",
            "августа": "8",
            "сентября": "9",
            "октября": "10",
            "ноября": "11",
            "декабря": "12"
        }
        list_of_date_attrs = date_str.split(" ")
        list_of_date_attrs[1] = months[list_of_date_attrs[1]]
        return datetime.strptime(
            "/".join(list_of_date_attrs),
            '%d/%m/%Y'
        )

    event_date_time = str_to_datetime(
        event_full_date_time[:event_full_date_time.find("(")]
        .strip()
    )

    try:
        event_full_place = soup.find(
            class_="event-header__line event-header__line_addr"
        ).text.strip()
    except AttributeError:
        event_full_place = "Онлайн"

    try:
        event_site = soup.find(
            class_="event-common-item__link event-common-item__link_ellipsis"
        ).text.strip()
    except AttributeError:
        event_site = None

    event_description = (
        soup.find(class_="col-md-8 user-generated").text
    )

    return Event(
        title=event_title,
        kind=event_format,
        date_time=event_date_time,
        full_date_time=event_full_date_time,
        full_place=event_full_place,
        site=event_site,
        description=event_description,
    )


def loader() -> List[Event]:
    """The main function that parses all events from 'IT_EVENTS_BASE_URL'.
    Returns:
        The list of events.
    """
    settings = Settings()
    try:
        try:
            number_of_pages = get_number_of_pages(get_events_table_page(settings))
        except AttributeError:
            number_of_pages = 1

        event_links_list = []
        for num in range(1, number_of_pages + 1):
            event_links_list.extend(parse_events_links(get_events_table_page(settings, num), settings))

        return (toolz.pipe(
            event_links_list,
            toolz.curried.map(get_event_page),
            toolz.curried.map(partial(parse_event, settings=settings)),
            toolz.curried.filter(lambda event: event is not None),
            list,
        ))
    except (ConnectionError, requests.exceptions.ConnectionError):
        return []

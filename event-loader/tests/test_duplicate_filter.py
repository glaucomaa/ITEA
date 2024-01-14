import pytest
from event_loader.duplicate_filter import remove_duplicates
from event_loader.model import Event
from typing import List


def get_event(title: str) -> Event:
    """Function that returns Event with the given title.
       Args:
           title: Event title.
       Returns:
           Event object.
    """
    return Event(
        title=title,
        kind="kind1",
        category_list=["category1"],
        full_date_time="date_time",
        full_place="place",
        site="site",
        organizers=None,
        description="description"
    )


def get_list_without_duplicates(title: str) -> List[Event]:
    """Function that returns list of events without duplicates.
           Args:
               title: Event title. Will be modified for the second event list.
           Returns:
               List of events.
        """
    event_list1 = [get_event(title)]
    event_list2 = [get_event(" " + title.lower() + "   ")]
    return remove_duplicates(event_list1, event_list2)


@pytest.mark.parametrize(
    "test_input,expected",
    [
        ("Event 1", [get_event("Event 1")]),
        ("Мероприятие по Frontend", [get_event("Мероприятие по Frontend")]),
        ("IT CONF 2022", [get_event("IT CONF 2022")])
    ]
)
def test_remove_duplicates(test_input, expected):
    assert get_list_without_duplicates(test_input) == expected

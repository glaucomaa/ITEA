from model import Event
from typing import List


def remove_duplicates(*event_lists: List[Event]) -> List[Event]:
    """Function that removes duplicate events from the given event lists.
       It saves the same event from the first source passed as argument.
       Args:
           event_lists: Given event lists.
       Returns:
           Event list without duplicates.
    """
    event_set = set()
    for lst in event_lists:
        for event in lst:
            event_set.add(event)
    return list(event_set)

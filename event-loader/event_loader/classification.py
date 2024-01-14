from model import Event
from typing import List
from init_classification import classification


def classify_events(events: List[Event]):
    """Function that classifies the list of events.
    Should be called after duplicate_filter.py.
        Args:
            events: Given event list without duplicates.
    """
    for event in events:
        event.description_vec, event.cluster = classification(event.description)

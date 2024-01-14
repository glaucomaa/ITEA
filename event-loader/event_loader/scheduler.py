import database
import duplicate_filter
import threading
import time
import schedule
import toolz
from classification import classify_events
from crawlers import ict2go, it_events, it_world


def run_continuously(interval=1):
    """Continuously run, while executing pending jobs at each
    elapsed time interval.
    @return cease_continuous_run: threading. Event which can
    be set to cease continuous run.
    """
    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):
        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                schedule.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.start()
    return cease_continuous_run


def etl_job():
    """ Function that triggers the ETL job."""
    events = duplicate_filter.remove_duplicates(
        ict2go.loader(),
        it_events.loader(),
        it_world.loader()
    )
    classify_events(events)

    toolz.pipe(
        events,
        database.upsert_data
    )


if __name__ == "__main__":
    etl_job()
    # Run job on a specific day of the week
    schedule.every().day.at("23:59").do(etl_job)
    # Start the background thread
    stop_run_continuously = run_continuously()

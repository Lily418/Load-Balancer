import urllib.request
import threading
import timeit
import time
import redis
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
#from ws4py.websocket import WebSocket

training_mode = False
redis = redis.StrictRedis()
training = []
testing  = []
simulation_profile = []

for key in redis.keys("wikiviews:*"):
    views = int(redis.get(key).decode("utf-8"))
    key = key.decode("utf-8")[10:]
    record_datetime = datetime.fromtimestamp(int(key) / 1000)
    if record_datetime.year == 2013:
        training.append((record_datetime, views))
    elif record_datetime.year == 2014:
        testing.append((record_datetime, views))


if training_mode:
    simulation_profile = training
else:
    simulation_profile = testing

simulation_profile.sort(key=lambda time_views: time_views[0])
max_views = max(training + testing, key=lambda time_views: time_views[1])[1]
min_views = min(training + testing, key=lambda time_views: time_views[1])[1]


def make_request():
    urllib.request.urlopen('http://192.168.56.114:3000').read()

def time_requests():
    while True:
        t = timeit.Timer("make_request()", "from __main__ import make_request")
        print(t.timeit(1))
        time.sleep(5)


threading.Thread(target=time_requests).start()

with ThreadPoolExecutor(max_workers=50) as executor:
    def request_interval(target_requests):
        for i in range(0, target_requests):
            time.sleep(30 / target_requests)
            executor.submit(make_request)

    def scale(newMin, newMax, oldMin, oldMax, num):
        newRange = newMax - newMin
        return newMin + (newRange * ((num - oldMin) / (oldMax - oldMin)))

    def make_requests():
        while len(simulation_profile) > 0:
            simulation_data = simulation_profile.pop(0)
            simulation_time = simulation_data[0]
            page_views = simulation_data[1]
            views = int(scale(0, 160, min_views, max_views, page_views))
            print("It's " + str(simulation_time) + " Making " + str(views) + " requests")
            request_interval(views)

        print("SIM END")



    make_requests()

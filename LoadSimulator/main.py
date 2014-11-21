import urllib.request
import threading
import timeit
import time
import redis
from datetime import datetime

training_mode = True
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

print(str(len(training)) + " == " + str(len(testing)))

if training_mode:
    simulation_profile = training
else:
    simulation_profile = testing

simulation_profile.sort(key=lambda time_views: time_views[0])
max_views = max(training + testing, key=lambda time_views: time_views[1])[1]
min_views = min(training + testing, key=lambda time_views: time_views[1])[1]


class Requestor:

    count = 0;

    def __init__(self):
        self.run = False
        self.count = Requestor.count
        Requestor.count += 1

    def make_request(self):
        urllib.request.urlopen('http://192.168.56.101:3000').read()

    def request_loop(self):
        while True:
            if self.run:
                self.make_request()
            else:
                time.sleep(0)

def scale(newMin, newMax, oldMin, oldMax, num):
    newRange = newMax - newMin
    return newMin + (newRange * ((num - oldMin) / (oldMax - oldMin)))

def make_requests():
    requestors = []
    max_threads = 10
    for i in range(max_threads):
        requestor = Requestor()
        requestors.append(requestor)
        threading.Thread(target=requestor.request_loop).start()

    print(len(simulation_profile))
    while len(simulation_profile) > 0:
        simulation_data = simulation_profile.pop(0)
        simulation_time = simulation_data[0]
        page_views = simulation_data[1]
        threads = int(scale(1, 10, min_views, max_views, page_views))
        print("It's " + str(simulation_time) + " Running " + str(threads) + " threads")

        for i in range(len(requestors)):
            if i < threads:
                requestors[i].run = True
            else:
                requestors[i].run = False

        time.sleep(30)



make_requests()

def time_request():
    t = timeit.Timer("Requestor().make_request()", "from __main__ import Requestor")
    print(t.timeit(1))
    time.sleep(10)
    time_request()



threading.Thread(target=time_request).start()

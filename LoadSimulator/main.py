import urllib.request
import threading
import timeit
import time

def make_request():
    while True:
        print(urllib.request.urlopen('http://192.168.56.101:3000').read())

def make_requests():
    threads = []
    for i in range(2):
        threads.append(threading.Thread(target=make_request))

    for t in threads:
        t.start()

make_requests()

def time_request():
    t = timeit.Timer("make_request()", "from __main__ import make_request")
    print(t.timeit(1))
    time.sleep(10)
    time_request()



threading.Thread(target=time_request).start()

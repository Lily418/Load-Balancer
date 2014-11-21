# The WikiPage view logs are incomplete, possibly due to server downtime or a crash on the reporting program. This script replaces any missing hours with the value from the previous hour so when making the lists of datapoints for each month will be the same length so the indexes match with the same timeframe.

import redis
redis = redis.StrictRedis()

#Jan 2014
time = 1388534400000
step = 3600000
end_time = 1391209200000
last_value = 0

while True:
    value = redis.get("wikiviews:" + str(time))
    print(value)
    if value != None:
       last_value = int(value.decode("utf-8"))
    else:
        redis.set("wikiviews:" + str(time), last_value)

    time += step

    if time == end_time:
        break

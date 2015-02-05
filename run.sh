#!/usr/bin/env bash
redis-server --dir DataCollection/ &
node CloudController/main.js &
(cd Visualisation && python -mSimpleHTTPServer) &
open -a "/Applications/Google Chrome.app" 'http://127.0.0.1:8000/'
echo Start Load Predictor on VM now
read
python3 LoadSimulator/main.py

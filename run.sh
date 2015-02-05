#!/usr/bin/env bash
redis-server --dir DataCollection/ > redis_out.txt &
node CloudController/main.js  > cloud_controller_out.txt &
python -mSimpleHTTPServer > http_server_out.txt &
open -g -a "/Applications/Google Chrome.app" 'http://127.0.0.1:8000/Visualisation'
echo Start Load Predictor on VM now
read
python3 LoadSimulator/main.py > load_simulator_out.txt &
echo "Input to end"
read
pkill -f "python -mSimpleHTTPServer"
pkill -f "LoadSimulator/main.py"
pkill -f "node CloudController/main.js"
pkill -f "redis-server"

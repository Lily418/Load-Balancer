#!/usr/bin/env bash
wget https://dumps.wikimedia.org/other/pagecounts-raw/2013/2013-01/$1
node process_wikilogs.js $1 $2
rm $1

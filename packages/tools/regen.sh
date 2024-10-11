#! /bin/sh
target=$1
./initQgisPrj.sh $target
./classifyGeometries.sh $target
./tagAddresses.sh $target

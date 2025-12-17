#!/usr/bin/env zsh

orig=$1
shift
dirs=$@

for d in ${dirs}; do
  pushd ${orig}
  mkdir -p ../${d}/src/data
  cp *.html *.json *.ts ../${d}
  cp src/*.* ../${d}/src
  popd
  pushd ${d}
    pnpm install
    ../../tools/getOsm.sh
    ../../tools/makeAreas.sh
    ../../tools/readOsm.sh
  popd
done

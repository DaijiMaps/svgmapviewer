for f in names-*.txt; do
  floor=$f
  floor=${floor%.txt}
  floor=${floor#names-}
  python3 gen-labels.py $f -f 16 -p >labels-${floor}.txt
  python3 gen-labels.py $f -f 16 -p -j >labels-${floor}.json
  python3 resolve-labels.py ${floor}
done

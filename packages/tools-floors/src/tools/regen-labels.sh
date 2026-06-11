for f in names-*.txt; do
  floor=$f
  floor=${floor%.txt}
  floor=${floor#names-}
  python3 gen-labels.py $f -f 16 >labels-${floor}.txt
  python3 gen-labels.py $f -f 16 -j >labels-${floor}.json
  python3 gen-labels.py $f -f 16 -w >labels-nowrap-${floor}.txt
  python3 gen-labels.py $f -f 16 -j -w >labels-nowrap-${floor}.json
  python3 resolve-labels.py ${floor} -a 0.4
done

DIR=$( inkscape --user-data-directory )

#rm "${DIR}"/*.inx "${DIR}"/*.py
cp -p *.inx *.py "${DIR}"

subdirs='
daijimaps
'

for subdir in ${subdirs}; do
  mkdir -p "${DIR}/${subdir}"
  rm "${DIR}/${subdir}/"*.py
  cp -p ${subdir}/*.py "${DIR}/${subdir}"
done

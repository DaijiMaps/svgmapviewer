DIR_MACOS="${HOME}/Library/Application Support/org.inkscape.Inkscape/config/inkscape/extensions"
DIR_LINUX="${HOME}/.config/inkscape/extensions"

if [ -d ${DIR_MACOS} ]; then
  DIR=${DIR_MACOS}
elif [ -d ${DIR_LINUX} ]; then
  DIR="${DIR_LINUX}"
fi

rm "${DIR}"/*.inx "${DIR}"/*.py
cp -p *.inx *.py "${DIR}"

subdirs='
daijimaps
'

for subdir in ${subdirs}; do
  mkdir -p "${DIR}/${subdir}"
  rm "${DIR}/${subdir}/"*.py
  cp -p ${subdir}/*.py "${DIR}/${subdir}"
done

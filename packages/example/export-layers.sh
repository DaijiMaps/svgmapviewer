dir=${PWD}/src/assets

all=floors.inkscape.svg

inkscape="inkscape $all --export-id-only --export-type=svg --export-plain-svg"

cd $dir

$inkscape --export-id="layer1" --export-filename=1f.svg
$inkscape --export-id="layer2" --export-filename=2f.svg

for x in 1 2; do
  inkscape -jl -i layer${x} -o src/${x}f.svg src/floors.inkscape.svg
done

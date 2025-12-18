for x in 1 2; do
  inkscape -jl -i layer${x} -o src/assets/${x}f.svg src/assets/floors.inkscape.svg
done

(
cd src/assets
for x in 1 2; do
  inkscape -jl -i layer${x} -o ${x}f.svg floors.inkscape.svg
done
)

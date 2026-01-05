(
cd src/assets
for x in 1 2; do
  inkscape -jl -i layer${x} -o floor-${x}f.svg floors.inkscape.svg
  perl -0777 -pi -le "s/font-family:[^;]+?;/font-family:'Ubuntu Sans',sans-serif;/gmos" floor-${x}f.svg
done
)

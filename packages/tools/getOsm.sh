# XXX rewrite this in python

tools=$( cd $( dirname $0 ); pwd )


# Take bbox and get map.osm
getByBounds() {
    osm=$1; shift
    # left, bottom, right, top
    bbox=$( echo $@ | sed -e 's,^  ,,; s,  *$,,; s/ /,/g' )
    url="https://api.openstreetmap.org/api/0.6/map?bbox=${bbox}"
    wget -O ${osm}.tmp "$url" || curl -o ${osm}.tmp "$url" || exit 1
    # XXX fixup-map-osm-exe ${osm}.tmp ${osm}
    cp ${osm}.tmp ${osm}
    rm -f ${osm}.tmp
}

# Take map.osm, parse its <bounds>, and get the bbox
getByFile() {
    osm=$1
    eval $(
        sed -ne '/^ *<bounds / {
            # <bounds minlat="-36.8650000" minlon="174.7183000" maxlat="-36.8601000" maxlon="174.7242000"/>
            s,^ *<bounds ,,
            s,/>$,,
            p
            # minlat="-36.8650000" minlon="174.7183000" maxlat="-36.8601000" maxlon="174.7242000"
        }' <$osm
    )
    # left, bottom, right, top
    getByBounds $osm $minlon $minlat $maxlon $maxlat
}

if [ $# -eq 0 ]; then
    osms=$( echo map*.osm )
    case $osms in
        *\**)
	    echo 'map*.osm not found!' >&2
	    exit 1
	    ;;
    esac
    set -- $osms
fi

while [ $# -gt 0 ]; do
    getByFile $1
    shift
done

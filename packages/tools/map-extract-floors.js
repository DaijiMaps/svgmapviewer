#!/usr/bin/env node

// src/lib/inkscape/bb.ts
import { spawnSync } from "node:child_process";
var allBoundingBoxes = /* @__PURE__ */ new Map();
var parseBoundingBoxCSV = (content) => {
  content
    .split(/\n/)
    .filter((s) => s !== "")
    .filter((s) => s.match(/^[A-Z]/))
    .map((s) => {
      const values = s.split(/,/);
      if (values.length === 5) {
        try {
          const nums = values.slice(1).map(parseFloat);
          allBoundingBoxes.set(values[0], {
            x: nums[0],
            y: nums[1],
            width: nums[2],
            height: nums[3],
          });
        } catch (e) {
          console.log(e);
        }
      }
      return s;
    });
  console.log("bb:", allBoundingBoxes);
};
var generateBoundingBoxCSV = (infile, outdir) => {
  const res = spawnSync("inkscape", ["-S", infile], {
    cwd: outdir,
  });
  return res.stdout.toString();
};

// src/lib/transform.ts
import tp from "@jutaz/transform-parser";
function parseTransformForAddress(transform) {
  const p = tp.parse(transform);
  if (p) {
    if (p.length === 1) {
      const t = p[0];
      if (t.type === "translate" && t.z === null) {
        if (t.x?.unit === null && t.y?.unit === null) {
          return { x: t.x?.value ?? 0, y: t.y?.value ?? 0 };
        }
      }
    }
  }
  return null;
}

// src/lib/inkscape.ts
var getLabel = (n) => getStringProperty(n, "inkscape:label");
var getTransform = (n) => getStringProperty(n, "transform");
function getName(n) {
  const a = "name" in n ? n?.name : void 0;
  return typeof a === "string" ? a : null;
}
function getHref(n) {
  return getStringProperty(n, "xlink:href") || getStringProperty(n, "href");
}
function getStringProperty(n, p) {
  const a = "attributes" in n ? n?.attributes?.[p] : void 0;
  return typeof a === "string" ? a : null;
}
function getPoint(e) {
  const name = getName(e);
  if (name === "use") {
    const x2 = getTransform(e);
    if (x2 !== null) {
      const p = parseTransformForAddress(x2);
      if (p !== null) {
        const href = getHref(e);
        if (href) {
          const id = href.replace(/^#/, "");
          const bb = allBoundingBoxes.get(id);
          if (bb !== void 0) {
            const r = bb.width / 2;
            return { ...p, r };
          }
        }
      }
    }
  } else if (name === "circle" || name === "ellipse") {
    const cx = getStringProperty(e, "cx");
    const cy = getStringProperty(e, "cy");
    if (typeof cx === "string" && typeof cy === "string") {
      try {
        const x2 = parseFloat(cx);
        const y = parseFloat(cy);
        if (name === "circle") {
          const r = parseFloat(getStringProperty(e, "r") || "");
          if (typeof r === "number") {
            return { x: x2, y, r };
          }
        } else {
          const rx = parseFloat(getStringProperty(e, "rx") || "");
          const ry = parseFloat(getStringProperty(e, "ry") || "");
          if (typeof rx === "number" && typeof ry === "number") {
            return { x: x2, y, r: (rx + ry) / 2 };
          }
        }
      } catch (e2) {
        console.log(e2);
      }
    }
  }
  return null;
}
function isPoint(e) {
  const label = getLabel(e);
  if (label !== null) {
    if (label.match(/^[1-9][0-9]*$/)) {
      return true;
    }
  }
  return false;
}
function buildAddress(n, parents) {
  const suffix = getLabel(n);
  if (suffix === null) {
    return null;
  }
  const prefix = parents
    .filter(getLabel)
    .map(getLabel)
    .join("-")
    .replace(/-Content-/, "-")
    .replace(/^/, "A");
  const address = prefix && suffix ? `${prefix}-${suffix}` : "";
  return checkAddress(address) ? address : null;
}
function checkAddress(address) {
  return address !== "" && /^.*-[0-9]+$/.test(address);
}

// src/lib/utils/snake-to-camel.ts
var capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
var snakeToCamel = (k) => {
  if (k.match(/^.*-.*$/)) {
    return k
      .split(/-/)
      .map((s, i) => (i === 0 ? s : capitalize(s)))
      .join("");
  }
  return k;
};

// src/lib/inkscape/svg.ts
import { pipe } from "effect";
import { filter } from "unist-util-filter";
import { convert, is } from "unist-util-is";
import { map } from "unist-util-map";
import { x } from "xastscript";
var HIDDEN_GROUPS_RE =
  /(\(Background\)|\(Names\)|\(Unresolved Names\)|Shops|Facilities)/;
var testRemoveHiddenNodes = convert((n) => {
  if (is(n, "cdata")) {
    return false;
  }
  if (is(n, "comment")) {
    return false;
  }
  if (is(n, "instruction")) {
    return false;
  }
  if (is(n, "text")) {
    return false;
  }
  if ("attributes" in n) {
    if (n.attributes["inkscape:label"]?.match(HIDDEN_GROUPS_RE)) return false;
  }
  if ("children" in n && n.children.length === 0 && n.name === "g") {
    return false;
  }
  return true;
});
var fixupRemoveHiddenNodes = (tree) => {
  return filter(tree, { cascade: false }, testRemoveHiddenNodes);
};
var fixupId = (a) => {
  if (a["id"]?.match(/^[a-z]/)) {
    delete a["id"];
  }
  return a;
};
var fixupHref = (a) => {
  const xlinkHref = a["xlink:href"];
  if (xlinkHref) {
    delete a["xlink:href"];
    a["href"] = xlinkHref;
    return a;
  }
  return a;
};
var conv = (a) => {
  const patterns = [/^style$/, /^inkscape:.*$/, /^sodipodi:.*$/];
  for (const [k] of Object.entries(a)) {
    for (const p of patterns) {
      if (k.match(p)) {
        delete a[k];
      }
    }
  }
  return a;
};
var fixupSnake = (a) => {
  for (const [k, v] of Object.entries(a)) {
    if (k.match(/-/)) {
      const kk = snakeToCamel(k);
      delete a[k];
      a[kk] = v;
    }
  }
  return a;
};
var fixupAttributes = (tree) => {
  return tree === void 0
    ? tree
    : map(tree, (x2) => {
        if (is(x2, "element")) {
          return {
            ...x2,
            attributes: pipe(
              x2.attributes,
              conv,
              fixupId,
              fixupHref,
              fixupSnake,
            ),
          };
        }
        return x2;
      });
};
var fixupElements = (tree) =>
  // XXX call fixupRemoveHiddenNodes twise
  pipe(tree, fixupRemoveHiddenNodes, fixupRemoveHiddenNodes, fixupAttributes);

// src/lib/inkscape/floors-floors.ts
import * as Doc from "@effect/printer/Doc";
import { pipe as pipe2 } from "effect";
import * as fs from "fs";
import { is as is2 } from "unist-util-is";
import { visitParents } from "unist-util-visit-parents";
import { toXml } from "xast-util-to-xml";
var allLayerNames = new Array();
var saveAllFloorLayerNames = (ast) => {
  visitParents(ast, (n) => {
    if (is2(n, "element") && n.name === "g") {
      const label = n.attributes["inkscape:label"];
      if (
        n.attributes["inkscape:groupmode"] === "layer" && // exclude e.g. (Assets)
        label?.match(/[^(]/)
      ) {
        allLayerNames.push(label);
      }
    }
  });
};
var renderFloorTsx = (layer) => {
  const jsx = pipe2(layer.element, fixupElements, (e) =>
    e === void 0
      ? "<g/>"
      : toXml(e, {
          allowDangerousXml: true,
          closeEmptyElements: true,
        }),
  );
  const doc = Doc.vsep([
    Doc.text(`export const Floor${layer.name} = () => {`),
    Doc.text(`  return <>`),
    Doc.text(jsx),
    Doc.text(`  </>`),
    Doc.text(`}`),
  ]);
  return Doc.render(doc, { style: "pretty" });
};
var handleFloors = (layers, dir) => {
  for (const layer of layers) {
    const text7 = renderFloorTsx(layer);
    try {
      if (!fs.statSync(`${dir}/floors`)) {
        fs.mkdirSync(`${dir}/floors`);
      }
    } catch (e) {
      console.log(e);
    }
    fs.writeFileSync(`${dir}/floors/floor_${layer.name}.tsx`, text7, "utf8");
  }
};

// src/lib/inkscape/addresses-addresses.ts
import * as fs2 from "fs";
import { is as is3 } from "unist-util-is";
import { visitParents as visitParents2 } from "unist-util-visit-parents";
var allAddresses = /* @__PURE__ */ new Map();
var allPoints = /* @__PURE__ */ new Map();
var saveAllAddressesAndPoints = (ast) => {
  visitParents2(ast, (e, parents) => {
    if (is3(e, "element")) {
      if (isPoint(e)) {
        const a = buildAddress(e, parents);
        const p = getPoint(e);
        if (a !== null && p !== null) {
          allAddresses.set(a, p);
          const s = `${p.x},${p.y}`;
          let xs = allPoints.get(s);
          if (xs === void 0) {
            xs = [];
          }
          xs.push(a);
          allPoints.set(s, xs);
        }
      }
    }
  });
  console.log("allAddresses:", allAddresses);
  console.log("allPoints:", allPoints);
};
var Addresses = class extends Map {};
var saveAddrresses = (name) => {
  const addresses = new Addresses();
  for (const [k, v] of allAddresses.entries()) {
    if (k.match(`^A${name}-.*$`)) {
      addresses.set(k, v);
    }
  }
  console.log("saveAddresses:", name, "->", addresses);
  return addresses;
};
var renderAddresses = (addresses) => {
  const replacer = (k, v) => {
    if (v instanceof Map) {
      const m = {};
      for (const [mk, mv] of v.entries()) {
        if (
          typeof mk === "string" &&
          typeof mv === "object" &&
          "x" in mv &&
          typeof mv.x === "number" &&
          "y" in mv &&
          typeof mv.y === "number" &&
          "r" in mv &&
          typeof mv.r === "number"
        ) {
          m[mk] = { x: mv.x, y: mv.y, w: mv.r * 2 };
        } else {
        }
      }
      return m;
    } else {
      return v;
    }
  };
  return JSON.stringify(addresses, replacer, 2);
};
var handleAddrresses = (ast, dir) => {
  for (const name of allLayerNames.filter((n) => n.match(/^[^()]/))) {
    const addresses = saveAddrresses(name);
    const text7 = renderAddresses(addresses);
    try {
      if (!fs2.statSync(`${dir}/addresses`)) {
        fs2.mkdirSync(`${dir}/addresses`);
      }
    } catch (e) {
      console.log(e);
    }
    fs2.writeFileSync(`${dir}/addresses/addresses_${name}.json`, text7, "utf8");
  }
};

// src/lib/inkscape/addresses-resolved_addresses.ts
import * as fs3 from "fs";
import { is as is4 } from "unist-util-is";
import { visitParents as visitParents3 } from "unist-util-visit-parents";
var Addresses2 = class extends Map {};
var saveResolvedAddrresses = (ast) => {
  const addresses = new Addresses2();
  visitParents3(ast, (n) => {
    if (is4(n, "element")) {
      const label = n.attributes["inkscape:label"];
      if (label?.match(/ @ /)) {
        const [a, b] = label.split(/ @ /);
        if (typeof a === "string" && typeof b === "string") {
          addresses.set(b, a);
        }
      }
    }
  });
  return addresses;
};
var renderResolvedAddresses = (addresses) => {
  const o = Object.fromEntries(addresses.entries());
  return JSON.stringify(o, null, 2);
};
var handleResolvedAddrresses = (ast, dir) => {
  const resolvedAddresses = saveResolvedAddrresses(ast);
  const text7 = renderResolvedAddresses(resolvedAddresses);
  try {
    if (!fs3.statSync(`${dir}/addresses`)) {
      fs3.mkdirSync(`${dir}/addresses`);
    }
  } catch (e) {
    console.log(e);
  }
  fs3.writeFileSync(`${dir}/addresses/resolved_addresses.json`, text7, "utf8");
};

// src/lib/inkscape/assets.ts
import * as Doc2 from "@effect/printer/Doc";
import { pipe as pipe3 } from "effect";
import * as fs4 from "fs";
import { is as is5 } from "unist-util-is";
import { visitParents as visitParents4 } from "unist-util-visit-parents";
import { toXml as toXml2 } from "xast-util-to-xml";
var allAssets = [];
var saveAllAssets = (ast) => {
  const subtrees = [];
  visitParents4(ast, (n) => {
    if (is5(n, "element")) {
      const groupmode = n.attributes["inkscape:groupmode"];
      const label = n.attributes["inkscape:label"];
      if (groupmode && groupmode === "layer" && label && label === "(Assets)") {
        subtrees.push(n);
      }
    }
  });
  if (subtrees.length !== 1) {
    return [];
  }
  const subtree = subtrees[0];
  visitParents4(subtree, (n) => {
    if (is5(n, "element") && n.name === "g") {
      const id = n.attributes["id"];
      if (id) {
        if (id.match(/^[^A-Z].*$/)) {
          return;
        }
        if (id.match(/^XShop.*$/)) {
          return;
        }
        allAssets.push(n);
      }
    }
  });
};
var renderAssets = (assets) => {
  const jsx = pipe3(
    assets,
    (elems) => elems.map(fixupElements),
    (elems) =>
      toXml2(elems, {
        allowDangerousXml: true,
        closeEmptyElements: true,
      }),
  );
  const doc = Doc2.vsep([
    Doc2.text(`export const assets = () => {`),
    Doc2.text(`  return <>`),
    Doc2.text(jsx),
    Doc2.text(`  </>`),
    Doc2.text(`}`),
  ]);
  return Doc2.render(doc, { style: "pretty" });
};
var handleAssets = (ast, dir) => {
  const assets = allAssets;
  const text7 = renderAssets(assets);
  fs4.writeFileSync(`${dir}/assets.tsx`, text7, "utf8");
};

// src/lib/inkscape/facilities.ts
import * as fs5 from "fs";
var allLinks = /* @__PURE__ */ new Map();
var saveFacilities = () => {
  let n = 1;
  for (const [, v] of allPoints.entries()) {
    if (v.length < 2) {
      continue;
    }
    const xs = v.filter((a) => a.match(/^.*-Facilities-.*$/));
    if (xs.length < 2) {
      continue;
    }
    const xxs = xs.filter((a) => a.match(/^.*(Elevator|Stairs).*$/));
    if (xxs.length < 2) {
      continue;
    }
    allLinks.set(n, xxs);
    n = n + 1;
  }
  console.log("allLinks:", allLinks);
  return {
    biLinks: allLinks,
  };
};
var renderFacilities = (m) => {
  const replacer = (k, v) => {
    if (v instanceof Map) {
      const m2 = {};
      for (const [mk, mv] of v.entries()) {
        if (typeof mk === "number") {
          m2[`${mk}`] = mv;
        }
      }
      return m2;
    } else {
      return v;
    }
  };
  return JSON.stringify(m, replacer, 2);
};
var handleFacilities = (ast, dir) => {
  const facilities = saveFacilities();
  const text7 = renderFacilities(facilities);
  fs5.writeFileSync(`${dir}/facilities.json`, text7, "utf8");
};

// src/lib/inkscape/floors-addresses.ts
import * as Doc3 from "@effect/printer/Doc";
import * as fs6 from "fs";
var renderAddressesTs = (layers) => {
  const names = layers.map((l) => l.name);
  const doc = Doc3.vsep([
    Doc3.text(`import { FloorName } from '../floors/names'`),
    Doc3.vsep(
      names.map((n) =>
        Doc3.text(`import addresses${n}Json from './addresses_${n}.json'`),
      ),
    ),
    Doc3.text(``),
    Doc3.text(`export type Address =`),
    Doc3.vsep(
      names.map((x2) => Doc3.text(`  | keyof typeof addresses${x2}Json`)),
    ),
    Doc3.text(``),
    Doc3.text(`interface Point {`),
    Doc3.text(`  x: number`),
    Doc3.text(`  y: number`),
    Doc3.text(`  w: number`),
    Doc3.text(`}`),
    Doc3.text(``),
    Doc3.text(`type Addresses = Partial<Record<Address, Point>>`),
    Doc3.text(``),
    Doc3.text(`export const floorAddresses: Record<FloorName, Addresses> = {`),
    Doc3.vsep(names.map((x2) => Doc3.text(`  '${x2}': addresses${x2}Json,`))),
    Doc3.text(`}`),
  ]);
  return Doc3.render(doc, { style: "pretty" });
};
var handleFloorAddresses = (layers, dir) => {
  const text7 = renderAddressesTs(layers);
  try {
    if (!fs6.statSync(`${dir}/addresses`)) {
      fs6.mkdirSync(`${dir}/addresses`);
    }
  } catch (e) {
    console.log(e);
  }
  fs6.writeFileSync(`${dir}/addresses/addresses.ts`, text7, "utf8");
};

// src/lib/inkscape/floors-names.ts
import * as Doc4 from "@effect/printer/Doc";
import * as fs7 from "fs";
var renderNamesTs = (layers) => {
  const names = layers.map((l) => l.name);
  const doc = Doc4.vsep([
    Doc4.text(`export type FloorName = string`),
    Doc4.text(``),
    Doc4.text(`type NonEmptyReadonlyArray<T> = [T, ...Array<T>]`),
    Doc4.text(``),
    Doc4.text(`export type FloorNames = NonEmptyReadonlyArray<FloorName>`),
    Doc4.text(``),
    Doc4.text(`export const FloorNames: FloorNames = [`),
    Doc4.vsep(names.map((x2) => Doc4.text(`  '${x2}',`))),
    Doc4.text(`]`),
  ]);
  return Doc4.render(doc, { style: "pretty" });
};
var handleFloorNames = (layers, dir) => {
  const text7 = renderNamesTs(layers);
  try {
    if (!fs7.statSync(`${dir}/floors`)) {
      fs7.mkdirSync(`${dir}/floors`);
    }
  } catch (e) {
    console.log(e);
  }
  fs7.writeFileSync(`${dir}/floors/names.ts`, text7, "utf8");
};

// src/lib/inkscape/floors-renderers.ts
import * as Doc5 from "@effect/printer/Doc";
import * as fs8 from "fs";
var renderRenderersTs = (layers) => {
  const names = layers.map((l) => l.name);
  const doc = Doc5.vsep([
    Doc5.vsep(
      names.map((n) => Doc5.text(`import { Floor${n} } from './floor_${n}'`)),
    ),
    Doc5.text(``),
    Doc5.text(`export const renderers = {`),
    Doc5.vsep(names.map((x2) => Doc5.text(`  '${x2}': Floor${x2},`))),
    Doc5.text(`}`),
  ]);
  return Doc5.render(doc, { style: "pretty" });
};
var handleFloorRenderers = (layers, dir) => {
  const text7 = renderRenderersTs(layers);
  try {
    if (!fs8.statSync(`${dir}/floors`)) {
      fs8.mkdirSync(`${dir}/floors`);
    }
  } catch (e) {
    console.log(e);
  }
  fs8.writeFileSync(`${dir}/floors/renderers.ts`, text7, "utf8");
};

// src/lib/inkscape/layers.ts
import { is as is6 } from "unist-util-is";
import { visitParents as visitParents5 } from "unist-util-visit-parents";
var saveFloorLayers = (ast, layerNames) => {
  const layers = [];
  layerNames.forEach((layerName) => {
    const trees = [];
    visitParents5(ast, (n) => {
      if (is6(n, "element")) {
        if (n.attributes["inkscape:label"] === layerName) {
          trees.push({ name: layerName, element: n });
        }
      }
    });
    if (trees.length !== 1) {
      return;
    }
    const layer = trees[0];
    layer.element.children.forEach((child) => {
      if (is6(child, "element")) {
        if (child.attributes["inkscape:label"] === "Content") {
          layers.push({ name: layer.name, element: child });
        }
      }
    });
  });
  return layers;
};
var handleFloorLayers = (ast, dir) => {
  const layers = saveFloorLayers(ast, allLayerNames);
  handleFloorNames(layers, dir);
  handleFloorAddresses(layers, dir);
  handleFloors(layers, dir);
  handleFloorRenderers(layers, dir);
};

// src/lib/inkscape/markers.ts
import * as Doc6 from "@effect/printer/Doc";
import { pipe as pipe4 } from "effect";
import * as fs9 from "fs";
import { is as is7 } from "unist-util-is";
import { visitParents as visitParents6 } from "unist-util-visit-parents";
import { toXml as toXml3 } from "xast-util-to-xml";
var saveMarkers = (ast) => {
  const markers = [];
  const colors = /* @__PURE__ */ new Set();
  visitParents6(ast, (n) => {
    if (is7(n, "element") && n.name === "path") {
      const start = n.attributes["marker-start"];
      const end = n.attributes["marker-end"];
      const stroke = n.attributes["stroke"];
      if (typeof stroke === "string") {
        colors.add(stroke);
        const s = stroke.replace(/#/, "");
        if (typeof start === "string") {
          n.attributes["marker-start"] = `url(\\#Triangle-${s})`;
        }
        if (typeof end === "string") {
          n.attributes["marker-end"] = `url(\\#Triangle-${s})`;
        }
      }
    }
  });
  visitParents6(ast, (n) => {
    if (is7(n, "element") && n.name === "marker") {
      markers.push(n);
      const id = n.attributes["id"];
      for (const color of colors) {
        const s = color.replace(/#/, "");
        const m = structuredClone(n);
        m.attributes["id"] = `${id}-${s}`;
        visitParents6(m, (mm) => {
          if (is7(mm, "element") && mm.name === "path") {
            mm.attributes["fill"] = `${color}`;
          }
        });
        markers.push(m);
      }
    }
  });
  return markers;
};
var renderMarkersTsx = (markers) => {
  const jsx = pipe4(
    markers,
    (elems) => elems.map(fixupElements),
    (elems) =>
      toXml3(elems, {
        allowDangerousXml: true,
        closeEmptyElements: true,
      }),
  );
  const doc = Doc6.vsep([
    Doc6.text(`export const markers = () => {`),
    Doc6.text(`  return <>`),
    Doc6.text(jsx),
    Doc6.text(`  </>`),
    Doc6.text(`}`),
  ]);
  return Doc6.render(doc, { style: "pretty" });
};
var handleMarkers = (ast, dir) => {
  const markers = saveMarkers(ast);
  const text7 = renderMarkersTsx(markers);
  fs9.writeFileSync(`${dir}/markers.tsx`, text7, "utf8");
};

// src/lib/inkscape/viewbox.ts
import * as fs10 from "fs";
import { is as is8 } from "unist-util-is";
import { visitParents as visitParents7 } from "unist-util-visit-parents";
var ParseError = class {
  _tag = "ParseError";
};
var parseViewBox = (s) => {
  const xs = s.split(/ +/).map((x2) => parseFloat(x2));
  if (xs.length !== 4) {
    return null;
  }
  for (const x2 of xs) {
    if (isNaN(x2)) {
      return null;
    }
  }
  return {
    x: xs[0],
    y: xs[1],
    width: xs[2],
    height: xs[3],
  };
};
var saveViewBox = (ast) => {
  const foundViewBoxes = [];
  visitParents7(ast, (n, parents) => {
    if (
      parents.length === 1 &&
      is8(parents[0], "root") &&
      is8(n, "element") &&
      n.name === "svg"
    ) {
      const viewBox = n.attributes["viewBox"];
      if (viewBox) {
        const found = parseViewBox(viewBox);
        if (found !== null) {
          foundViewBoxes.push(found);
        }
      }
    }
  });
  return foundViewBoxes;
};
var renderViewBox = (viewBox) => {
  return JSON.stringify(viewBox, null, 2);
};
var handleViewBox = (ast, dir) => {
  const foundViewBoxes = saveViewBox(ast);
  if (foundViewBoxes.length !== 1) {
    throw new ParseError();
  }
  fs10.writeFileSync(
    `${dir}/viewBox.json`,
    renderViewBox(foundViewBoxes[0]),
    "utf8",
  );
};

// src/map-extract-floors.ts
import * as fs11 from "fs";
import { resolve } from "path";
import { fromXml } from "xast-util-from-xml";
var handleInkscapeSvg = (ast, dir) => {
  saveAllFloorLayerNames(ast);
  saveAllAssets(ast);
  saveAllAddressesAndPoints(ast);
  handleViewBox(ast, dir);
  handleAddrresses(ast, dir);
  handleResolvedAddrresses(ast, dir);
  handleAssets(ast, dir);
  handleMarkers(ast, dir);
  handleFacilities(ast, dir);
  handleFloorLayers(ast, dir);
};
var main = async (args) => {
  if (args.length < 1) {
    throw new Error();
  }
  const infile = resolve(args[0]);
  const outdir = resolve(args.length === 2 ? args[1] : ".");
  const bb = generateBoundingBoxCSV(infile, outdir);
  parseBoundingBoxCSV(bb);
  const svg = await fs11.readFileSync(infile);
  const ast = fromXml(svg);
  handleInkscapeSvg(ast, outdir);
};
main(process.argv.slice(2));
//# sourceMappingURL=map-extract-floors.js.map

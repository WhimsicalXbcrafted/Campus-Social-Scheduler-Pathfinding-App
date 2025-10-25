
import {
  Location, Region, centroid
} from "./locations";


/** Organizes locations into quadrants in s tree structure */
export type LocationTree =
  | {readonly kind: "empty"}
  | {readonly kind: "single", readonly loc: Location}
  | {readonly kind: "split", readonly at: Location,
      readonly nw: LocationTree, readonly ne: LocationTree,
      readonly sw: LocationTree, readonly se: LocationTree};

/**
 * Returns a tree containing exactly the given locations. Some effort is made to
 * try to split the locations evenly so that the resulting tree has low height.
 *
 * @param locs to put in the tree
 * @returns LocationTree produced by taking the centroid of all points, m,
 *    which divides the locations into 4 quadrants: nw, nw, sw, sw based on
 *    where they fall in space relative to m, and then splitting up all
 *    quadrants until every leaf of the tree contains a single location
 *    ** If a point falls on the border lines created by the centroid,
 *      it will belong to the region to the right/bottom of the centroid
 */
export const buildTree = (locs: Array<Location>): LocationTree => {
  if (locs.length === 0) {
    return {kind: "empty"};
  } else if (locs.length === 1) {
    return {kind: "single", loc: locs[0]};
  } else {
    // We must be careful to include each point in *exactly* one subtree. The
    // Regions created below touch on the boundary, so we exclude them from the
    // lower side of each boundary.
    const c: Location = centroid(locs);
    return {kind: "split", at: c,
        // excludes bottom & right boundaries
        nw: buildTree(listLocationsInQuadrant(locs,
            {x1: -Infinity, x2: c.x, y1: -Infinity, y2: c.y})),
        // excludes bottom boundary
        ne: buildTree(listLocationsInQuadrant(locs,
            {x1: c.x, x2: Infinity, y1: -Infinity, y2: c.y})),
        // excludes right boundary
        sw: buildTree(listLocationsInQuadrant(locs,
            {x1: -Infinity, x2: c.x, y1: c.y, y2: Infinity})),
        se: buildTree(listLocationsInQuadrant(locs,
            {x1: c.x, x2: Infinity, y1: c.y, y2: Infinity})),
      };
  }
}

/**
 * Returns the subset of the given locations inside the given quadrant.
 * @returns a list of all locations, l, in locs such that
 *  region.x1 <= l.x < region.x2 and region.y1 <= l.y < region.y2
 */
const listLocationsInQuadrant =
    (locs: Array<Location>, region: Region): Array<Location> => {
  const inLocs: Array<Location> = [];

  // Inv: inLocs = locationsInQuadrant(locs[0 .. i-1], region)
  for (const loc of locs) {
    if (region.x1 <= loc.x && loc.x < region.x2 &&
      region.y1 <= loc.y && loc.y < region.y2)
      inLocs.push(loc);
  }

  return inLocs;
};


/** Bounds that include the entire plane. */
const EVERYWHERE: Region = {x1: -Infinity, x2: Infinity, y1: -Infinity, y2: Infinity};

/**
 * Returns closest of any locations in the tree to any of the given location.
 * @param tree A tree containing locations to compare to
 * @param loc The location to which to compare them
 * @returns the closest point in the tree to that location, paired with its
 *     distance to the closest location in locs
 */
export const findClosestInTree =
    (tree: LocationTree, locs: Array<Location>): [Location, number] => {
  if (locs.length === 0)
    throw new Error('no locations passed in');
  if (tree.kind === "empty")
    throw new Error('no locations in the tree passed in');

  let closest = NO_INFO;
  for (const loc of locs) {
    const cl = closestInTree(tree, loc, EVERYWHERE, NO_INFO);
    if (cl.dist < closest.dist)
      closest = cl;
  }
  if (closest.loc === undefined)
    throw new Error('impossible: no closest found');
  return [closest.loc, closest.dist];
};

/**
 * A record containing the closest point found in the tree to reference point
 * (or undefined if the tree is empty), the distance of that point to the
 * reference point (or infinity if the tree is empty)
 */
type ClosestInfo = {loc: Location | undefined, dist: number};

/** A record that stores no closest point and no calculations performed. */
export const NO_INFO: ClosestInfo = {loc: undefined, dist: Infinity};

/**
 * Helper function to findClosestInTree, exported for testing only
 *
 * Returns the closest point of all locations in the tree and the given closest
 * point to the given loc, as well as the distance from that point to the loc
 */
export const closestInTree =
    (tree: LocationTree, loc: Location, bounds: Region, closest: ClosestInfo): ClosestInfo => {
  // TODO: implement in Task 4
  if (distToRegion(loc, bounds) >= closest.dist) {
    return closest;
  }

  if (tree.kind === "empty") {
    return closest;
  } else if (tree.kind === "single") {
    const d = dist(loc, tree.loc);
    if (d < closest.dist) {
      return {loc: tree.loc, dist: d};
    } else {
      return closest;
    }
  } else if (tree.kind === "split") {
    const at = tree.at;

    const nwBound = {x1: -Infinity, x2: at.x, y1: -Infinity, y2: at.y};
    const neBound = {x1: at.x, x2: Infinity, y1: -Infinity, y2: at.y};
    const swBound = {x1: -Infinity, x2: at.x, y1: at.y, y2: Infinity};
    const seBound = {x1: at.x, x2: Infinity, y1: at.y, y2: Infinity};

    const regions: [Region, LocationTree][] = [
      [nwBound, tree.nw],
      [neBound, tree.ne],
      [swBound, tree.sw],
      [seBound, tree.se],
    ];

    regions.sort((a, b) => distToRegion(loc, a[0]) - distToRegion(loc, b[0]));

    for (const [region, subtree] of regions) {
      closest = closestInTree(subtree, loc, region, closest);
    }

    return closest;
  }

  return closest;
};

// Returns shortest Euclidean distance from a point to a region
// If the point is inside the region, the distance will be 0
const distToRegion = (loc: Location, region: Region): number => {
  let dx = 0;
  if (loc.x < region.x1) {
    dx = region.x1 - loc.x;
  } else if (loc.x > region.x2) {
    dx = loc.x - region.x2;
  }

  let dy = 0;
  if (loc.y < region.y1) {
    dy = region.y1 - loc.y;
  } else if (loc.y > region.y2) {
    dy = loc.y - region.y2;
  }

  return Math.sqrt(dx * dx + dy * dy);
}

const dist = (a: Location, b: Location): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

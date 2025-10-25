import * as assert from 'assert';
import {
    centroid, distance, distanceMoreThan, sameLocation, squaredDistance
  } from './locations';


describe('locations', function() {

  it('sameLocations', function() {
    assert.strictEqual(sameLocation({x: 0, y: 0}, {x: 0, y: 0}), true);
    assert.strictEqual(sameLocation({x: 0, y: 1}, {x: 0, y: 1}), true);
    assert.strictEqual(sameLocation({x: 1, y: 0}, {x: 1, y: 0}), true);
    assert.strictEqual(sameLocation({x: 1, y: 1}, {x: 1, y: 1}), true);

    assert.strictEqual(sameLocation({x: 0, y: 0}, {x: 0, y: 1}), false);
    assert.strictEqual(sameLocation({x: 0, y: 0}, {x: 1, y: 0}), false);
    assert.strictEqual(sameLocation({x: 0, y: 0}, {x: 1, y: 1}), false);

    assert.strictEqual(sameLocation({x: 0, y: 1}, {x: 0, y: 0}), false);
    assert.strictEqual(sameLocation({x: 0, y: 1}, {x: 1, y: 0}), false);
    assert.strictEqual(sameLocation({x: 0, y: 1}, {x: 1, y: 1}), false);

    assert.strictEqual(sameLocation({x: 1, y: 0}, {x: 0, y: 0}), false);
    assert.strictEqual(sameLocation({x: 1, y: 0}, {x: 0, y: 1}), false);
    assert.strictEqual(sameLocation({x: 1, y: 0}, {x: 1, y: 1}), false);

    assert.strictEqual(sameLocation({x: 1, y: 1}, {x: 0, y: 0}), false);
    assert.strictEqual(sameLocation({x: 1, y: 1}, {x: 0, y: 1}), false);
    assert.strictEqual(sameLocation({x: 1, y: 1}, {x: 1, y: 0}), false);
  });

  it('squaredDistance', function() {
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 1, y: 1}), 2);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 0, y: 1}), 1);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 1, y: 0}), 1);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 2, y: 0}), 4);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 0, y: 2}), 4);
    assert.strictEqual(squaredDistance({x: 0, y: 0}, {x: 2, y: 2}), 8);
  });

  it('distance', function() {
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 1, y: 1}) - Math.sqrt(2)) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 0, y: 1}) - 1) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 1, y: 0}) - 1) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 2, y: 0}) - 2) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 0, y: 2}) - 2) < 1e-3);
    assert.ok(Math.abs(distance({x: 0, y: 0}, {x: 2, y: 2}) - Math.sqrt(8)) < 1e-3);
  });

  it('centroid', function() {
    assert.deepStrictEqual(centroid([{x: 0, y: 1}]), {x: 0, y: 1});
    assert.deepStrictEqual(centroid([{x: 1, y: 2}]), {x: 1, y: 2});

    assert.deepStrictEqual(centroid([{x: 0, y: 0}, {x: 1, y: 2}]), {x: 0.5, y: 1});
    assert.deepStrictEqual(centroid([{x: 0, y: 0}, {x: 1, y: 2}]), {x: 0.5, y: 1});
    assert.deepStrictEqual(centroid([{x: 0, y: 1}, {x: 1, y: 2}]), {x: 0.5, y: 1.5});
    assert.deepStrictEqual(
        centroid([{x: 0, y: 1}, {x: 1, y: 2}, {x: 2, y: 3}]), {x: 1, y: 2});
  });

  it('distanceMoreThan', function() {
    // TODO: write these in task 3
    // Location inside region
    const region1 = {x1: 0, x2: 10, y1: 0, y2: 10};
    assert.deepStrictEqual(distanceMoreThan({x: 5, y:5}, region1, 0), false);
    assert.deepStrictEqual(distanceMoreThan({x: 5, y:5}, region1, 100), false);

    // Location directly left of the region
    const region2 = {x1: 10, x2: 20, y1: 10, y2: 20};
    const loc1 = {x: 5, y: 15};
    assert.deepStrictEqual(distanceMoreThan(loc1, region2, 4), true);
    assert.deepStrictEqual(distanceMoreThan(loc1, region2, 5), false);
    assert.deepStrictEqual(distanceMoreThan(loc1, region2, 6), false);

    // Location directly above the region
    const loc2 = {x: 15, y: 25};
    assert.deepStrictEqual(distanceMoreThan(loc2, region2, 4), true);
    assert.deepStrictEqual(distanceMoreThan(loc2, region2, 5), false);
    assert.deepStrictEqual(distanceMoreThan(loc2, region2, 6), false);

    // Location diagonal top-left
    const loc3 = {x: 5, y: 25};
    assert.deepStrictEqual(distanceMoreThan(loc3, region2, Math.sqrt(49)), true);
    assert.deepStrictEqual(distanceMoreThan(loc3, region2, Math.sqrt(50)), false);
    assert.deepStrictEqual(distanceMoreThan(loc3, region2, Math.sqrt(51)), false);

    // Location diagonal bottom-right
    const loc4 = {x: 15, y: -5};
    assert.deepStrictEqual(distanceMoreThan(loc4, region1, Math.sqrt(49)), true);
    assert.deepStrictEqual(distanceMoreThan(loc4, region1, Math.sqrt(50)), false);
    assert.deepStrictEqual(distanceMoreThan(loc4, region1, Math.sqrt(51)), false);

    // On edge
    const loc5 = {x: 0, y: 5};
    assert.deepStrictEqual(distanceMoreThan(loc5, region1, 0), false);
    assert.deepStrictEqual(distanceMoreThan(loc5, region1, 0.1), false);
  });

});

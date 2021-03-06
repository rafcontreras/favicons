const favicons = require("../src");
const test = require("ava");
const fs = require("fs");

const { snapshotManager } = require("ava/lib/concordance-options");
const { factory } = require("concordance-comparator");
const Fiber = require("fibers");

const { logo_png, logo_svg } = require("./util");
const { Image } = require("./Image");

snapshotManager.plugins.push(factory(Image, v => new Image(v[0], v[1])));

test("should accept an array of either buffers or paths to source images", async t => {
  t.plan(1);

  // eslint-disable-next-line no-sync
  const result = await favicons([logo_png, fs.readFileSync(logo_svg)]);

  for (const image of result.images) {
    // '.ico' is not supported by resemble
    if (image.name.endsWith(".ico")) delete image.contents;
    else image.contents = new Image(image.name, image.contents);
  }

  await new Promise(resolve =>
    Fiber(() => {
      t.snapshot(result);
      resolve();
    }).run()
  );
});

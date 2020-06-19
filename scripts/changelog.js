#!/usr/bin/env node
const conventionalChangelog = require('conventional-changelog');
const spec = require('conventional-changelog-config-spec');
const gitSemverTags = require('git-semver-tags');
const { promisify } = require('util');
const semverTags = promisify(gitSemverTags);

function compact(obj) {
  const res = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      res[key] = obj[key];
    }
  });

  return res;
}

const preset = {
  name: require.resolve('conventional-changelog-conventionalcommits'),
  types: spec.properties.types.default.map((x) => {
    if (x.type === 'fix') {
      return { ...x, section: 'Fixes' };
    }

    if (x.type === 'feat') {
      return x;
    }

    return { ...x, section: 'Other' };
  }),
};

async function generate({ version, from, to, showHeader } = {}) {
  let content = '';

  return new Promise((resolve, reject) => {
    const changelogStream = conventionalChangelog(
      {
        preset,
        tagPrefix: '',
      },
      { version },
      compact({ merges: null, path: './', from, to }),
    ).on('error', function (err) {
      return reject(err);
    });

    changelogStream.on('data', function (buffer) {
      content += buffer.toString();
    });

    changelogStream.on('end', function () {
      let lines = content.split('\n');
      if (showHeader) {
        lines[0] = `## Release Notes for ${lines[0].substr(3).trim()}`;
      } else {
        lines = lines.slice(3); // strip header and 2 blank lines
      }

      lines = lines.map((x) => {
        return x.startsWith('#') ? x.substr(1) : x;
      });

      content = lines.join('\n');
      return resolve(content);
    });
  });
}

async function main() {
  const [version, from] = await semverTags();

  generate({ version, from }).then((x) => {
    // eslint-disable-next-line no-console
    console.log(x);
  });
}

main();

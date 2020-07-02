import gist from './gist';
import url from './url';

function updateTitle(text) {
  const title = document.title.split(':')[0];

  if (!text || text.length === 0) {
    document.title = title;
    return;
  }

  const suffix = text.replace(/\s+/g, ' ').substring(0, 1000).trim();
  document.title = title + ': ' + suffix;
}

function load() {
  console.log('try load from gist, url, or hash');
  if (location.pathname.startsWith('/gist/')) {
    const [, id, version] = location.pathname.slice(1).split('/');
    console.log('load from gist', { id, version });
    return {
      gistId: id,
      gistVersion: version,
    };
  }

  const search = location.search.replace('?', '&');
  if (search.includes('&markup=') && search.includes('&query=')) {
    console.log('should load from query params');
    return;
  }

  if (location.hash.includes('&')) {
    console.log('load from hash');
    return;
  }
}

const state = {
  url,
  gist,
  load,
  updateTitle,
};

export default state;

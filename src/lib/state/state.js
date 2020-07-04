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
  const search = location.search.replace('?', '&');
  if (search.includes('&markup=') && search.includes('&query=')) {
    return;
  }

  if (location.hash.includes('&')) {
    return;
  }
}

const state = {
  url,
  load,
  updateTitle,
};

export default state;

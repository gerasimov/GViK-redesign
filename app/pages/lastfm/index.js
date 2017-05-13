const query = {};
location.search.slice(1).split('&').forEach(function(value) {
  const pair = value.split('=');
  query[pair[0]] = pair[1];
});

if (query.token) {

}

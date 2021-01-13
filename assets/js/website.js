function navbar(page) {
  let ul = '';
  const pages = ['overview', 'statistics'];
  for (const x of pages) {
    const active = x === page ? ' active' : '';
    const sr = x === page ? ' <span class="sr-only">(current)</span>' : '';
    const li = '<li class="nav-item' + active + '"><a class="nav-link" href="./' + x + '.html">' + x.charAt(0).toUpperCase() + x.slice(1) + sr + '</a></li>';
    ul += li;
  }
  return(ul);
}

$(document).ready(function() {
  $(".navbar-nav").html(navbar(page));
});

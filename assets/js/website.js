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

function navigation(page) {
  let nav = '<nav class="navbar navbar-expand-lg navbar-dark bg-dark rounded"><h1 class="navbar-brand"><a href="./overview.html"><img src="../assets/images/logo.png" width="30" height="30" alt="" loading="lazy" /> RaspberryPi Monitor</a></h1><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navigation"><ul class="navbar-nav">' + navbar(page) + '</ul></div></nav><div id="settings" class="mt-1 text-right"><a href="#settings"><img src="../assets/images/settings.png" alt="" /></a></div>';
  return(nav);
}

$(document).ready(function() {
  $("#content").prepend(navigation(page));
});

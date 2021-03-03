const VERSION = 0.01;

const os = require('os');
const fs = require('fs');
const execSync = require('child_process').execSync;

module.exports.piModules = [];

fs.readdirSync(process.env.PWD + "/assets/js/modules/" + page + "/").forEach(file => {
  let moduleJS = document.createElement("script");
  moduleJS.setAttribute("src", "../assets/js/modules/" + page + "/" + file);
  document.body.appendChild(moduleJS);
});

for(const jsFile of ['settings', page]) {
  let jsScript = document.createElement("script");
  jsScript.setAttribute("src", "../assets/js/" + jsFile + ".js");
  document.body.appendChild(jsScript);
}

const ls = window.localStorage;
const ss = window.sessionStorage;
const historyCount = 60;

function graphStorage(key) {
  let storage = ss.getItem(key) ? ss.getItem(key) : '';
  let data = [], i = 0;
  for (const x of storage.split(',')) {
    if (!x) continue;
    data.push([i, x]);
    i += 1;
  }
  return(data);
}
  
function processStorage(key, value) {
  let storage = ss.getItem(key) ? ss.getItem(key) : '';
  storage = !Array.isArray(storage) ? storage.split(',') : storage;
  storage.push(value);
  if (storage.length >= historyCount)
    storage.shift();
  ss.setItem(key, storage);
}

function progress(s, n, l, c, u, a, t, p) {
  const code = c !== null ? '<strong class="tiny">' + l + ':</strong> <code>' + c + '</code>' : '';
  return('<div id="' + s + '_' + n + '">' + code + '<label id="' + n + '_label" class="tiny"><strong>Used:</strong> ' + u + 'GiB <strong>Available:</strong> ' + a + 'GiB of ' + t + 'GiB</label><div class="progress mb-3" style="height:20px;"><div id="' + n + '_gauge" class="progress-bar progress-bar-striped" role="progressbar" style="width: ' + p + '%;" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100">' + p + '%</div></div></div>');
}

function li(l, v, c = false) {
  const label = l !== null ? '<strong>' + l + ':</strong> ' : ''
  const value = c ? '<code>' + v + '</code>' : v;
  return('<li class="list-group-item">' + label +  value + '</li>');
}

let settings = {overview: {}, statistics: {}};

function checkVersion() {
  const version = ls.getItem('pi_version') ? ls.getItem('pi_version') : VERSION;
  if (VERSION !== version) {
    // perform version update ?
    return(true);
  }
  return(false);
}

function navbar(page) {
  let ul = '';
  for (const x of Object.keys(settings)) {
    const active = x === page ? ' active' : '';
    const sr = x === page ? ' <span class="sr-only">(current)</span>' : '';
    const li = '<li class="nav-item' + active + '"><a class="nav-link" href="./' + x + '.html">' + x.charAt(0).toUpperCase() + x.slice(1) + sr + '</a></li>';
    ul += li;
  }
  return(ul);
}

function navigation(page) {
  let nav = '<nav class="navbar navbar-expand-lg navbar-dark bg-dark rounded"><h1 class="navbar-brand"><a href="./overview.html"><img src="../assets/images/logo.png" width="30" height="30" alt="" loading="lazy" /> RaspberryPi Monitor</a></h1><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navigation"><ul class="navbar-nav">' + navbar(page) + '</ul></div></nav><div id="settings" class="mt-1 text-right"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#settings-modal"><img src="../assets/images/settings.png" alt="Settings" /></button></div>';
  return(nav);
}

$(document).ready(function() {
  const upgrade = checkVersion();
  $("#content").prepend(navigation(page));
});

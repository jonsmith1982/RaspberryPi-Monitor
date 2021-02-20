function updateSettings(piSettings = null) {
  if (piSettings !== null) {
    ls.setItem('pi_settings', JSON.stringify(piSettings));
    return(piSettings);
  }
  piSettings = ls.getItem('pi_settings') ? JSON.parse(ls.getItem('pi_settings')) : settings;
  return(piSettings);
}

settings = updateSettings();

let jsClasses = {};
let modulesSort = [];
if (page === 'overview') {
  module.exports.piModules.forEach(jsModule => {
    const moduleName = jsModule.name.toLowerCase();
    if (moduleName in settings.overview) {
      if (settings.overview[moduleName].status) {
        jsClasses[moduleName] = new jsModule(settings.overview[moduleName].timeout);
      }
    } else {
      jsClasses[moduleName] = new jsModule();
      settings.overview[moduleName] = jsClasses[moduleName].settings;
    }
    modulesSort.push([moduleName, jsClasses[moduleName].settings.row]);
  });
  modulesSort.sort((a, b) => a[1] - b[1]);
}

function settingsModal(page) {
  let li = [];
  for (const x of Object.keys(settings[page])) {
    const checked = settings[page][x].status ? ' checked="checked"' : '';
    li.push('<li class="list-group-item"><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="settings_' + x + '"' + checked + '><label class="custom-control-label" for="settings_' + x + '">' + settings[page][x].label + '</label></div></li>');
  }
  const modal = '<div class="modal fade" id="settings-modal" tabindex="-1" aria-labelledby="settings-modal-label" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="settings-modal-label">Settings</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><ul class="list-group">' + li.join('') + '</ul></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="save-settings">Save changes</button></div></div></div></div>';
  return(modal);
}

$(document).ready(function() {
  $('body').append(settingsModal(page));
  $("#save-settings").on('click', function(e) {
    for (const x of Object.keys(settings[page])) {
      settings[page][x].status = $("#settings_" + x + ":checked").length ? true : false;
    }
    settings = updateSettings(settings);
    //$("#settings-modal").modal('hide');
    location.reload();
  });
});

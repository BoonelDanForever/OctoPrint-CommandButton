$(function() {
    function CommandButtonViewModel(parameters) {
        var self = this;

self.r = "";

        // Get the settingsViewModel (which should be the first parameter)
        self.settingsViewModel = parameters[0]; // Settings view model

        self.command_definitions = ko.observableArray([]);

        // Function to update the command definitions
        self.updateCommands = function() {
console.log(self.settingsViewModel.settings);
console.log(self.command_definitions());
            if (self.settingsViewModel.settings && self.settingsViewModel.settings.plugins.commandbutton) {
                // Assuming the settings contain a list of command definitions as an array of objects
                self.command_definitions(self.settingsViewModel.settings.plugins.commandbutton.command_definitions());
            } else {
                self.timeoutUpdate();
            }
        };

        // Timeout update to keep refreshing if settings are not available
        self.timeoutUpdate = function() {
            setTimeout(function() {
                self.updateCommands();
            }, 100);
        };

        // Add a new command definition
        self.addCommandDefinition = function() {
            self.command_definitions.push({
                name: '',
                enabled: true,
                command: '',
                on_startup: false
            });
        };

        // Remove a command definition
        self.removeCommandDefinition = function(command) {
            self.command_definitions.remove(command);
        };

self.runCommand = function(command) {
            console.log("Running command:", command); // For debugging

            // Send the command to the backend using an AJAX request

$.ajax({
                url: API_BASEURL + "plugin/commandbutton",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    command: command
                }),
                contentType: "application/json; charset=UTF-8",
                success: function (r) {
console.log("success");
		    console.log(r);
self.r = r.result;
self.updatePopupOptions();
self.popup = new PNotify(self.popupOptions);
}
            });
        };


        PNotify.prototype.options.confirm.buttons = [];
self.updatePopupOptions = function() {

self.popupOptions = {
            title: gettext('Command Button'),
            text: self.r,
            type: 'info',
            icon: true,
            hide: false,
            confirm: {
                confirm: true,
                buttons: [{
                    text: 'Close',
                    addClass: 'btn-block btn-danger',
                    promptTrigger: true,
                    click: function(notice, value){
                        notice.remove();
                        notice.get().trigger("pnotify.cancel", [notice, value]);
                    }
                }]
            },
            buttons: {
                closer: true,
                sticker: false,
            },
            history: {
                history: false
            }
        };
}

self.updatePopupOptions();







        // Initial call to update commands
        self.timeoutUpdate();
    }

    // Register the view model with the correct parameters (settingsViewModel)
    OCTOPRINT_VIEWMODELS.push([
        CommandButtonViewModel,               // Your custom view model
        ["settingsViewModel"],                // Pass the settings view model as a parameter
        document.getElementById("sidebar_plugin_commandbutton") // The div where the buttons will appear
    ]);
});

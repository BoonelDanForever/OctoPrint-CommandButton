$(function () {
    function CommandButtonSettingsViewModel(parameters) {
        var self = this;

console.log("HEHEHAHHAH");

        // Get the settingsViewModel (first parameter)
        self.settingsViewModel = parameters[0]; // Settings view model
        self.command_definitions = ko.observableArray([]);

        // Update command definitions from settings
        self.updateCommands = function () {
            if (self.settingsViewModel.settings && self.settingsViewModel.settings.plugins.commandbutton) {
        self.command_definitions(self.settingsViewModel.settings.plugins.commandbutton.command_definitions());
console.log("here");
                console.log(self.command_definitions());
            } else {
                self.timeoutUpdate();
            }
        };

        // Timeout update to wait for settings to load
        self.timeoutUpdate = function () {
            setTimeout(function () {
                self.updateCommands();
            }, 100);
        };

        // Add a new command definition
        self.addCommandDefinition = function () {
            self.command_definitions.push({
                name: ko.observable(''),
        	toggle: ko.observable(false),
        	command: ko.observable(''),
        	command_press: ko.observable(''),
        	command_unpress: ko.observable(''),
        	on_startup: ko.observable(false),
        	enabled: ko.observable(true),
            });
        };


        // Remove a command definition
        self.removeCommandDefinition = function (command) {
            self.command_definitions.remove(command);
        };

        // Check if toggle is enabled for a button
        self.isToggleEnabled = function (command) {
            return command.toggle;
        };

//todo delay to run toggle command maybe?????
// Validation function
        self.validateCommands = function () {
            let isValid = true;
            let errorMessage = '';
	    let nameList = [];

            // Check each command definition
            self.command_definitions().forEach((command, index) => {
                if (command.name().length == 0) {
		    command.enabled(false);
                    isValid = false;
                    errorMessage += `Command ${index + 1} must have a valid name. (${command.command()})\n`;
                } else {
		    if (nameList.includes(command.name())) {
			command.enabled(false);
			isValid = false;
			errorMessage += `Can not have multiple commands named ${command.name()}!\n`;
		    } else {
			nameList.push(command.name());
		    }
		}
            });

            if (!isValid) {
                alert(errorMessage); // Show the error message to the user
            }

            return true; //isValid;
        };

        // Hook into OctoPrint's save settings process
        self.settingsViewModel.onSettingsBeforeSave = function () {
            if (!self.validateCommands()) {
                // Prevent settings from being saved if validation fails
                return false;
            }

            // Update the settings with the current command definitions
            self.settingsViewModel.settings.plugins.commandbutton.command_definitions(self.command_definitions());
            return true; // Allow saving if validation passes
        };
















        // Initial update of commands
        self.timeoutUpdate();
    }

    // Register the view model with the correct parameters (settingsViewModel)
    OCTOPRINT_VIEWMODELS.push([
        CommandButtonSettingsViewModel,               // Your custom view model
        ["settingsViewModel"],                // Pass the settings view model as a parameter
        document.getElementById("settings_plugin_commandbutton") // The div where the settings will be displayed
    ]);
});

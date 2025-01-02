$(function() {
    function CommandButtonViewModel(parameters) {
        var self = this;

        // Ensure parameters is passed correctly
        if (!parameters || parameters.length === 0) {
            console.error("Error: Parameters not passed to CommandButtonViewModel.");
            return;
        }

        // Get the settingsViewModel (which should be the first parameter)
        self.settingsViewModel = parameters[0]; // Settings view model
        if (!self.settingsViewModel) {
            console.error("Error: Settings view model is not available.");
            return;
        }

	console.log(self.settingsViewModel);
	console.log(self.settingsViewModel.commands);


        // Access commands from the settings: settingsViewModel.settings.plugins.commandbutton.commands
        self.commands = ko.observableArray(self.settingsViewModel.commands || []); // Fallback to an empty array if no commands are defined

        // Run the command (when a button is clicked)
        self.runCommand = function() {
	    d = 'a';
            console.log("Running command:", d); // For debugging
	    console.log(d);

            // Send the command to the backend using an AJAX request
/*
            $.ajax({
                url: API_BASEURL + "plugin/commandbutton", // Adjust your plugin's endpoint
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    command: "hi"
                }),
                contentType: "application/json; charset=UTF-8",
                success: function(response) {
                    console.log("Command sent successfully:", response);
                },
                error: function(xhr, status, error) {
                    console.error("Error sending command:", error);
                }
            });
*/
$.ajax({
                url: API_BASEURL + "plugin/commandbutton",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    command: "send_command_button"
                }),
                contentType: "application/json; charset=UTF-8",
                success: function (data, status) {}
            });
        };

        // Handle settings binding (before settings are fully bound to the view)
        self.onSettingsBeforeBinding = function() {
            if (self.settingsViewModel.settings.commands) {
                self.commands(self.settingsViewModel.commands);
            }
        };

        // Update settings after binding to the view
        self.onSettingsAfterBinding = function() {
            self.settingsViewModel.commands(self.commands());
        };

        self.onBeforeSave = function() {
            console.log("onBeforeSave: Updating the command buttons list.");
    
            // Update the settings object
            self.settingsViewModel.commands(self.commands());

    	    // Add any additional changes you might need to make
	};
    }

    // Register the view model with the correct parameters (settingsViewModel)
    OCTOPRINT_VIEWMODELS.push([
        CommandButtonViewModel,               // Your custom view model
        ["settingsViewModel"],                // Pass the settings view model as a parameter
        document.getElementById("sidebar_plugin_commandbutton") // The div where the buttons will appear
    ]);
});

$(function() {
    function CommandButtonViewModel(parameters) {
        var self = this;

        if (!parameters || parameters.length === 0) {
            console.error("Error: Parameters not passed to CommandButtonViewModel.");
            return;
        }

        console.log("hello. check again. Stuff: ");
        console.log(parameters);

        self.settings = parameters[0];  // Access settings here

        // Ensure that self.settings is properly instantiated
        if (!self.settings || !self.settings.commands) {
            console.error("Settings or commands are not properly defined.");
            return;
        }

        

        // Store the current commands from the plugin settings
        self.commands = ko.observableArray(self.settings.commands());  // Assuming commands are stored in the plugin settings

        // When a button is clicked, send the corresponding command to the backend
        self.runCommand = function(command) {
            console.log("Running command:", command);  // For debugging

            // Send the command to the backend using an AJAX call
            $.ajax({
                url: API_BASEURL + "plugin/commandbutton",
                type: "POST",
                dataType: "json",
                data: JSON.stringify({
                    command: command
                }),
                contentType: "application/json; charset=UTF-8",
                success: function(response) {
                    console.log("Command sent successfully:", response);
                },
                error: function(xhr, status, error) {
                    console.log("Error sending command:", error);
                }
            });
        };

        // Handle changes in the settings and update the commands
        self.onSettingsBeforeBinding = function() {
            self.commands(self.settings.commands());  // Load commands from settings
        };

        self.onSettingsAfterBinding = function() {
            self.settings.commands(self.commands());  // Save commands back to settings
        };
    }

    // Apply the view model for the settings page
    OCTOPRINT_VIEWMODELS.push([
        CommandButtonViewModel,
        ["loginStateViewModel"],
        document.getElementById("sidebar_plugin_commandbutton")  // The div where the buttons will be displayed
    ]);
});


/*
function CommandButtonViewModel(parameters) {
    var self = this;
    
    console.log("Hello." + parameters);

    // Make sure the settings object is available
    self.commands = ko.observableArray(settings.plugins.commandbutton.commands());  // Observing commands array

    // Function to run the command when a button is clicked
    self.runCommand = function(command) {
        console.log("Running command:", command);  // Log the command to the console (for debugging)
        
        // Here you can add your logic to handle the command. For example:
        // This could be an API call to the backend or another action that you define
        self.sendCommandToBackend(command);  // You can define this function to send a request to the backend
    };

    // You can also define a function to send the command to the backend
    self.sendCommandToBackend = function(command) {
        // Example of how you might interact with the backend
        console.log("Sending command to backend:", command);

        // You can use a function like `OctoPrint` API to send the command to the backend
        $.ajax({
            url: "some_backend_endpoint",
            method: "POST",
            data: JSON.stringify({ command: command }),
            contentType: "application/json",
            success: function(response) {
                console.log("Backend response:", response);
            },
            error: function(xhr, status, error) {
                console.log("Error sending command to backend:", error);
            }
        });
    };

    // Other methods for handling settings, etc.
    self.onSettingsBeforeBinding = function() {
        self.commands(self.settings.commands());  // Make sure the commands are loaded
    };

    self.onSettingsAfterBinding = function() {
        self.settings.commands(self.commands());  // Ensure updated commands are saved
    };
}

// Apply Knockout.js bindings to the settings page
$(function() {
    var model = new CommandButtonViewModel();
    ko.applyBindings(model, $('#command_button_settings')[0]);  // Bind the model to the HTML element
});




function CommandButtonViewModel(parameters) {
    var self = this;
    self.commands = ko.observableArray([]);

    // This method is called when settings are loaded
    self.onSettingsBeforeBinding = function () {
        self.commands(self.settings.commands());
    };

    // This method is called after the settings are saved
    self.onSettingsAfterBinding = function () {
        self.settings.commands(self.commands());
    };
}

// Apply the bindings
$(function() {
    var model = new CommandButtonViewModel();
    ko.applyBindings(model, $('#command_button_settings')[0]);
});


$(function() {
    // Dynamically add click listeners for all command buttons
    $('.send-command-button').click(function() {
        var command = $(this).data('command');
        
        $.ajax({
            url: API_BASEURL + "plugin/command_button",
            type: "POST",
            dataType: "json",
            data: {command: command},
            success: function(data) {
                alert("Command output:\n" + data.result);
            },
            error: function(xhr, status, error) {
                alert("Error sending command.");
            }
        });
    });
});
*/

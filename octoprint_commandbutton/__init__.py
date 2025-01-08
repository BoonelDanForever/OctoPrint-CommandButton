from __future__ import absolute_import, division, print_function, unicode_literals

import octoprint.plugin

class CommandButtonPlugin(octoprint.plugin.TemplatePlugin, octoprint.plugin.AssetPlugin, octoprint.plugin.SimpleApiPlugin, octoprint.plugin.EventHandlerPlugin, octoprint.plugin.SettingsPlugin, octoprint.plugin.StartupPlugin):


#todo make it look good. python is kinda good cause in order to run it has to look at least somewhat good lol java NOPE


    def __init__(self):
        self.command_definitions = []  # List to hold command definitions
        self.toggle_data = {} #False = has not been clicked; True = has been clicked;

    def initialize(self):
        # Initialize command definitions from the settings
        self.command_definitions = self._settings.get(["command_definitions"]) or []
        for c in self.command_definitions:
            if c["toggle"]:
                self.toggle_data[c["name"]] = False
        self._logger.info(f"Command definitions loaded: {self.command_definitions}")
        print(self.toggle_data)

    def get_settings_defaults(self):
        return {
            "command_definitions": [
                {
                    "name": "",
                    "toggle": False,
                    "command": "",
                    "command_press": "",
                    "command_unpress": "",
                    "on_startup": False,
                    "enabled": True,
                }
            ]
        }


    def get_plugin_data(self):
        # Return the current settings (command definitions)
        return {"command_definitions": self.command_definitions}

    def get_assets(self):
        return dict(js=["js/command_button.js", "js/command_button_settings.js"])

    def on_after_startup(self):
        self._logger.info("OctoPrint CommandButton Plugin started")
        for c in self.command_definitions:
            if c["on_startup"]:
                print(self.send_command(c["name"]))

    def get_template_configs(self):
        # Add the template for rendering the buttons
        return [
            dict(type="sidebar", name="Send Commands", template="command_button.jinja2", custom_bindings=True),
            dict(type="settings", name="Command Settings", template="command_button_settings.jinja2", custom_bindings=True)
        ]

    def send_command(self, name):
        # Placeholder for command execution (will implement actual logic later)
        print("PRESSED")
        print(self.toggle_data)
        command = ""
        for c in self.command_definitions:
            if c["name"] == name:
                type = "command"
                if name in self.toggle_data and self.toggle_data[name]:
                    type= "command_unpress"
                command = c[type]
                print("command: " + command)
                break
        if command == "":
            return "Command: " + name + " is blank!"

        try:
            # Simulating command execution, this should be replaced with actual logic (e.g., sarge.run())
            print("ran: " + command)
            if name in self.toggle_data:
                self.toggle_data[name] = not self.toggle_data[name]
            return f"Command '{name}' executed"
        except Exception as e:
            self._logger.error(f"Error running command '{command}': {e}")
            return str(e)

    #wont auto delete lol
    def get_api_commands(self):
        list = {}
        for c in self.command_definitions:
            print(c["name"])
            list[c["name"]] = ""

        print(list)
        return list

    def on_api_command(self, command, args):
        # Handle API requests, specifically for sending commands
        print("called")
        self._logger.info("yep")
        print(args)
        print(command)
        result = self.send_command(command)
        return dict(result=result)

    def get_update_information(self):
        # Plugin update information
        return dict(
            command_button=dict(
                displayName="OctoPrint CommandButton",
                displayVersion=self._plugin_version,
                type="github",
                user="your-username",  # Replace with your GitHub username
                repo="OctoPrint-CommandButton",  # Replace with your GitHub repo
                current=self._plugin_version,
                pip="https://github.com/your-username/OctoPrint-CommandButton/archive/{target}.zip"
            )
        )

    def get_settings_version(self):
        return 1

    def on_settings_save(self, data):
        octoprint.plugin.SettingsPlugin.on_settings_save(self, data)

        # Save the command definitions when settings are saved
        self.command_definitions = data.get("command_definitions", [])
        self._settings.set(["command_definitions"], self.command_definitions)

        self._logger.info("Settings saved: %s", self.command_definitions)

    def add_command_definition(self, definition):
        self.command_definitions.append(definition)
        self._settings.set(["command_definitions"], self.command_definitions)
        self._logger.info("Command definition added: %s", definition)

    def remove_command_definition(self, definition):
        if definition in self.command_definitions:
            self.command_definitions.remove(definition)
            self._settings.set(["command_definitions"], self.command_definitions)
            self._logger.info("Command definition removed: %s", definition)

__plugin_name__ = "OctoPrint CommandButton"
__plugin_pythoncompat__ = ">=3,<4"
__plugin_implementation__ = CommandButtonPlugin()

print("HIIII")

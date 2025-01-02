import octoprint.plugin
#import sarge

class CommandButtonPlugin(octoprint.plugin.OctoPrintPlugin):
    
    def get_settings_defaults(self):
        # Default settings for commands (empty list at first)
        return {
            "commands": []
        }

    def on_after_startup(self):
        self._logger.info("OctoPrint CommandButton Plugin started")
    
    def get_template_configs(self):
        # Add the template for rendering the buttons
        return [
            dict(type="navbar", name="Send Commands", template="command_button.jinja2")
        ]
    
    def send_command(self, command):
        # Execute the system command
        try:
            return "idk"
            #result = sarge.run(command, async_=False)
            #return result.stdout
        except Exception as e:
            self._logger.error(f"Error running command '{command}': {e}")
            return str(e)

    def on_api_command(self, command, args):
        if command == 'send_command_button':
            if 'command' in args:
                result = self.send_command(args['command'])
                return dict(result=result)
        return super().on_api_command(command, args)
    
    def get_update_iformation(self):
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
        # Save the commands list when settings are saved
        self._settings.set(["commands"], data["commands"])
        super().on_settings_save(data)

__plugin_name__ = "OctoPrint CommandButton"
__plugin_implementation__ = CommandButtonPlugin()

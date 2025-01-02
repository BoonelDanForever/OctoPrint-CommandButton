# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me)
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started,
# defining your plugin as a template plugin, settings and asset plugin. Feel free to add or remove mixins
# as necessary.
#
# Take a look at the documentation on what other plugin mixins are available.

import octoprint.plugin

class CommandButtonPlugin(octoprint.plugin.SettingsPlugin,
    octoprint.plugin.AssetPlugin,
    octoprint.plugin.TemplatePlugin
):
    def ge_update_information(self):
        return dict(
            commandbutton=dict(
	        displayName="CommandButton Plugin",
	        displayVersion=self._plugin_version,

	        # version check: github repository
	        type="github_release",
	        user="OctoPrint",
	        repo="OctoPrint-AutomaticShutdown",
	        current=self._plugin_version,

	        # update method: pip w/ dependency links
	        pip="https://github.com/OctoPrint/OctoPrint-AutomaticShutdown/archive/{target_version}.zip"
            )
        )

    def get_settings_defaults(self):
        return {
            "command": "help"
        }

    def on_after_startup(self):
        self._logger.info("Send Help Command Plugin started")
    
    def get_template_configs(self):
        return [
            dict(type="control", name="Send Help Command", template="send_help_command.jinja2")
        ]
    
    def send_help_command(self):
        try:
            # Using sarge to run 'help' command
            result = sarge.run('help', async_=False)
            return result.stdout
        except Exception as e:
            self._logger.error(f"Error running help command: {e}")
            return str(e)

    def on_api_command(self, command, args):
        if command == 'send_help_command':
            result = self.send_help_command()
            return dict(result=result)
        return super().on_api_command(command, args)



# If you want your plugin to be registered within OctoPrint under a different name than what you defined in setup.py
# ("OctoPrint-PluginSkeleton"), you may define that here. Same goes for the other metadata derived from setup.py that
# can be overwritten via __plugin_xyz__ control properties. See the documentation for that.
__plugin_name__ = "CommandButton Plugin"


# Set the Python version your plugin is compatible with below. Recommended is Python 3 only for all new plugins.
# OctoPrint 1.4.0 - 1.7.x run under both Python 3 and the end-of-life Python 2.
# OctoPrint 1.8.0 onwards only supports Python 3.
__plugin_pythoncompat__ = ">=3,<4"  # Only Python 3

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = CommandButtonPlugin()

    #global __plugin_hooks__
    #__plugin_hooks__ = {
        #"octoprint.plugin.softwareupdate.check_config": #__plugin_implementation__.get_update_information
    #}

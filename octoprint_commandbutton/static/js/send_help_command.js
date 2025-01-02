$(function() {
    function sendHelpCommand() {
        $.ajax({
            url: API_BASEURL + "plugin/send_help_command",
            type: "POST",
            dataType: "json",
            success: function(data) {
                alert("Help command output:\n" + data.result);
            },
            error: function(xhr, status, error) {
                alert("Error sending help command.");
            }
        });
    }

    $('#send-help-command-button').click(function() {
        sendHelpCommand();
    });
});
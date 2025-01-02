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

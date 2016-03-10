<script src="https://{ondemand}.atlassian.net/wiki/atlassian-connect/all.js" data-options="base:true;hideFooter:true;"></script>
<script>
    
$(document).ready(function() {
    
    $("body").removeClass("module-macro-results");
    $("body").css("background", "white");
    $("body").find(".playsql-background").removeClass("playsql-background");

    AP.getUser(function(user) {
        AP.require("messages", function(messages) {
            messages.hint('Hello ' + user.fullName + ' - Welcome to Agility at Tatts!',  'Click on the yellow X that describes you best.',  { fadeout: true, delay: 5000, duration: 1000 });
        });
    });
});   

</script>

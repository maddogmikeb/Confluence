<script src="https://{ondemand}.atlassian.net/wiki/atlassian-connect/all.js" data-options="hideFooter:true;base:true"></script>
<style>
    .icon {
        height:100px; 
        width:75px; 
        cursor: pointer; 
        margin-left: 20px;        
    }
    
    #icons {
        height: 100px; 
        width: 100%;
        text-align: right;    
    }
</style>

<script type="text/x-template" id="iconTemplate" title="iconTemplate" data-url="https://{ondemand}.atlassian.net/wiki/download/attachments/31556009/{label}.png">
    <img src="{url}" class="icon" onclick="javascript:window.top.location='/wiki/label/{spaceKey}/{label}';" />
</script>

<div id="icons"></div>
<div id="progressBar" class="aui-progress-indicator">
    <span class="aui-progress-indicator-value"></span>
</div>

<script>

var url = "/rest/api/content?expand=space,metadata.labels";

var getQueryParams = function(qs) {
        qs = qs.substring(qs.indexOf("?")).split("+").join(" ");
        var params = {}, tokens,re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) { params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]); }
        return params;
    };
     
$(document).ready(function() {

    AJS.progressBars.update("#progressBar", 0.2);

    $("body").removeClass("module-macro-results");
    $("body").css("background", "white");
    $("body").find(".playsql-background").removeClass("playsql-background");

    AP.require("_util", function(util) {
    
        AJS.progressBars.update("#progressBar", 0.4);

        var api = "";
        if (document.referrer.indexOf("pageId=")>0) {
            api = "/rest/api/content/" + getQueryParams(document.referrer)["pageId"] + "?expand=space,metadata.labels";
        }
        else {
            var segments = util.decodeQueryComponent(AP.container().baseURI).split("/");
            var spaceKey = segments[segments.length - 2];
            var space = "spaceKey=" + spaceKey; 
            var pageTitle = segments[segments.length - 1];
            var title = "title=" + pageTitle; 
            api = url + "&" + space + "&" + title;
        }
        
        AJS.progressBars.update("#progressBar", 0.6);
        
        AP.require('request', function(request) {
            request({
                url: api,
                success: function(responseText) {
                    var data = $.parseJSON(responseText);
                    if (data.results && data.results.length > 0) {
                        data = data.results[0];
                    }
                    ShowIconsForLabels(data.space.key, data.metadata.labels.results);
                    AJS.progressBars.update("#progressBar", 1.0);
                }           
            });
        });
    });
});   

function ShowIconsForLabels(spaceKey, labels)
{
    if (labels.length == 0)
    {
        $("#icons").hide();
        return;
    }
    
    $(labels).each(function(i, label) {
        //if (label.name.match("^aat_"))
        {
            var url = AJS.template($("#iconTemplate").data("url")).fill(
                { 
                    label : label.name 
                }).toString();
            
            var icon = AJS.template.load("iconTemplate").fillHtml(
                { 
                    label: label.name,
                    spaceKey: spaceKey,
                    url: url
                }).toString();

            $(new Image()).load(function () { $("#icons").append(icon); }).attr('src', url);
        }
    });
}

</script>

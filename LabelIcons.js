<script src="https://{ondemand}.atlassian.net/wiki/atlassian-connect/all.js" data-options="hideFooter:true;base:true"></script>
<style>
    @media all {
        .main {
            height: 65px;
            overflow: hidden;
            padding-bottom: 4px;
            width: 100%;
            
            /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#033a5b+0,033a5b+0,00a0dc+33,ffffff+75 */
            background: #033a5b; /* Old browsers */
            background: -moz-linear-gradient(left,  #033a5b 0%, #033a5b 0%, #00a0dc 33%, #ffffff 75%); /* FF3.6-15 */
            background: -webkit-linear-gradient(left,  #033a5b 0%,#033a5b 0%,#00a0dc 33%,#ffffff 75%); /* Chrome10-25,Safari5.1-6 */
            background: linear-gradient(to right,  #033a5b 0%,#033a5b 0%,#00a0dc 33%,#ffffff 75%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#033a5b', endColorstr='#ffffff',GradientType=1 ); /* IE6-9 */
        }
        
        #spacer {
            height: 11px;
            background-color: white;
            width: 100%;
            position: absolute;
            z-index: 100000;
            top: 65px;
        }
        
        #title {
            margin: 10px;
            font-size: xx-large;
            /*width: 50%;*/
            float: left;
            color: white;
        }
        
        #progressBar {
            position: absolute;
            top: 60px;
            height: 5px;
            padding-bottom: 5px;
            z-index: 1;
        }
        
        .icon {
            z-index: 0;
            width: 50%;
        }
        
        .icon a:hover, a:visited, a:link, a:active {
            text-decoration: none;
        }
        
            .icon > img {
                height: 58px; 
                cursor: pointer; 
                margin-left: 5px;
                margin-right: 1px;
                padding-top: 1px;
            }
        
        #icons { 
            width: 100%;
            text-align: right;    
        }
    }
</style>

<script type="text/x-template" id="iconTemplate" title="iconTemplate" data-search-label="aat_icon">
    <a href="/wiki/label/{spaceKey}/{label}" onclick="javascript:window.top.location='/wiki/label/{spaceKey}/{label}'; return true;" class="icon">
        <img src="{url}" alt="{label}" id="{id}" />
    </a>
</script>

<div class="main">
    <div id="title">
        
    </div>
    <div id="icons"></div>
    <div id="progressBar" class="aui-progress-indicator">
        <span class="aui-progress-indicator-value"></span>
    </div>
    <div id="spacer"></div>
</div>

<script>

var defaultTitle = "Agility At Tatts";
var loaded = false;

var getQueryParams = function (qs) {
        qs = qs.substring(qs.indexOf("?")).split("+").join(" ");
        var params = {}, tokens,re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) { params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]); }
        return params;
    };
     
//$(document).ready(function() {
AJS.toInit(function(){
    
    AJS.progressBars.update("#progressBar", 0.2);

    $("body").removeClass("module-macro-results");
    $("body").css("background", "white");
    $("body").find(".playsql-background").removeClass("playsql-background");

    AP.require("_util", function(util) {
    
        AJS.progressBars.update("#progressBar", 0.33);
    
        var api = GetAPIUrl(util);
        
        AJS.progressBars.update("#progressBar", 0.66);
        
        setTimeout(function() { 
            if (!loaded) {
                $("#title").html(defaultTitle); 
            }
        }, 5000);
    
        GetPageDataFromAPI(api, 
        function(data) {
            loaded = true;
            $("#title").html(data.title);
            ShowIconsForLabels(data.space.key, data.metadata.labels.results);
            AJS.progressBars.update("#progressBar", 1.0);
        }, 
        function (error) {
            if (window.console) console.log(error);
            loaded = true;
            AJS.progressBars.update("#progressBar", 0.0);
            $("#title").html(defaultTitle);
        });
    });
});   

function GetAPIUrl(util) {
    var url = "/rest/api/content?expand=space,metadata.labels,space.homepage";
    var api = "";
    
    if (document.referrer.indexOf("key=")>0) {
        var space1 = "spaceKey=" + getQueryParams(document.referrer)["key"]; 
        api = url + "&" + space1; // + "&" + title;
    }
    else if (document.referrer.indexOf("pageId=")>0) {
        api = "/rest/api/content/" + getQueryParams(document.referrer)["pageId"] + "?expand=space,metadata.labels,space.homepage";
    }
    else {
        var segments = (util.decodeQueryComponent(document.referrer).split("?")[0]).split("/");
        var spaceKey = segments[segments.length - 2];
        var pageTitle = segments[segments.length - 1];
        
        if (spaceKey == "display") {
            api = url + "&spaceKey=" + pageTitle;
        } else {
            var space = "spaceKey=" + spaceKey; 
            var title = "title=" + pageTitle; 
            api = url + "&" + space + "&" + title;
        }
    }
    
    return api;
}

function GetPageDataFromAPI(api, callback, errorCb) {
     AP.require('request', function(request) {
        request({
            url: api,
            success: function(responseText) {
                var data = $.parseJSON(responseText);
                if (data.results) {
                    if (data.results.length == 1) {
                        data = data.results[0];
                    } else if (data.results.length > 1) {
                        var hp = data.results[0].space.homepage.id;
                        var id = data.results[0].id;
                        if (data.results[0].space.homepage.id != data.results[0].id) {
                            var newapi = "/rest/api/content/" + data.results[0].space.homepage.id + "?expand=space,metadata.labels,space.homepage";
                            GetPageDataFromAPI(newapi, callback, errorCb);
                            return;
                        }
                    }
                }
                callback(data);
            }, 
            error : function(error, xhr) {
                errorCb(error);
            }
        });
    });
}

function ShowIconsForLabels(spaceKey, labels)
{
    if (labels.length == 0)
    {
        $("#icons").hide();
        return;
    }
    
    var searchLabel = $("#iconTemplate").data("search-label");
    
    if (searchLabel == "") {
        return;
    }
    
    var url = "/rest/prototype/1/search/site.json?spaceKey=" + spaceKey + "&type=attachment&label=global:" + searchLabel;

    AP.require('request', function(request) {
        request({
            url: url,
            success: function(responseText) {
                var data = $.parseJSON(responseText);
                if (!data || !data.result || data.result.length == 0) {
                    return;
                }
                
                var attachments = data.result;
                if (!attachments || attachments.length == 0) {
                    return;
                }

                $(labels).each(function(i, label) {
                    
                    var attachment = $.grep(attachments, function(e) { return e.fileName.toLowerCase().startsWith(label.name.toLowerCase() + ".") && e.niceType.toLowerCase() == "image"; });
                    if (!attachment || attachment == 0) {
                        return;
                    }
                    attachment = attachment[0]; // get the top one 
                    
                    var url = $.grep(attachment.link, function(e) { return e.rel == "download"; });
                    if (!url || url.length == 0){
                        return;
                    }
                    url = url[0]; // get the top one
                    
                    var comment = label.name;
                    var link = undefined;
                    if (attachment.comment && attachment.comment.length > 0) {
                        try {
                            var commentJson = $.parseJSON(attachment.comment.trim().replace(/\'/g, "\""));
                            comment = commentJson.comment;
                            link = commentJson.link;
                        } catch (e) {
                            comment = attachment.comment;
                        }
                    }
                    
                    var $icon = $(AJS.template.load("iconTemplate")
                        .fillHtml({ 
                            label: label.name,
                            spaceKey: spaceKey,
                            url: url.href, 
                            id: attachment.id
                        }).toString())
                        .tooltip({
                            title: function () { return comment; },
                            gravity: 'e'
                        });
                        
                    if (link) {
                        $icon.closest('a').attr('href', link).attr("onclick", "javascript:window.top.location='" + link + "'; return true;");
                    }
        
                    $("#icons").append($icon);
                });
            }, 
            error : function(error, xhr) {
                if (window.console) console.log(error);
            }
        });
    });
}

</script>

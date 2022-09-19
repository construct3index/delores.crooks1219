window.idAsyncInit = function() {
    // use an id.net event to wait until after init
    ID.Event.subscribe('id.init', function() {
        // use jquery to call methods on click
        ID.getLoginStatus(idCallback)
        ID.Protection.isBlacklisted(function(blacklisted) {
            if (blacklisted == true) {
                isBlacklisted = 1;
            } else {
                isBlacklisted = 0;
            }
            console.log('[BLACKLIST] : ' + isBlacklisted);
        });
        ID.Protection.isSponsor(function(sponsor) {
            isSponsor = sponsor;
            if (sponsor == true) {
                isSponsor = 1;
            } else {
                isSponsor = 0;
            }
            console.log('[SPONSOR] : ' + isSponsor);
        });
        ID.ads.init(1) //change 1 to the correct item_id
    });
    // using an optional callback to capture data on the client
    var userName;
    var idCallback = function(response) {
        if (response) {
            console.log(response);
            if (response.status === 'ok') {
                userName = response.authResponse.details.nickname;
                sUserName = userName;
                isLogin = 1;
            }
        }
    }
    ID.init({
        //Add your app Id here
        appId: "62ce647a87f0fc71687651fd"
    });
};

// load the idnet js interface
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = document.location.protocol == 'https:' ? "https://m.igroutka.ru/1/html/sdk.js" : "http://cdn.id.net/api/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'id-jssdk'));

function initY8(appId_) {
    console.log("appId_ " + appId_)
    ID.init({
        appId: appId_
    });
}

//y8 variables
var isLogin = 0;
var sUserName = 'Guest';
var URLlocation;
var isBlacklisted = 0
var isSponsor = 0;
var onlineSavesData;


const scriptsInEvents = {

    async Y8api_Event18_Act1(runtime, localVars) {
        ID.init({
            appId: localVars.ID
        });
    },

    async Y8api_Event1_Act1(runtime, localVars) {
        ID.login(function(response) {
            console.log("response " + response)
            if (response.status === 'ok') {
                sUserName = response.authResponse.details.nickname;
                isLogin = 1;
            }
        });
    },

    async Y8api_Event2_Act1(runtime, localVars) {
        ID.GameAPI.Leaderboards.list({
            table: 'Leaderboard'
        })
    },

    async Y8api_Event3_Act1(runtime, localVars) {
        ID.GameAPI.Leaderboards.save({
            'table': 'Leaderboard',
            'points': localVars.score_
        }, function(data) {
            console.log(data);
        });
    },

    async Y8api_Event4_Act1(runtime, localVars) {
        ID.GameAPI.Achievements.list();
    },

    async Y8api_Event5_Act1(runtime, localVars) {
        var achievementData = {
            achievement: localVars.name_,
            achievementkey: localVars.key_
        };
        ID.GameAPI.Achievements.save(achievementData, function(response) {
            console.log("achievement saved", response);
        });
    },

    async Y8api_Event6_Act1(runtime, localVars) {
        ID.api('user_data/submit', 'POST', {
            key: localVars.saveKey_,
            value: localVars.saveItem_
        }, function(response) {
            console.log(response);
        });
    },

    async Y8api_Event7_Act1(runtime, localVars) {
        ID.api('user_data/retrieve', 'POST', {
            key: localVars.loadkey_
        }, function(response) {
            try {
                if (response) {
                    onlineSavesData = response.jsondata;
                    runtime.globalVars["isDataLoaded"] = 1;
                    console.log(response);
                }
            } catch (e) {
                console.log('error loading');
                runtime.globalVars["isDataLoaded"] = -1;
            }
        });
    },

    async Y8api_Event8_Act1(runtime, localVars) {
        console.log("Get Online Save Data")
        runtime.setReturnValue(onlineSavesData);
    },

    async Y8api_Event9_Act1(runtime, localVars) {
        runtime.globalVars["SponsoredSite"] = isSponsor;
    },

    async Y8api_Event10_Act1(runtime, localVars) {
        runtime.globalVars["blacklistSite"] = isBlacklisted;
    },

    async Y8api_Event11_Act1(runtime, localVars) {
        runtime.globalVars["userNameY8"] = sUserName;
        runtime.globalVars["isLogin"] = isLogin;
    },

    async Y8api_Event12_Act1(runtime, localVars) {
        try {
            runtime.globalVars["isPausedGameY8"] = 1
            ID.ads.display(function() {
                console.log("resume Game")
                runtime.globalVars["isPausedGameY8"] = 0
            })
        } catch (e) {
            console.log(e + ' Error Showing Ads')
            runtime.globalVars["isPausedGameY8"] = 0
        }
    },

    async Y8api_Event13_Act1(runtime, localVars) {
        ID.openProfile();
    },

    async Y8api_Event14_Act1(runtime, localVars) {
        var blobUrl = localVars.image_;
        console.log("blobUrl " + blobUrl);

        var xhr = new XMLHttpRequest;
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var recoveredBlob = xhr.response;
            var reader = new FileReader;
            reader.readAsDataURL(recoveredBlob);
            reader.onloadend = function() {
                var base64data = reader.result;
                console.log("base64data " + base64data);
                sentImageToProfile(base64data)
            }
        };

        xhr.open('GET', blobUrl);
        xhr.send();

        function sentImageToProfile(_image) {
            ID.submit_image(_image, function(response) {
                console.log("screenshot submitted", response);
            });
        }

    }

};

self.C3.ScriptsInEvents = scriptsInEvents;
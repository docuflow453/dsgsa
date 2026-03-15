

$(document).ready(function () {
    var ads = [];
    $('.advert-box__link').each(function (index, item) {
        var ad = new Object();
        var advertBox = $(item).parent();
        ad.AdvertId = advertBox.data('adid');
        ad.ContentPageId = advertBox.data('pageid');
        ads.push(ad);

        $(item).click(function () {
            event.preventDefault();

            sendClickEventOccurrence(ad.AdvertId, ad.ContentPageId);

            var redirectionUrl = $(this).attr('href');
            var target = $(this).attr('target');

            if (target) {
                window.open(redirectionUrl, target);
            } else {
                window.location = redirectionUrl;
            }
        });

    });

    if (ads.length > 0) {
        sendImpressionEventOccurence(ads);
    }
});

function sendClickEventOccurrence(adId, pageId) {
    return;
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "/umbraco/api/advertstracking/clicktrack", true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(JSON.stringify({ AdvertId: adId, ContentPageId: pageId }));
}

function sendImpressionEventOccurence(ads) {
    return;
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "/umbraco/api/advertstracking/impressiontrack", true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(JSON.stringify(ads));
}
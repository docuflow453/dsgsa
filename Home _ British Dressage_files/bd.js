var globals = {};

function openVideo(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var target = $(evt.currentTarget);
    var body = $('body');
    var item = target.closest('[data-video]');
    var wrapperDiv = item.parent();
    var wrapperDivPos = wrapperDiv.offset();
    //console.log(wrapperDivPos);
    var videoCode = item.data('video');
    var yURL = 'https://www.youtube.com/embed/'+videoCode+'?si=73vSQ892Cqa2C_ji&disablekb=1&autoplay=1&rel=0';
    var wrapperDivSize = {width: wrapperDiv.outerWidth(), height: wrapperDiv.outerHeight()};
    var bg = $('<div class="bg"></div>');
    body.prepend(bg);
    var videoWrapper = $('<div class="videoWrapper"><div class="videoInner"></div></div>');
    videoWrapper.css({
        'height':''+wrapperDivSize.height+'px',
        'top':''+wrapperDivPos.top+'px',
    });
    bg.after(videoWrapper);
    var videoInner = videoWrapper.find('.videoInner');
    videoInner.append('<iframe src="'+yURL+'" type="text/html" frameborder="0" allowfullscreen style="width:100%; height:100%;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>');
    $(document).on('keyup',checkClosePlayer);
    $('.js-carousel').slick('slickPause');
}
function closeVideo() {
    $('body>.bg,body>.videoWrapper').remove();
    $(document).off('keyup',checkClosePlayer);
    $('.js-carousel').slick('slickPlay');
}
function checkClosePlayer(evt) {
    if(evt.keyCode === 27) {
        closeVideo();
    }

}
function recordAdImpressions() {
    $('.advert-box').each(function() {
        var ad = $(this);
        if (gtag) {
            console.log('record ad view',ad.data());
            gtag('event','ad_view',{'title':ad.data('title'),'pos':ad.data('pos'),'id':ad.data('adid'),'placement':ad.data('placement'),'page':window.location.pathname});
            gtag('event', 'ad_impression', {
                ad_id: ad.data('adid'),        
                ad_name: ad.data('title'),      
                ad_position: ad.data('pos')    
              });
        }        
    });
}
function recordAdClick(evt) {
	evt.preventDefault();
	var target = $(evt.currentTarget);
	var parentBox = target.closest('.advert-box');
	var img = target.find('img');
	var adId = parentBox.data('adid');
	var adName = parentBox.data('title');
	var adLink = target.attr('href');
	var adPosition = parentBox.data('pos');
	console.log('record ad click',adId,adName,adLink,adPosition);
	gtag('event', 'ad_click', {
		ad_id: adId,  
		ad_name: adName,  
		ad_position: adPosition,
		ad_link: adLink
	});
	window.open(adLink, '_blank');
}

$(window).ready(function() {
    $(document).on('click','.youtube:not(.youtube-direct) .button',openVideo);
    $(document).on('click','body>.bg,body>.videoWrapper>a',closeVideo);
    recordAdImpressions();
    $(document).on('click','.advert-box a',recordAdClick);
});
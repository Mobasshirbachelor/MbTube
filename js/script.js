// Searchbar Handler
$(function() {
    var searchField = $('#query');
    var icon = $('.search-btn');

    // Focus Event Handler
    $(searchField).on('focus', function() {
        $(this).animate({
            width: '100%'
        }, 400);
        $(icon).animate({
            right: '10px'
        }, 400);
    });

    // Blur Event Handler
    $(searchField).on('blur', function() {
        if (searchField.val() == '') {
            $(searchField).animate({
                width: '45%'
            }, 400, function() {});
            $(icon).animate({
                right: '360px'
            }, 400, function() {});
        }
    });
    $('.search-form').submit(function(e) {
        e.preventDefault();
    });
});

function search() {
    // Clear Results
    $('.results').html('');
    $('.buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            type: 'video',
            key: "AIzaSyABL1YlnQVG40A_kSSe66Qhe6dBSCKSsAg"
        },
        function(data) {
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item) {
                // Get Output
                var output = getOutput(item);

                // Display Results
                $('.results').append(output);
            });
            var buttons = getButtons(prevPageToken, nextPageToken);

            // Display Results
            $('.buttons').append(buttons);
        }
    );
}

//Next page function
function nextPage() {
    var token = $('#next-button').data('token');

    // Clear Results
    $('.results').html('');
    $('.buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: "AIzaSyABL1YlnQVG40A_kSSe66Qhe6dBSCKSsAg"
        },
        function(data) {
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item) {
                // Get Output
                var output = getOutput(item);

                // Display Results
                $('.results').append(output);
            });
            var buttons = getButtons(prevPageToken, nextPageToken);

            // Display Results
            $('.buttons').append(buttons);
        }
    );
}

//Previous page function
function prevPage() {
    var token = $('#prev-button').data('token');

    // Clear Results
    $('.results').html('');
    $('.buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: "AIzaSyABL1YlnQVG40A_kSSe66Qhe6dBSCKSsAg"
        },
        function(data) {
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item) {
                // Get Output
                var output = getOutput(item);

                // Display Results
                $('.results').append(output);
            });
            var buttons = getButtons(prevPageToken, nextPageToken);

            // Display Results
            $('.buttons').append(buttons);
        }
    );
}

// Build Output
function getOutput(item) {
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;

    // Build Output String
    var output = '<li>' + '<div class="list-left">' + '<img src="' + thumb + '">' +
        '</div>' + '<div class="list-right">' + '<h3><a style="color:white; text-size: 30px;" class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/' + videoId + '">' + title + '</a></h3>' +
        '<small>By <span class="cTitle">' + channelTitle + '</span> on ' + videoDate + '</small>' +
        '<p style="color:White; text-size:20px;">' + description + '</p>' + '</div>' + '</li>' + '<div class="clearfix"></div>' + '';

    return output;
}

//Build the buttons
function getButtons(prevPageToken, nextPageToken) {
    if (!prevPageToken) {
        var btnOutput = '<div class="button-container">' + '<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
            'onclick="nextPage();">Next Page</button></div>';
    } else {
        var btnOutput = '<div class="button-container">' +
            '<button id="prev-button" class="paging-button" data-token="' + prevPageToken + '" data-query="' + q + '"' +
            'onclick="prevPage();">Previous Page</button>' +
            '<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
            'onclick="nextPage();">Next Page</button></div>';
    }
    return btnOutput;
}
const revealer = (actionBtn, revealBlock, config) => {
    const actionBtnEl = actionBtn;
    const revealBlockEl = revealBlock;
    const { onRevealEnd, initilalPosition } = config;
    const initialRedius = 10;

    let isMenuOpen = false;
    let reqId = null;
    let targetRadius = initialRedius;
    let elementRadius = targetRadius;

    const initRevealBlock = () => {
        revealBlock.style.clipPath = 'circle(var(--radius) at calc(100% - 50px) 45px)';
        revealBlockEl.style.setProperty('--radius', `${initialRedius}px`);
        revealBlockEl.setAttribute('data-active', true);
    };

    const getTargetRadius = inMenuOpen => {
        return inMenuOpen ? getMinimumRadius() : initialRedius;
    };

    const getMinimumRadius = () => {
        const { innerHeight, innerWidth } = window;

        return Math.sqrt(innerHeight ** 2 + innerWidth ** 2);
    }

    const animationStart = () => {
        elementRadius += (targetRadius - elementRadius) * 0.08;
        revealBlockEl.style.setProperty('--radius', `${elementRadius}px`);

        reqId = requestAnimationFrame(animationStart);

        // some bug with smal black point
        const isStopAnimation = isMenuOpen ? elementRadius > targetRadius : Math.round(elementRadius) === Math.round(targetRadius);
        if (isStopAnimation) {
            onRevealEnd();
            animationStop();
        }
    };

    const animationStop = () => {
        cancelAnimationFrame(reqId);
        reqId = null;
    };

    const onReveal = () => {
        isMenuOpen = !isMenuOpen;
        actionBtnEl.setAttribute('data-open', isMenuOpen);
        targetRadius = getTargetRadius(isMenuOpen);
        animationStart();
    };

    initRevealBlock();
    actionBtnEl.addEventListener('click', onReveal);
}

document.addEventListener('DOMContentLoaded', () => {
    const actionBtn = document.querySelector('.nav-btn-js');
    const revealBlock = document.querySelector('.nav-js');
    const config = {
        onRevealEnd() {
            console.log('end');
        },
    };

    revealer(actionBtn, revealBlock, config);
});

// search box

function searchToggle(obj, evt) {
    var container = $(obj).closest('.search-wrapper');
    if (!container.hasClass('active')) {
        container.addClass('active');
        evt.preventDefault();
    } else if (container.hasClass('active') && $(obj).closest('.input-holder').length == 0) {
        container.removeClass('active');
        // clear input
        container.find('.search-input').val('');
    }
}

// search box end
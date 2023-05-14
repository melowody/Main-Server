function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

$(document).ready(function() {
    particlesJS.load('particle-wrapper', 'json/particles.json', function() {
        console.log('callback - particles.js config loaded');
    });

    let stylesheet = "css/" + (getCookie("dark-mode") ? "dark" : "light") + "/index.css";
    $("head #mode").attr("href", stylesheet);
});

function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function switchTheme() {
    let toCookie = getCookie("dark-mode") == "on" ? "off" : "on";
    console.log(toCookie);
    setCookie("dark-mode", toCookie);
    setSheet();
}

function setSheet() {
    let on = getCookie("dark-mode") == "on";
    let stylesheet = "css/" + (on ? "dark" : "light") + "/index.css";
    $("head #mode").attr("href", stylesheet);

    let path = on ?
        `<g transform=scale(1.5,1.5)><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" /></g>`
         : `<path d="M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z" />`;
    $("#theme-switch svg").html(path);
}

async function animAbout() {
    let currTitleHeight = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--title-size-large"))*4/3*.8;
    let FPS = 10;
    var timeStep = 0;

    let anim2 = () => {
        let titleAnimLen = 500;
        timeStep = 0;
        $("#about-bg").css({"display": 'inline'});
        $("#title").css("height", "0px");

        let anim = setInterval(() => {
            timeStep += FPS;
            if (timeStep > titleAnimLen) {
                clearInterval(anim);
                window.location.href = "./about.html";
            }
            let animStep = (-Math.cos(timeStep / titleAnimLen * Math.PI) + 1)/2;
            console.log(`${2/3 * animStep}vh`);
            $("#about-bg").css({"height": `${200/3 * animStep}vh`, "margin-bottom": `${20 * animStep}px`});
        }, FPS);
    }

    let anim = setInterval(() => {
        let titleAnimLen = 300;
        timeStep += FPS;
        if (timeStep > titleAnimLen) {
            clearInterval(anim);
            setTimeout(anim2, 500);
        }
        let animStep = (-Math.cos(timeStep / titleAnimLen * Math.PI) + 1)/2;
        $("#title").css("height", currTitleHeight * (1-animStep) + "px");
      }, FPS);
    
}

async function animProjects() {

}

const underscoreLengths = {
    "about.html": 10.5,
    "projects.html": 15.2
}

const underscoreLefts = {
    "about.html": 15,
    "projects.html": 29.7
}

const animFuncs = {
    "about.html": animAbout,
    "projects.html": animProjects
}

const currLeft = 0;
const currLength = 10.5;

async function runAnim(to) {
    let from = $("#underline");
    let animLenSec = 250;
    var timeStep = 0;
  	let toLength = underscoreLengths[`${to.attr("href")}`];
  	let toLeft = underscoreLefts[`${to.attr("href")}`];

  	let anim = setInterval(function () {
        timeStep += 10;
        if (timeStep > animLenSec) {
            clearInterval(anim);
            animFuncs[to.attr("href")]();
        }
        let animStep = (-Math.cos(timeStep / animLenSec * Math.PI) + 1)/2;
        from.css({"margin-left": (currLeft * (1-animStep) + toLeft * animStep) + "%", "width": (currLength * (1-animStep) + toLength * animStep) + "%"})
    }, 10);
}

$(document).ready(function() {
    particlesJS.load('particle-wrapper', 'json/particles.json', function() {
        console.log('callback - particles.js config loaded');
    });

    setSheet();

    $(".page").on('click', function() {
        runAnim($(this));
    });
});
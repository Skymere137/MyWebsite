setInterval(setClock, 1000)

const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');

function setClock() {
    const currentDate = new Date();
    const seconds = currentDate.getSeconds() / 60;
    const minutes = (seconds + currentDate.getMinutes()) / 60;
    const hours = (minutes + currentDate.getHours()) / 12;
    setRotation(hourHand, hours);
    setRotation(minuteHand, minutes);
    setRotation(secondHand, seconds);
}


function setRotation(element, rotationRatio) {
    element.style.setProperty('--rotation', rotationRatio * 360);
}
setClock()

const day = new Date();
console.log(day)

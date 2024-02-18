// animations.js

document.addEventListener('DOMContentLoaded', () => {
    animateElements();
});

function animateElements() {
    const weatherIcon = document.getElementById('weather-icon');
    const weatherDescription = document.getElementById('weather-description');
    const temperature = document.getElementById('temperature');

    addAnimationClasses(weatherIcon, 'animate__fadeInDown');
    addAnimationClasses(weatherDescription, 'animate__fadeInUp');
    addAnimationClasses(temperature, 'animate__fadeIn');
}

function addAnimationClasses(element, animationClass) {
    element.classList.remove('animate__animated');
    element.classList.remove('animate__fadeInDown');
    element.classList.remove('animate__fadeInUp');
    element.classList.remove('animate__fadeIn');

    // Trigger reflow to restart the animation
    void element.offsetWidth;

    element.classList.add('animate__animated', animationClass);
}

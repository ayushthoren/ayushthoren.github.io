document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        gsap.fromTo(section, 
            { scale: 2, opacity: 0, transformOrigin: 'center center' }, 
            { 
                scale: 0,
                opacity: 1.5,
                transformOrigin: 'center center',
                scrollTrigger: {
                    trigger: section,
                    start: 'top -50%',
                    end: 'bottom 0%',
                    // markers: true,
                    scrub: true,
                    pin: true,
                    pinSpacing: false
                }
            }
        );
    });

    // Initialize VanillaTilt
    // VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
});

function scrollSnapBehavior(x) {
    // console.log(x)
    if (0.4 <= x && x <= 0.6) { return 0.5 }
    return x;
}

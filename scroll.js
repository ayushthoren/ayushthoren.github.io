// Code to handle the animation of elements as they scroll into view
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the ScrollTrigger plugin for the GSAP library
    gsap.registerPlugin(ScrollTrigger);

    // Get all of the sections of the webpage
    const sections = document.querySelectorAll('section');

    // For each section, apply the animation
    // ( transparent and big => opaque and small )
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
                    // markers: true, // Enable for animation debugging
                    scrub: true,
                    pin: true,
                    pinSpacing: false
                }
            }
        );
    });
});

// Failed scroll snapping custom behavior function
// I'll keep it here for now in case I want to attempt it again
function scrollSnapBehavior(x) {
    if (0.4 <= x && x <= 0.6) { return 0.5 }
    return x;
}

import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Code to handle the animation of elements as they scroll into view
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the ScrollTrigger plugin for the GSAP library
    gsap.registerPlugin(ScrollTrigger);

    // Beginning of Lenis (smooth scrolling) code...
    // Easing function for Lenis scroll
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    const lenis = new Lenis({
        // Length of scroll animation in seconds
        duration: 1.5,
        // Use the custom easing function
        easing: easeOutCubic,
    })

    // Lenis debugging, uncomment to see scroll info in console
    // lenis.on('scroll', (e) => {
    //   console.log(e)
    // })

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);
    // End of Lenis code.

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

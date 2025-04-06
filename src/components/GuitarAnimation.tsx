import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const GuitarAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const frameCount = 100;
    const images: HTMLImageElement[] = [];
    const imageSeq = {
      frame: 0,
    };

    const files = (index: number) => {
      return `/guitar_000/guitar_${String(index).padStart(3, '0')}.jpg`;
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = files(i);
      images.push(img);
    }

    const mainTitle = document.querySelector('.main-title') as HTMLElement;
    const features = document.querySelectorAll('.feature-text') as NodeListOf<HTMLElement>;

    const scaleImage = (img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
      const canvas = ctx.canvas;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
    };

    const render = () => {
      if (images[imageSeq.frame]) {
        scaleImage(images[imageSeq.frame], context);
      }
    };

    images[0].onload = render;

    gsap.to(imageSeq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "#main",
        scrub: true,
        pin: true,
        start: "bottom 100%",
        end: "1500% 0%",
        onUpdate: (self) => {
          render();
          const progress = self.progress;
          
          if (mainTitle) {
            mainTitle.style.opacity = progress > 0.1 ? "0" : "1";
          }
          
          features.forEach((feature, index) => {
            const start = 0.2 + (index * 0.15);
            const end = start + 0.1;
            
            if (progress >= start && progress <= end) {
              feature.style.opacity = "1";
              feature.style.transform = "translateY(0)";
            } else {
              feature.style.opacity = "0";
              feature.style.transform = "translateY(20px)";
            }
          });
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div id="main" className="relative w-full h-screen">
      <canvas ref={canvasRef} className="w-full h-full bg-black" />
      <div className="overlay-container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 w-full h-full bg-black/30 flex items-center justify-center">
        <h1 className="main-title absolute text-[clamp(2rem,6vw,6rem)] font-bold mb-8 opacity-100 transition-opacity duration-500 ease-in-out" style={{ fontFamily: 'Boldonse, sans-serif' }}>
          Virtual Guitar Experience
        </h1>
        {/* div className="feature-text absolute text-[clamp(1.5rem,3vw,3rem)] my-4 transition-all duration-500 ease-in-out" style={{ fontFamily: 'Boldonse, sans-serif' }}>
          Virtual Guitar Learning
        </div*/}
        <div className="feature-text absolute text-[clamp(1.5rem,3vw,3rem)] my-4 transition-all duration-500 ease-in-out" style={{ fontFamily: 'Boldonse, sans-serif' }}>
          Real-time Chord Detection
        </div>
        {/*<div className="feature-text absolute text-[clamp(1.5rem,3vw,3rem)] my-4 transition-all duration-500 ease-in-out" style={{ fontFamily: 'Boldonse, sans-serif' }}>
          Interactive Tutorials
        </div>*/}
        <div className="feature-text absolute text-[clamp(1.5rem,3vw,3rem)] my-4 transition-all duration-500 ease-in-out" style={{ fontFamily: 'Boldonse, sans-serif' }}>
          3D Visualization
        </div>
        {/** 
        <div className="feature-text absolute text-[clamp(1.5rem,3vw,3rem)] my-4 transition-all duration-500 ease-in-out" style={{ fontFamily: 'Boldonse, sans-serif' }}>
          Practice Mode
        </div>*/}
      </div>
    </div>
  );
};

export default GuitarAnimation; 
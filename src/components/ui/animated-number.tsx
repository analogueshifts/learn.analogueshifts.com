"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const AnimatedNumber = ({
  targetNumber,
  triggerRef,
}: {
  targetNumber: number;
  triggerRef: any;
}) => {
  const numberRef: any = useRef(null);

  useGSAP(() => {
    const element = numberRef.current;

    if (element) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 80%",
          onEnter: () => tl.play(),
        },
        paused: true,
      });

      tl.fromTo(
        element,
        { innerHTML: 0 },
        {
          innerHTML: targetNumber,
          duration: 0.3,
          ease: "power1.out",
          snap: { innerHTML: 1 },
          onUpdate: function () {
            element.innerHTML = Math.ceil(element.innerHTML);
          },
        }
      );
    }
  }, [triggerRef, targetNumber]);

  return <span ref={numberRef}>0</span>;
};

export default AnimatedNumber;

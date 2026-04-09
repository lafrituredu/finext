import { useTranslation } from "react-i18next";
import { animate, stagger, splitText } from 'animejs';


function Sponsors() {
const { chars } = splitText('h2', { words: false, chars: true });

animate(chars, {
  // Property keyframes
  y: [
    { to: '-2.75rem', ease: 'outExpo', duration: 600 },
    { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
  ],
  // Property specific parameters
  rotate: {
    from: '-1turn',
    delay: 0
  },
  delay: stagger(50),
  ease: 'inOutCirc',
  loopDelay: 1000,
  loop: true
});
  return (
    <>
      {/* <div className="flex w-full h-30 py-20 overflow-hidden items-center justify-end">
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            animation: "scroll 15s linear infinite",
            transform: "translateX(0)",
          }} className="inter text-black dark:text-[#D8E0F9] text-3xl"
        >
          <p className="inline-block px-30">Lorem ipsum</p>
          <p className="inline-block px-30">Lorem ipsum</p>
          <p className="inline-block px-30">Lorem ipsum</p>
        </div>

        <style>{`
          @keyframes scroll {
            0% { transform: translateX(200%); }
            100% { transform: translateX(-150%); }
          }
        `}</style>
        <div
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            animation: "scroll 15s linear infinite",
            transform: "translateX(0)",
          }} className="inter text-black dark:text-[#D8E0F9] text-3xl"
        >
          <p className="inline-block px-30">Lorem ipsum</p>
          <p className="inline-block px-30">Lorem ipsum</p>
          <p className="inline-block px-30">Lorem ipsum</p>
        </div>

        <style>{`
          @keyframes scroll {
            0% { transform: translateX(200%); }
            100% { transform: translateX(-150%); }
          }
        `}</style>
      </div> */}
      <div className="large grid centered square-grid justify-center items-center">
        <h2 className="text-xl">HELLO WORLD</h2>
        <h2 className="text-xl">HELLO WORLD</h2>
    </div>
    </>
  )
}

export default Sponsors
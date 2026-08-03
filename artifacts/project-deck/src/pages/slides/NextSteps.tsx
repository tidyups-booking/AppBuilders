const base = import.meta.env.BASE_URL;

export default function NextSteps() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[#2a1f47]">
      <div className="absolute inset-0 bg-gradient-to-tl from-[#4d3a85] via-[#3a2c66] to-[#2a1f47]" />
      <div className="absolute -left-[6vw] -top-[18vh] w-[32vw] h-[32vw] rounded-full bg-white/5" />
      <div className="absolute left-[8vw] top-[14vh]">
        <p className="font-body font-semibold text-[#ee7fdc] text-[1.6vw] uppercase tracking-widest">
          Roadmap
        </p>
        <h2 className="font-display font-extrabold text-white text-[4.2vw] tracking-tight mt-[1.5vh]">
          What's next
        </h2>
      </div>
      <div className="absolute left-[8vw] top-[38vh] flex flex-col gap-[4.5vh] max-w-[58vw]">
        <p className="font-body text-white/90 text-[2.2vw] leading-snug">
          Host the privacy policy page
        </p>
        <p className="font-body text-white/90 text-[2.2vw] leading-snug">
          Finalize splash screen and iOS branding
        </p>
        <p className="font-body text-white/90 text-[2.2vw] leading-snug">
          Submit to the App Store
        </p>
        <p className="font-body text-white/90 text-[2.2vw] leading-snug">
          Android launch assets when we're ready
        </p>
      </div>
      <img
        src={`${base}photos/logo.png`}
        crossOrigin="anonymous"
        alt="833 Tidyups logo"
        className="absolute right-[8vw] bottom-[10vh] w-[14vw] opacity-90"
      />
    </div>
  );
}

const base = import.meta.env.BASE_URL;

export default function Title() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-[#2a1f47]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4d3a85] via-[#8870c4] to-[#ee3fce] opacity-90" />
      <div className="absolute -right-[8vw] -bottom-[20vh] w-[45vw] h-[45vw] rounded-full bg-white/10" />
      <div className="absolute right-[10vw] top-[12vh] w-[10vw] h-[10vw] rounded-full bg-white/10" />
      <div className="absolute left-[7vw] top-[14vh] flex flex-col justify-center h-[72vh] max-w-[55vw]">
        <img
          src={`${base}photos/logo.png`}
          crossOrigin="anonymous"
          alt="833 Tidyups logo"
          className="w-[16vw] mb-[5vh] drop-shadow-lg"
        />
        <h1 className="font-display font-extrabold text-white text-[6.5vw] leading-[1.05] tracking-tight text-balance">
          833 Tidyups
        </h1>
        <p className="font-body text-white/90 text-[2.2vw] mt-[3.5vh] leading-relaxed max-w-[46vw]">
          Edmonton's home-cleaning service — now with booking software built
          for the way we work.
        </p>
      </div>
      <p className="absolute left-[7vw] bottom-[6vh] font-body text-white/70 text-[1.5vw]">
        Project overview · August 2026
      </p>
    </div>
  );
}

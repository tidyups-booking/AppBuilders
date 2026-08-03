export default function AppStore() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg">
      <div className="absolute left-0 top-0 h-full w-[0.6vw] bg-gradient-to-b from-primary to-accent" />
      <div className="absolute left-[8vw] top-[12vh] max-w-[80vw]">
        <p className="font-body font-semibold text-accent text-[1.6vw] uppercase tracking-widest">
          Launch
        </p>
        <h2 className="font-display font-extrabold text-text text-[4.2vw] tracking-tight mt-[1.5vh]">
          Ready for the App Store
        </h2>
      </div>
      <div className="absolute left-[8vw] right-[8vw] top-[36vh] grid grid-cols-2 gap-x-[3vw] gap-y-[4vh]">
        <div className="bg-white rounded-2xl shadow-sm p-[1.8vw] flex items-center gap-[1.5vw]">
          <span className="font-display font-extrabold text-primary text-[2.4vw]">✓</span>
          <p className="font-body text-text text-[1.9vw] leading-snug">
            Real iPhone app built and running
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-[1.8vw] flex items-center gap-[1.5vw]">
          <span className="font-display font-extrabold text-primary text-[2.4vw]">✓</span>
          <p className="font-body text-text text-[1.9vw] leading-snug">
            App Store icon, screenshots, and listing copy — all prepared
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-[1.8vw] flex items-center gap-[1.5vw]">
          <span className="font-display font-extrabold text-primary text-[2.4vw]">✓</span>
          <p className="font-body text-text text-[1.9vw] leading-snug">
            Privacy policy drafted and ready to host
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-[1.8vw] flex items-center gap-[1.5vw]">
          <span className="font-display font-extrabold text-accent text-[2.4vw]">✓</span>
          <p className="font-body text-text text-[1.9vw] leading-snug">
            One click to submit for review
          </p>
        </div>
      </div>
    </div>
  );
}

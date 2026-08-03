export default function Solution() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg">
      <div className="absolute right-0 top-0 h-full w-[0.6vw] bg-gradient-to-b from-accent to-primary" />
      <div className="absolute left-[8vw] top-[12vh] max-w-[80vw]">
        <p className="font-body font-semibold text-accent text-[1.6vw] uppercase tracking-widest">
          After
        </p>
        <h2 className="font-display font-extrabold text-text text-[4.2vw] tracking-tight mt-[1.5vh]">
          The solution
        </h2>
      </div>
      <div className="absolute left-[8vw] right-[8vw] top-[36vh] grid grid-cols-3 gap-[2.5vw]">
        <div className="bg-white rounded-2xl shadow-sm p-[2vw] h-[42vh] flex flex-col">
          <div className="w-[3vw] h-[0.6vh] bg-primary rounded-full mb-[3vh]" />
          <h3 className="font-display font-bold text-text text-[2vw] leading-tight">
            One booking platform
          </h3>
          <p className="font-body text-muted text-[1.7vw] leading-relaxed mt-[2vh]">
            Web app for the office, mobile app for the field
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-[2vw] h-[42vh] flex flex-col">
          <div className="w-[3vw] h-[0.6vh] bg-accent rounded-full mb-[3vh]" />
          <h3 className="font-display font-bold text-text text-[2vw] leading-tight">
            Captured in under 60 seconds
          </h3>
          <p className="font-body text-muted text-[1.7vw] leading-relaxed mt-[2vh]">
            Every booking recorded while the customer is still on the call
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-[2vw] h-[42vh] flex flex-col">
          <div className="w-[3vw] h-[0.6vh] bg-primary rounded-full mb-[3vh]" />
          <h3 className="font-display font-bold text-text text-[2vw] leading-tight">
            Live price estimates
          </h3>
          <p className="font-body text-muted text-[1.7vw] leading-relaxed mt-[2vh]">
            Quotes are instant and consistent
          </p>
        </div>
      </div>
    </div>
  );
}

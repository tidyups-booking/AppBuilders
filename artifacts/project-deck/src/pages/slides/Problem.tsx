export default function Problem() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg">
      <div className="absolute left-0 top-0 h-full w-[0.6vw] bg-gradient-to-b from-primary to-accent" />
      <div className="absolute left-[8vw] top-[12vh] max-w-[80vw]">
        <p className="font-body font-semibold text-accent text-[1.6vw] uppercase tracking-widest">
          Before
        </p>
        <h2 className="font-display font-extrabold text-text text-[4.2vw] tracking-tight mt-[1.5vh]">
          The problem
        </h2>
      </div>
      <div className="absolute left-[8vw] top-[36vh] flex flex-col gap-[5vh] max-w-[74vw]">
        <div className="flex items-start gap-[2vw]">
          <div className="w-[3.4vw] h-[3.4vw] rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <span className="font-display font-extrabold text-primary text-[1.8vw]">1</span>
          </div>
          <p className="font-body text-text text-[2.3vw] leading-snug pt-[0.5vh]">
            Bookings taken over the phone ended up scattered across notes and texts
          </p>
        </div>
        <div className="flex items-start gap-[2vw]">
          <div className="w-[3.4vw] h-[3.4vw] rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <span className="font-display font-extrabold text-primary text-[1.8vw]">2</span>
          </div>
          <p className="font-body text-text text-[2.3vw] leading-snug pt-[0.5vh]">
            No single view of the week's jobs or revenue
          </p>
        </div>
        <div className="flex items-start gap-[2vw]">
          <div className="w-[3.4vw] h-[3.4vw] rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <span className="font-display font-extrabold text-primary text-[1.8vw]">3</span>
          </div>
          <p className="font-body text-text text-[2.3vw] leading-snug pt-[0.5vh]">
            Quoting a price meant math on the spot, every time
          </p>
        </div>
      </div>
    </div>
  );
}

const base = import.meta.env.BASE_URL;

export default function Glance() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg">
      <div className="absolute left-[9vw] top-[8vh] bottom-0 w-[26vw]">
        <div className="w-full h-full rounded-t-[3vw] border-[0.5vw] border-b-0 border-[#2a1f47] overflow-hidden shadow-2xl bg-white">
          <img
            src={`${base}photos/dashboard.jpg`}
            crossOrigin="anonymous"
            alt="Dashboard in the mobile app"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
      <div className="absolute right-[8vw] top-[14vh] max-w-[46vw] text-right">
        <p className="font-body font-semibold text-accent text-[1.6vw] uppercase tracking-widest">
          Dashboard
        </p>
        <h2 className="font-display font-extrabold text-text text-[4vw] tracking-tight mt-[1.5vh] text-balance">
          Everything at a glance
        </h2>
        <div className="flex flex-col gap-[3.5vh] mt-[6vh]">
          <p className="font-body text-text text-[2vw] leading-snug">
            Dashboard shows revenue, pending and completed jobs
          </p>
          <p className="font-body text-text text-[2vw] leading-snug">
            Every booking coming up in the next two weeks
          </p>
          <p className="font-body text-text text-[2vw] leading-snug">
            Filter all bookings by status: pending, confirmed, in progress, completed
          </p>
        </div>
      </div>
    </div>
  );
}

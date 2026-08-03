const base = import.meta.env.BASE_URL;

export default function JobControl() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg">
      <div className="absolute left-[8vw] top-[14vh] max-w-[46vw]">
        <p className="font-body font-semibold text-accent text-[1.6vw] uppercase tracking-widest">
          Job details
        </p>
        <h2 className="font-display font-extrabold text-text text-[4vw] tracking-tight mt-[1.5vh] text-balance">
          Stay on top of every job
        </h2>
        <div className="flex flex-col gap-[3.5vh] mt-[6vh]">
          <p className="font-body text-text text-[2vw] leading-snug">
            Full job details: address, home size, extras, notes
          </p>
          <p className="font-body text-text text-[2vw] leading-snug">
            One-tap status updates
          </p>
          <p className="font-body text-text text-[2vw] leading-snug">
            Call or email the customer straight from the booking
          </p>
        </div>
      </div>
      <div className="absolute right-[9vw] top-[8vh] bottom-0 w-[26vw]">
        <div className="w-full h-full rounded-t-[3vw] border-[0.5vw] border-b-0 border-[#2a1f47] overflow-hidden shadow-2xl bg-white">
          <img
            src={`${base}photos/booking-detail.jpg`}
            crossOrigin="anonymous"
            alt="Booking detail view in the mobile app"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

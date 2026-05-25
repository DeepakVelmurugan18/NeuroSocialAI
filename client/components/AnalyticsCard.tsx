type AnalyticsCardProps = {

  title: string;

  value: string;

};

export default function AnalyticsCard({

  title,

  value,

}: AnalyticsCardProps) {

  return (

    <div
      className="
        theme-card
        relative
        overflow-hidden
        rounded-[30px]
        p-5
        md:p-7
        border
        border-white/5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-500/20
        hover:shadow-2xl
        hover:shadow-cyan-500/10
      "
    >

      {/* GLOW */}

      <div
        className="
          absolute
          top-[-40px]
          right-[-40px]
          w-[120px]
          h-[120px]
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />

      {/* TOP */}

      <div
        className="
          flex
          items-start
          justify-between
          relative
          z-10
        "
      >

        {/* TITLE */}

        <div>

          <p
            className="
              theme-muted
              text-sm
              uppercase
              tracking-[0.18em]
              mb-4
            "
          >

            {title}

          </p>

          <h2
            className="
              text-4xl
              md:text-5xl
              font-bold
              theme-text
              leading-none
            "
          >

            {value}

          </h2>

        </div>

        {/* TREND */}

        <div
          className="
            px-4
            py-2
            rounded-2xl
            bg-cyan-500/10
            border
            border-cyan-500/20
            text-cyan-400
            text-sm
            font-semibold
            backdrop-blur-xl
          "
        >

          +12%

        </div>

      </div>

      {/* BOTTOM */}

      <div
        className="
          flex
          items-center
          justify-between
          mt-10
          relative
          z-10
        "
      >

        <p
          className="
            theme-muted
            text-sm
          "
        >

          Updated just now

        </p>

        {/* MINI BAR */}

        <div
          className="
            flex
            items-end
            gap-1
            h-10
          "
        >

          <div
            className="
              w-2
              h-4
              rounded-full
              bg-cyan-500/30
            "
          />

          <div
            className="
              w-2
              h-6
              rounded-full
              bg-cyan-500/50
            "
          />

          <div
            className="
              w-2
              h-8
              rounded-full
              bg-cyan-400
            "
          />

          <div
            className="
              w-2
              h-5
              rounded-full
              bg-cyan-500/40
            "
          />

        </div>

      </div>

    </div>

  );

}
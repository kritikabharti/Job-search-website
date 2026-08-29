export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              About Jobify
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Connecting talent with opportunity
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Jobify is a modern recruitment platform designed to help
              professionals discover meaningful career opportunities and help
              employers find the right talent.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Our mission
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Making recruitment simpler and more effective
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                We are building a platform where job seekers can create
                professional profiles, discover relevant opportunities, and
                manage their career journey from one place.
              </p>

              <p className="mt-4 leading-7 text-slate-600">
                At the same time, employers can discover qualified candidates,
                manage applications, schedule interviews, and build an
                efficient hiring pipeline.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-2xl font-bold text-slate-950">Job Seekers</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Build your profile and discover opportunities that match
                  your skills.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-2xl font-bold text-slate-950">Employers</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Find qualified candidates and manage your recruitment
                  process.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-2xl font-bold text-slate-950">Smart Search</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Find jobs and candidates using powerful search and filters.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-2xl font-bold text-slate-950">Better Hiring</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Manage applications, interviews, and candidate pipelines in
                  one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
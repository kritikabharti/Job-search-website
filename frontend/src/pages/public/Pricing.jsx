import { Link } from "react-router-dom";
import { FiCheck, FiArrowRight } from "react-icons/fi";

const plans = [
  {
    name: "Free",
    description: "Get started with the essentials.",
    price: "₹0",
    period: "forever",
    featured: false,
    features: [
      "Create your professional profile",
      "Browse unlimited jobs",
      "Apply to available jobs",
      "Create 1 CV",
      "Basic job recommendations",
      "Save jobs",
    ],
    button: "Get Started",
  },
  {
    name: "Job Seeker Plus",
    description: "For candidates who want more opportunities.",
    price: "₹299",
    period: "per month",
    featured: true,
    features: [
      "Everything in Free",
      "Create multiple CV versions",
      "AI CV improvement tools",
      "Advanced job recommendations",
      "Application tracking",
      "Profile visibility boost",
      "Priority support",
    ],
    button: "Upgrade Now",
  },
  {
    name: "Professional",
    description: "For serious job seekers and professionals.",
    price: "₹799",
    period: "per 3 months",
    featured: false,
    features: [
      "Everything in Job Seeker Plus",
      "Unlimited CV versions",
      "Advanced CV analytics",
      "AI interview preparation",
      "Profile performance insights",
      "Recruiter visibility tools",
      "Priority applications",
    ],
    button: "Choose Professional",
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Simple pricing
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Choose the plan that works for you
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Start for free and upgrade when you need more CV tools,
            visibility and career features.
          </p>

        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 ${
                plan.featured
                  ? "border-blue-600 shadow-xl"
                  : "border-slate-200"
              }`}
            >

              {/* Featured */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <h2 className="text-xl font-bold text-slate-950">
                {plan.name}
              </h2>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                {plan.description}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-slate-950">
                  {plan.price}
                </span>

                <span className="ml-2 text-sm text-slate-500">
                  {plan.period}
                </span>
              </div>

              <Link
                to="/register"
                className={`mt-7 flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
                  plan.featured
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600"
                }`}
              >
                {plan.button}
                <FiArrowRight />
              </Link>

              <div className="my-7 border-t border-slate-200" />

              <p className="text-sm font-semibold text-slate-950">
                What's included
              </p>

              <ul className="mt-5 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm leading-6 text-slate-600"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <FiCheck size={13} />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

            </div>
          ))}

        </div>
      </section>

      {/* CV Credits */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl bg-slate-950 p-8 md:p-12">

            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                  CV Credits
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  Need more CVs without a subscription?
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                  Start with your free CV allowance. When you need additional
                  CV versions, purchase CV credits and use them whenever you
                  need them.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-lg bg-white/10 px-4 py-2 text-sm text-slate-300">
                    Free CV included
                  </span>

                  <span className="rounded-lg bg-white/10 px-4 py-2 text-sm text-slate-300">
                    Pay only when needed
                  </span>

                  <span className="rounded-lg bg-white/10 px-4 py-2 text-sm text-slate-300">
                    No forced subscription
                  </span>
                </div>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Get Started
                <FiArrowRight />
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">

          <h2 className="text-center text-3xl font-bold text-slate-950">
            Frequently asked questions
          </h2>

          <div className="mt-10 divide-y divide-slate-200">

            <div className="py-6">
              <h3 className="font-semibold text-slate-950">
                Can I use Jobify for free?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Yes. You can create an account, build your profile, browse
                jobs and use your included free CV allowance.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-semibold text-slate-950">
                What are CV credits?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                CV credits allow you to create additional CV versions after
                using your free allowance.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-semibold text-slate-950">
                Do I need a subscription to apply for jobs?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                No. The core job search and application functionality can be
                available to free users.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
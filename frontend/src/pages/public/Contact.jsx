import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
} from "react-icons/fi";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Contact us
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              How can we help?
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Have a question about Jobify, need help with your account, or
              want to discuss hiring solutions? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[380px_1fr]">

          {/* Contact Information */}
          <div className="rounded-2xl bg-slate-950 p-8 text-white">
            <h2 className="text-2xl font-bold">
              Get in touch
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Whether you're looking for your next opportunity or searching
              for talented professionals, we'd love to hear from you.
            </p>

            <div className="mt-10 space-y-7">

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-blue-400">
                  <FiMail size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    support@jobify.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-blue-400">
                  <FiPhone size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    +91 00000 00000
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-blue-400">
                  <FiMapPin size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Office
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Chandigarh, India
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-slate-950">
                Send us a message
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Fill out the form and our team will get back to you.
              </p>
            </div>

            <form className="mt-8 space-y-6">

              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows="6"
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Send Message
                <FiSend />
              </button>

            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
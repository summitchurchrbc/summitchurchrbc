"use client";

const contactTopics = [
  { value: "prayer", label: "Requesting Prayer" },
  { value: "first-visit", label: "Planning My First Visit" },
  { value: "service-times", label: "Service Times & Location" },
  { value: "kids-ministry", label: "Kids & Youth Ministry" },
  { value: "ministries", label: "Small Groups & Ministries" },
  { value: "general", label: "General Question" },
  { value: "other", label: "Other" },
] as const;

const fieldClassName =
  "w-full rounded-sm border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export function ContactForm() {
  return (
    <form
      action="https://formspree.io/f/xplaceholder"
      method="POST"
      className="mx-auto max-w-lg space-y-5"
    >
      <p className="text-sm text-amber-700">
        Note: Replace the Formspree action URL in <code>ContactForm.tsx</code> with your form
        endpoint before going live.
      </p>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input type="email" id="email" name="email" required className={fieldClassName} />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input type="tel" id="phone" name="phone" className={fieldClassName} />
      </div>

      <div>
        <label htmlFor="topic" className="mb-1 block text-sm font-medium text-gray-700">
          How can we help?
        </label>
        <select id="topic" name="topic" required className={fieldClassName} defaultValue="">
          <option value="" disabled>
            Select a topic
          </option>
          {contactTopics.map((topic) => (
            <option key={topic.value} value={topic.label}>
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea id="message" name="message" rows={5} required className={fieldClassName} />
      </div>

      <button
        type="submit"
        className="w-full rounded-sm bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Send Message
      </button>
    </form>
  );
}
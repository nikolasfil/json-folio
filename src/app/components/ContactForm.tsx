"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiSend } from "react-icons/fi";
import { ContactFormProps } from "../types/portfolio-data.type";

/**
 * Minimal Google Forms config used by json-folio tracking.googleForm.
 * We keep this local & optional to avoid forcing changes in external types.
 */
type GoogleFormConfig = {
  enabled?: boolean;
  actionUrl?: string;
  /**
   * Maps Google Form "entry.<id>" -> contact field name (e.g. "name", "email", "message").
   * Example:
   *   { "entry.449055977": "name", "entry.1753761619": "email" }
   */
  formData?: Record<string, string>;
};

type ContactFormExtendedProps = ContactFormProps & {
  googleForm?: GoogleFormConfig;
  tracking?: {
    googleForm?: GoogleFormConfig;
  };
};

const ContactForm = (props: ContactFormExtendedProps) => {
  const {
    emailJsConfig,
    formFields,
    submitButton,
    successMessage,
    errorMessage,
    validationMessages
  } = props;

  // `formFields` might be strictly typed; keep optional extensions safe.
  const companyField = (formFields as any)?.company;

  // Prefer a dedicated `googleForm` prop, otherwise try json-folio's `tracking.googleForm`.
  const googleForm: GoogleFormConfig | undefined =
    props.googleForm ?? props.tracking?.googleForm;

  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    // Optional; rendered only if you add it in your JSON and/or in the Google Form.
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateField = (name: string, value: string) => {
    switch (name.toLocaleLowerCase()) {
      case "name":
        return value.trim().length < 2 ? validationMessages.name : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? validationMessages.email : "";
      case "message":
        if (value.trim().length < 2) return validationMessages.messageMin;
        if (value.trim().length > 1000) return validationMessages.messageMax;
        return "";
      case "subject":
        return value.trim().length < 2 ? validationMessages.subject : "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => (error ? { ...prev, [name]: error } : { ...prev, [name]: "" }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => (error ? { ...prev, [name]: error } : { ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      // Optional fields we don't require.
      if (key === "phone" || key === "company") return;
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // 1) Primary: Submit to Google Forms (recommended for your use-case).
      if (googleForm?.enabled && googleForm.actionUrl && googleForm.formData) {
        const params = new URLSearchParams();

        // Map each Google Forms "entry.<id>" to the correct value from our local state.
        for (const [entryId, key] of Object.entries(googleForm.formData)) {
          const value = (formData as Record<string, string>)[key] ?? "";
          params.append(entryId, value);
        }

        // Google Forms doesn't allow CORS; `no-cors` is expected.
        // That means we can't reliably read the response. If fetch doesn't throw,
        // we assume success.
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12_000);

        try {
          await fetch(googleForm.actionUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: params.toString(),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeout);
        }

        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          company: "",
        });
        return;
      }

      // 2) Fallback: EmailJS (only if configured).
      // If you don't want EmailJS at all, you can delete this block.
      const hasEmailJs =
        !!emailJsConfig?.serviceId &&
        !!emailJsConfig?.templateId &&
        !!emailJsConfig?.publicKey;

      if (!hasEmailJs) {
        throw new Error(
          "No Google Form config found (tracking.googleForm) and EmailJS is not configured."
        );
      }

      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.sendForm(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        formRef.current!,
        emailJsConfig.publicKey
      );

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        company: "",
      });
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {formFields.name.label}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={formFields.name.placeholder}
            required
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.name ? "border-red-500" : "border-gray-700"
            } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
          />
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs mt-1 flex items-center gap-1"
            >
              <FiAlertCircle /> {errors.name}
            </motion.p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {formFields.email.label}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={formFields.email.placeholder}
            required
            className={`w-full px-4 py-3 bg-gray-800 border ${
              errors.email ? "border-red-500" : "border-gray-700"
            } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
          />
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs mt-1 flex items-center gap-1"
            >
              <FiAlertCircle /> {errors.email}
            </motion.p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {formFields.phone.label}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={formFields.phone.placeholder}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Optional Company field (only renders if your JSON provides it) */}
      {companyField && (
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {companyField.label}
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={(formData as any).company}
            onChange={handleChange}
            placeholder={companyField.placeholder}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      )}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {formFields.subject.label}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={formFields.subject.placeholder}
          required
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.subject ? "border-red-500" : "border-gray-700"
          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
        />
        {errors.subject && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-1 flex items-center gap-1"
          >
            <FiAlertCircle /> {errors.subject}
          </motion.p>
        )}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300"
          >
            {formFields.message.label}
          </label>
          <span className="text-xs text-gray-500">
            {formData.message.length}/1000
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={formFields.message.placeholder}
          required
          maxLength={1000}
          className={`w-full px-4 py-3 bg-gray-800 border ${
            errors.message ? "border-red-500" : "border-gray-700"
          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
        ></textarea>
        {errors.message && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs mt-1 flex items-center gap-1"
          >
            <FiAlertCircle /> {errors.message}
          </motion.p>
        )}
      </div>
      <div className="pt-2">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
            isSubmitting ? "opacity-70" : "hover:opacity-90"
          } transition-all`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {submitButton.sendingText}
            </>
          ) : (
            <>
              <FiSend /> {submitButton.text}
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {submitStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`rounded-lg p-4 ${
              submitStatus === "success"
                ? "bg-green-900/30 border border-green-800"
                : "bg-red-900/30 border border-red-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {submitStatus === "success" ? (
                <>
                  <FiCheckCircle className="text-green-400 text-xl" />
                  <p className="text-green-400">{successMessage}</p>
                </>
              ) : (
                <>
                  <FiAlertCircle className="text-red-400 text-xl" />
                  <p className="text-red-400">{errorMessage}</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default ContactForm;
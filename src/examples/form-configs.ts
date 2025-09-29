// Example Form Configuration
// This demonstrates a comprehensive form similar to Google Forms with multiple sections and field types

export const exampleFormConfig = {
  id: "form_2024_user_registration",
  name: "GDG Event Registration Form",
  description:
    "Complete registration form for our upcoming tech event. Please fill all required fields.",
  imageUrl: "https://example.com/images/gdg-event-cover.jpg",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T14:30:00Z",
  settings: {
    allowMultipleSubmissions: false,
    requireAuthentication: true,
    showProgressBar: true,
    submitButtonText: "Complete Registration",
    successMessage:
      "Thank you! Your registration has been submitted successfully. We'll send a confirmation email shortly.",
    redirectUrl: "/registration-success",
    notificationEmails: ["events@gdg-vishnu.dev", "admin@gdg-vishnu.dev"],
    saveProgress: true,
    theme: {
      primaryColor: "#4285f4",
      backgroundColor: "#ffffff",
      textColor: "#333333",
      borderRadius: "8px",
    },
  },
  sections: [
    {
      id: "section_personal_info",
      title: "Personal Information",
      description: "Please provide your basic information",
      order: 0,
      formId: "form_2024_user_registration",
      styling: {
        collapsible: false,
        showTitle: true,
      },
      fields: [
        {
          id: "field_full_name",
          label: "Full Name",
          placeholder: "Enter your full name",
          type: "INPUT",
          required: true,
          order: 0,
          sectionId: "section_personal_info",
          validation: {
            minLength: 2,
            maxLength: 100,
            pattern: "^[a-zA-Z\\s]+$",
          },
          styling: {
            width: "full",
            size: "md",
          },
        },
        {
          id: "field_email",
          label: "Email Address",
          placeholder: "your.email@example.com",
          type: "INPUT",
          required: true,
          order: 1,
          sectionId: "section_personal_info",
          validation: {
            email: true,
            maxLength: 255,
          },
          styling: {
            width: "half",
          },
        },
        {
          id: "field_phone",
          label: "Phone Number",
          placeholder: "+1 (555) 123-4567",
          type: "PHONE",
          required: true,
          order: 2,
          sectionId: "section_personal_info",
          styling: {
            width: "half",
          },
          props: {
            maxLength: 15,
          },
        },
        {
          id: "field_date_of_birth",
          label: "Date of Birth",
          type: "DATE",
          required: false,
          order: 3,
          sectionId: "section_personal_info",
          styling: {
            width: "third",
          },
          props: {
            maxDate: "2006-01-01",
            format: "MM/DD/YYYY",
          },
        },
        {
          id: "field_gender",
          label: "Gender",
          type: "SELECT",
          required: false,
          order: 4,
          sectionId: "section_personal_info",
          options: [
            { id: "opt_male", label: "Male", value: "male" },
            { id: "opt_female", label: "Female", value: "female" },
            { id: "opt_other", label: "Other", value: "other" },
            {
              id: "opt_prefer_not_to_say",
              label: "Prefer not to say",
              value: "prefer_not_to_say",
            },
          ],
          styling: {
            width: "third",
          },
        },
      ],
    },
    {
      id: "section_professional_info",
      title: "Professional Background",
      description: "Tell us about your professional experience",
      order: 1,
      formId: "form_2024_user_registration",
      styling: {
        collapsible: true,
        collapsed: false,
        showTitle: true,
      },
      fields: [
        {
          id: "field_occupation",
          label: "Current Occupation",
          placeholder: "e.g., Software Developer, Product Manager, Student",
          type: "INPUT",
          required: true,
          order: 0,
          sectionId: "section_professional_info",
          validation: {
            maxLength: 100,
          },
          styling: {
            width: "half",
          },
        },
        {
          id: "field_company",
          label: "Company/Organization",
          placeholder: "Enter your company name",
          type: "INPUT",
          required: false,
          order: 1,
          sectionId: "section_professional_info",
          validation: {
            maxLength: 100,
          },
          styling: {
            width: "half",
          },
        },
        {
          id: "field_experience_level",
          label: "Experience Level",
          type: "RADIO",
          required: true,
          order: 2,
          sectionId: "section_professional_info",
          options: [
            {
              id: "exp_beginner",
              label: "Beginner (0-2 years)",
              value: "beginner",
            },
            {
              id: "exp_intermediate",
              label: "Intermediate (2-5 years)",
              value: "intermediate",
            },
            { id: "exp_senior", label: "Senior (5-10 years)", value: "senior" },
            { id: "exp_expert", label: "Expert (10+ years)", value: "expert" },
          ],
          styling: {
            width: "full",
          },
        },
        {
          id: "field_skills",
          label: "Technical Skills",
          placeholder: "Add your skills (e.g., JavaScript, Python, React)",
          type: "TAGS",
          required: false,
          order: 3,
          sectionId: "section_professional_info",
          props: {
            maxTags: 10,
            suggestions: [
              "JavaScript",
              "Python",
              "React",
              "Node.js",
              "TypeScript",
              "Java",
              "Go",
              "Rust",
              "Docker",
              "Kubernetes",
              "AWS",
              "GCP",
              "Azure",
            ],
          },
          styling: {
            width: "full",
          },
        },
        {
          id: "field_bio",
          label: "Brief Bio",
          placeholder: "Tell us a bit about yourself and your interests...",
          type: "TEXTAREA",
          required: false,
          order: 4,
          sectionId: "section_professional_info",
          validation: {
            maxLength: 500,
          },
          styling: {
            width: "full",
          },
          props: {
            rows: 4,
          },
        },
      ],
    },
    {
      id: "section_event_preferences",
      title: "Event Preferences",
      description: "Help us customize your event experience",
      order: 2,
      formId: "form_2024_user_registration",
      styling: {
        collapsible: true,
        collapsed: false,
        showTitle: true,
      },
      fields: [
        {
          id: "field_session_interests",
          label: "Session Topics of Interest",
          type: "MULTISELECT",
          required: true,
          order: 0,
          sectionId: "section_event_preferences",
          options: [
            {
              id: "topic_web_dev",
              label: "Web Development",
              value: "web_development",
            },
            {
              id: "topic_mobile_dev",
              label: "Mobile Development",
              value: "mobile_development",
            },
            { id: "topic_ai_ml", label: "AI/Machine Learning", value: "ai_ml" },
            {
              id: "topic_cloud",
              label: "Cloud Computing",
              value: "cloud_computing",
            },
            { id: "topic_devops", label: "DevOps", value: "devops" },
            {
              id: "topic_blockchain",
              label: "Blockchain",
              value: "blockchain",
            },
            { id: "topic_iot", label: "Internet of Things", value: "iot" },
            {
              id: "topic_cybersecurity",
              label: "Cybersecurity",
              value: "cybersecurity",
            },
          ],
          styling: {
            width: "full",
          },
        },
        {
          id: "field_networking_interest",
          label: "Interest in Networking",
          type: "SLIDER",
          required: false,
          order: 1,
          sectionId: "section_event_preferences",
          defaultValue: 5,
          props: {
            min: 1,
            max: 10,
            step: 1,
          },
          styling: {
            width: "half",
          },
        },
        {
          id: "field_volunteer",
          label: "Would you like to volunteer at the event?",
          type: "SWITCH",
          required: false,
          order: 2,
          sectionId: "section_event_preferences",
          defaultValue: false,
          styling: {
            width: "half",
          },
        },
        {
          id: "field_dietary_restrictions",
          label: "Dietary Restrictions",
          type: "CHECKBOX",
          required: false,
          order: 3,
          sectionId: "section_event_preferences",
          options: [
            { id: "diet_vegetarian", label: "Vegetarian", value: "vegetarian" },
            { id: "diet_vegan", label: "Vegan", value: "vegan" },
            {
              id: "diet_gluten_free",
              label: "Gluten-Free",
              value: "gluten_free",
            },
            { id: "diet_halal", label: "Halal", value: "halal" },
            { id: "diet_kosher", label: "Kosher", value: "kosher" },
            { id: "diet_none", label: "No restrictions", value: "none" },
          ],
          styling: {
            width: "full",
          },
        },
        {
          id: "field_transportation",
          label: "How will you get to the event?",
          type: "COMBOBOX",
          required: false,
          order: 4,
          sectionId: "section_event_preferences",
          options: [
            { id: "transport_car", label: "Personal Car", value: "car" },
            {
              id: "transport_public",
              label: "Public Transportation",
              value: "public_transport",
            },
            {
              id: "transport_rideshare",
              label: "Rideshare (Uber/Lyft)",
              value: "rideshare",
            },
            { id: "transport_bike", label: "Bicycle", value: "bike" },
            { id: "transport_walk", label: "Walking", value: "walk" },
            { id: "transport_other", label: "Other", value: "other" },
          ],
          styling: {
            width: "half",
          },
        },
      ],
    },
    {
      id: "section_additional_info",
      title: "Additional Information",
      description: "Optional section for any additional details",
      order: 3,
      formId: "form_2024_user_registration",
      styling: {
        collapsible: true,
        collapsed: true,
        showTitle: true,
      },
      fields: [
        {
          id: "field_emergency_contact",
          label: "Emergency Contact Name",
          placeholder: "Full name of emergency contact",
          type: "INPUT",
          required: false,
          order: 0,
          sectionId: "section_additional_info",
          validation: {
            maxLength: 100,
          },
          styling: {
            width: "half",
          },
        },
        {
          id: "field_emergency_phone",
          label: "Emergency Contact Phone",
          placeholder: "+1 (555) 123-4567",
          type: "PHONE",
          required: false,
          order: 1,
          sectionId: "section_additional_info",
          styling: {
            width: "half",
          },
          logic: {
            requiredIf: [
              {
                fieldId: "field_emergency_contact",
                operator: "not_equals",
                value: "",
              },
            ],
          },
        },
        {
          id: "field_special_requirements",
          label: "Special Requirements or Accessibility Needs",
          placeholder: "Please describe any special accommodations you need...",
          type: "TEXTAREA",
          required: false,
          order: 2,
          sectionId: "section_additional_info",
          validation: {
            maxLength: 500,
          },
          styling: {
            width: "full",
          },
          props: {
            rows: 3,
          },
        },
        {
          id: "field_resume_upload",
          label: "Upload Resume (Optional)",
          type: "FILE",
          required: false,
          order: 3,
          sectionId: "section_additional_info",
          props: {
            accept: ".pdf,.doc,.docx",
            multiple: false,
            maxSize: 5,
          },
          styling: {
            width: "half",
          },
        },
        {
          id: "field_profile_photo",
          label: "Profile Photo (Optional)",
          type: "FILE",
          required: false,
          order: 4,
          sectionId: "section_additional_info",
          props: {
            accept: ".jpg,.jpeg,.png,.webp",
            multiple: false,
            maxSize: 2,
          },
          styling: {
            width: "half",
          },
        },
        {
          id: "field_signature",
          label: "Digital Signature",
          type: "SIGNATURE",
          required: false,
          order: 5,
          sectionId: "section_additional_info",
          styling: {
            width: "full",
          },
        },
      ],
    },
    {
      id: "section_agreement",
      title: "Terms and Agreement",
      description: "Please review and accept our terms",
      order: 4,
      formId: "form_2024_user_registration",
      styling: {
        collapsible: false,
        showTitle: true,
      },
      fields: [
        {
          id: "field_terms_acceptance",
          label: "I agree to the Terms and Conditions",
          type: "CHECKBOX",
          required: true,
          order: 0,
          sectionId: "section_agreement",
          options: [
            {
              id: "terms_agree",
              label:
                "I have read and agree to the Terms and Conditions and Privacy Policy",
              value: "agree",
            },
          ],
          styling: {
            width: "full",
          },
        },
        {
          id: "field_marketing_consent",
          label: "Marketing Communications",
          type: "CHECKBOX",
          required: false,
          order: 1,
          sectionId: "section_agreement",
          options: [
            {
              id: "marketing_email",
              label:
                "I would like to receive email updates about future events and news",
              value: "email_updates",
            },
            {
              id: "marketing_sms",
              label:
                "I would like to receive SMS notifications about urgent event updates",
              value: "sms_updates",
            },
          ],
          styling: {
            width: "full",
          },
        },
        {
          id: "field_verification_code",
          label: "Verification Code",
          placeholder: "Enter 6-digit code sent to your email",
          type: "OTP",
          required: true,
          order: 2,
          sectionId: "section_agreement",
          props: {
            length: 6,
          },
          styling: {
            width: "half",
          },
        },
      ],
    },
  ],
};

// Example of a simpler form configuration
export const simpleContactFormConfig = {
  id: "form_simple_contact",
  name: "Contact Us",
  description: "Get in touch with our team",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
  settings: {
    allowMultipleSubmissions: true,
    requireAuthentication: false,
    showProgressBar: false,
    submitButtonText: "Send Message",
    successMessage: "Thank you for your message! We'll get back to you soon.",
  },
  sections: [
    {
      id: "section_contact_info",
      order: 0,
      formId: "form_simple_contact",
      fields: [
        {
          id: "field_contact_name",
          label: "Your Name",
          placeholder: "Enter your full name",
          type: "INPUT",
          required: true,
          order: 0,
          sectionId: "section_contact_info",
          styling: { width: "half" },
        },
        {
          id: "field_contact_email",
          label: "Email Address",
          placeholder: "your.email@example.com",
          type: "INPUT",
          required: true,
          order: 1,
          sectionId: "section_contact_info",
          validation: { email: true },
          styling: { width: "half" },
        },
        {
          id: "field_contact_subject",
          label: "Subject",
          type: "SELECT",
          required: true,
          order: 2,
          sectionId: "section_contact_info",
          options: [
            { id: "subj_general", label: "General Inquiry", value: "general" },
            {
              id: "subj_support",
              label: "Technical Support",
              value: "support",
            },
            { id: "subj_feedback", label: "Feedback", value: "feedback" },
            {
              id: "subj_partnership",
              label: "Partnership",
              value: "partnership",
            },
          ],
          styling: { width: "full" },
        },
        {
          id: "field_contact_message",
          label: "Message",
          placeholder: "Please describe your inquiry...",
          type: "TEXTAREA",
          required: true,
          order: 3,
          sectionId: "section_contact_info",
          validation: { minLength: 10, maxLength: 1000 },
          styling: { width: "full" },
          props: { rows: 5 },
        },
      ],
    },
  ],
};

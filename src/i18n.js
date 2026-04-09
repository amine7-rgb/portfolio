export const translations = {
  en: {
    nav: {
      label: "Main navigation",
      light: "Light",
      dark: "Dark",
      links: [
        { href: "#services", label: "Services" },
        { href: "#stack", label: "Stack" },
        { href: "#projects", label: "Work" },
        { href: "#process", label: "Process" },
        { href: "#contact", label: "Contact" }
      ]
    },
    hero: {
      aria: "Portfolio hero",
      eyebrow: "Freelance web engineer",
      title: "I build fast, reliable web products with ",
      roles: ["React and Node.js", "AI chatbots", "MongoDB backends", "CI/CD pipelines", "Laravel and WordPress"],
      copy: "From idea to deployment, I help founders and teams ship clean platforms, dashboards, AI assistants, storefronts, and business tools.",
      primary: "Start a project",
      secondary: "View selected work",
      metricsLabel: "Professional highlights",
      metrics: [
        { value: "8+", label: "Core technologies" },
        { value: "Full", label: "Stack delivery" },
        { value: "CI/CD", label: "Deployment ready" }
      ],
      slider: "Hero slides",
      slide: "Go to slide"
    },
    services: {
      eyebrow: "What clients hire me for",
      title: "Professional sections that make your freelance offer clear",
      copy: "A strong portfolio should sell trust quickly: what you do, how you deliver, proof of work, and a direct way to start a conversation.",
      items: [
        {
          kicker: "01",
          title: "Full-stack web apps",
          copy: "React, Angular, Node.js, Spring Boot, Laravel, MongoDB, and SQL for products that need real business logic."
        },
        {
          kicker: "02",
          title: "Freelance delivery",
          copy: "Clear scope, clean milestones, responsive communication, and deployment-ready handoff for clients."
        },
        {
          kicker: "03",
          title: "CMS and commerce",
          copy: "WordPress builds, landing pages, dashboards, integrations, and maintainable content workflows."
        },
        {
          kicker: "04",
          title: "AI and automation",
          copy: "AI models, chatbots, smart workflows, and business automation connected to polished web products."
        }
      ]
    },
    stack: {
      eyebrow: "Technical stack",
      title: "Tools I use to ship dependable web and AI systems"
    },
    projects: {
      eyebrow: "Selected work",
      title: "Real projects built across AI, dashboards, marketplaces, and booking systems",
      copy: "A curated timeline of my strongest work, from an award-winning smart agriculture platform to production freelance products.",
      showMore: "Show more",
      showLess: "Show less",
      stackLabel: "Project technologies",
      items: [
        {
          type: "Award-winning smart agriculture",
          year: "2023",
          title: "Agricole",
          badge: "Best Full Stack JavaScript Project - Bal des Projets 2023",
          description:
            "Agricole is a modern smart-farming platform built for intelligent land management. It includes a dashboard for field statistics such as temperature, humidity, sensor readings, and farmer objectives, connected to Arduino Uno sensors. The platform also includes a marketplace to sell or rent agricultural equipment and field products, an AI optimization module that receives a land schema and recommends the required equipment count and placement to reduce cost using KNN and SVM, image recognition to identify plants and return useful descriptions, and facial-recognition login designed to make access easier for older farmers.",
          technologies: ["React.js", "Node.js", "MongoDB", "Arduino Uno", "KNN", "SVM", "AI Vision", "Face Recognition"],
          image: "/projects/agricom-logo.png",
          mediaContain: true,
          links: [
            {
              label: "Watch scenario",
              href: "https://youtube.com/watch?v=PdE9L7UQRMg&feature=share&fbclid=IwY2xjawRCXsdleHRuA2FlbQIxMQBzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEenNBgWUydAF1NfY6YFRvfBHnXjSQXqN1tpuw9i22bgtEBeHIdTuXM2PxGtp4_aem_Z-oNaPVL8eE0ancQYiJR5w"
            }
          ],
          proofsLabel: "Award proof",
          proofLinks: [
            { label: "Certificate of excellence", href: "/projects/agricole-certificate-proof.jpg" },
            { label: "Participation attestation", href: "/projects/agricole-attestation-proof.jpg" }
          ]
        },
        {
          type: "PFE / Intelligent dashboard",
          year: "2024",
          title: "Save Your Wardrobe",
          badge: "Federated analytics and anomaly detection",
          description:
            "During my PFE at Save Your Wardrobe, I created an intelligent dashboard connected to a federated database that groups data from multiple websites at the same time. I integrated an AI model to detect anomalies in orders and added advanced dashboard features such as saved views, grouped status filters, and multi-filter workflows to make operational analysis faster and more reliable.",
          technologies: ["NestJS", "React.js", "MongoDB", "Flask", "Python", "AI Anomaly Detection", "Federated Database"],
          image: "/projects/save-your-wardrobe.avif",
          links: []
        },
        {
          type: "Import/export business platform",
          year: "2025",
          title: "Tragana United",
          badge: "Live production website",
          description:
            "Tragana United is an import/export website for heavy machinery targeting construction and Gulf-region clients. The website presents available machines, lets users compose a machine request, sends a quote workflow and confirmation email, includes a contact section for direct company communication, and adds a chatbot to improve UX and guide visitors through the platform. The website supports Arabic and English for its target market.",
          technologies: ["React.js", "Vite", "Node.js", "MongoDB", "Chatbot", "Email Workflow", "Multilingual"],
          image: "/projects/tragana-united.mp4",
          mediaType: "video",
          links: [{ label: "Visit website", href: "https://tragana-united.com/" }]
        },
        {
          type: "Booking and event platform",
          year: "2025",
          title: "Tata-Islem",
          badge: "Reservations, payments, invoices, and admin workflow",
          description:
            "Tata-Islem is a booking platform for services and events with online PayPal payment. After reservation, users receive a confirmation email, an automatically generated invoice, and an event ticket. The platform includes a chatbot to improve navigation, a contact section for the admin, a dynamic dashboard, automatic Meet link generation after booking a service, a calendar for appointment management, and a full user/admin workflow to organize reservation dates, services, and events.",
          technologies: ["React.js", "Vite", "Node.js", "MongoDB", "PayPal", "Chatbot", "Calendar", "Email Automation"],
          image: "/projects/tata-islem-logo.jpeg",
          links: [{ label: "Visit website", href: "https://tata-islem.com/" }]
        }
      ]
    },
    process: {
      eyebrow: "Delivery process",
      title: "A simple workflow clients can trust",
      steps: [
        { title: "Discovery", copy: "Goals, users, constraints, and success criteria become a clear technical scope." },
        { title: "Build", copy: "Core features, integrations, responsive UI, backend logic, and database models move together." },
        { title: "Launch", copy: "Deployment, CI/CD checks, environment setup, and documentation prepare the project for handoff." }
      ]
    },
    contact: {
      eyebrow: "Contact",
      title: "Tell me what you want to build",
      copy: "Share the project idea, deadline, stack preference, and budget range. I will reply with a practical next step.",
      name: "Name",
      email: "Email",
      company: "Company",
      budget: "Budget",
      budgetPlaceholder: "Select a range",
      budgetOptions: ["Small fix", "$500 - $1,500", "$1,500 - $5,000", "$5,000+"],
      message: "Project details",
      submit: "Send message",
      sending: "Sending...",
      success: "Message sent. I will get back to you soon.",
      error: "Message could not be sent. Check the API and MongoDB connection.",
      closeToast: "Close notification"
    },
    assistant: {
      avatarAlt: "Project discovery assistant avatar",
      teaserEyebrow: "New assistant",
      teaserTitle: "Need help explaining your project?",
      teaserCopy: "Share a few simple points and I will turn them into a clear project brief you can send directly.",
      dismissTeaser: "Dismiss assistant teaser",
      openAssistant: "Open project assistant",
      closeAssistant: "Close project assistant",
      panelEyebrow: "Interactive mini-product",
      panelTitle: "Idea to Brief Assistant",
      welcomeTitle: "From rough idea to clear brief",
      welcomeCopy: "You do not need technical language. Pick a direction, describe the idea in simple words, and I will structure it into a professional project brief.",
      stepLabel: "Step",
      ideaTitle: "What do you want to build?",
      ideaPrompt: "Write a few bullets, rough notes, or one simple paragraph. The assistant will turn it into a cleaner project scope.",
      ideaPlaceholder:
        "Example:\n- website for my company\n- online payment\n- admin dashboard\n- Arabic and English\n- maybe chatbot later",
      ideaCaptured: "Raw project idea",
      projectTypeLabel: "Project type options",
      startBrief: "Build my brief",
      audienceTitle: "Who is this for?",
      audiencePrompt: "Describe the main users, clients, or internal team that will use the product.",
      audiencePlaceholder: "Example: small business owners, internal operations team, customers booking a service",
      firstActionTitle: "What should users do first?",
      firstActionPrompt: "Tell me the first important action the user should be able to take.",
      firstActionPlaceholder: "Example: request a quote, book a session, browse machines, pay online",
      requirementsTitle: "What should be included?",
      requirementsPrompt: "Select any important requirements. You can change these later after the brief is generated.",
      timelineTitle: "What is the preferred timeline?",
      timelinePrompt: "Choose the expected delivery rhythm. This helps shape the scope and complexity.",
      continue: "Continue",
      skip: "Skip for now",
      generateBrief: "Generate my brief",
      generatingTitle: "Thinking through your project",
      generatingCopy: "The assistant is shaping a clearer version of the idea and checking the best structure for the brief.",
      generatedTitle: "Your first structured brief is ready",
      generatedCopy: "This is a stronger version of the idea, ready for discussion, estimation, and project planning.",
      noSpecialRequirements: "No extra requirements selected yet.",
      skippedAnswer: "Skipped for now.",
      refineLabel: "Refine the scope instantly",
      sendTitle: "Send this brief to Amine",
      sendCopy: "The assistant will send both your rough idea and the generated brief to email and MongoDB.",
      sendBrief: "Send brief",
      sending: "Sending brief...",
      submitSuccess: "Brief sent successfully. Amine now has a clearer view of the project.",
      submitError: "The assistant could not send the brief right now.",
      successTitle: "Brief sent successfully",
      successCopy: "Your idea and the generated project brief are now ready for the next conversation.",
      startAnother: "Start another brief",
      startOver: "Start over",
      summaryLabels: {
        projectType: "Project type",
        timeline: "Timeline",
        complexity: "Complexity",
        engine: "Engine"
      },
      aiMode: "OpenAI brief",
      backupMode: "Structured backup",
      engineLabel: "Generation mode",
      engineAiCopy: "This brief was generated with the live OpenAI model",
      engineFallbackCopy: "The assistant is using the local structured backup until the OpenAI key is configured or available.",
      sections: {
        overview: "Project overview",
        goal: "Business goal",
        users: "Target users",
        features: "Core features",
        modules: "Pages / modules",
        admin: "Admin and back office",
        ai: "AI and automation opportunities",
        stack: "Suggested stack",
        deployment: "Deployment and CI/CD",
        questions: "Questions to confirm"
      },
      form: {
        name: "Full name",
        email: "Email",
        company: "Company",
        budget: "Budget",
        budgetPlaceholder: "Select a range",
        notes: "Additional note"
      }
    },
    footer: {
      name: "Mohamed Amine Oudi",
      copy: "Freelance full-stack engineer for web platforms, automation, AI chatbots, and deployment-ready products.",
      linksLabel: "Footer contact links",
      qrEyebrow: "Quick access",
      qrTitle: "Scan to open my portfolio",
      qrCopy: "Use your camera to open the live website instantly.",
      qrAlt: "QR code linking to Mohamed Amine Oudi portfolio",
      links: {
        email: "Email",
        linkedin: "LinkedIn",
        github: "GitHub"
      },
      copyright: "Copyright 2026 Mohamed Amine Oudi. All rights reserved."
    }
  },
  ar: {
    nav: {
      label: "التنقل الرئيسي",
      light: "فاتح",
      dark: "داكن",
      links: [
        { href: "#services", label: "الخدمات" },
        { href: "#stack", label: "التقنيات" },
        { href: "#projects", label: "الأعمال" },
        { href: "#process", label: "المنهجية" },
        { href: "#contact", label: "تواصل" }
      ]
    },
    hero: {
      aria: "واجهة الملف المهني",
      eyebrow: "مهندس ويب مستقل",
      title: "أبني منتجات ويب سريعة وموثوقة باستخدام ",
      roles: ["React و Node.js", "MongoDB للواجهات الخلفية", "مسارات CI/CD", "Laravel و WordPress"],
      copy: "من الفكرة إلى النشر، أساعد الفرق والعملاء على إطلاق منصات ولوحات تحكم ومتاجر وأدوات أعمال بجودة عالية.",
      primary: "ابدأ مشروعا",
      secondary: "شاهد الأعمال",
      metricsLabel: "نقاط مهنية",
      metrics: [
        { value: "+8", label: "تقنيات أساسية" },
        { value: "Full", label: "تنفيذ متكامل" },
        { value: "CI/CD", label: "جاهز للنشر" }
      ],
      slider: "شرائح الواجهة",
      slide: "انتقل إلى الشريحة"
    },
    services: {
      eyebrow: "ما أقدمه للعملاء",
      title: "أقسام احترافية تجعل عرضك كمستقل واضحا",
      copy: "الملف المهني القوي يبني الثقة بسرعة: ماذا تقدم، كيف تنجز، ما الدليل، وكيف يبدأ العميل الحديث معك.",
      items: [
        {
          kicker: "01",
          title: "تطبيقات ويب متكاملة",
          copy: "React و Angular و Node.js و Spring Boot و Laravel و MongoDB و SQL لمنتجات تحتاج منطق أعمال حقيقي."
        },
        {
          kicker: "02",
          title: "تنفيذ مشاريع مستقلة",
          copy: "نطاق واضح، مراحل منظمة، تواصل سريع، وتسليم جاهز للنشر للعميل."
        },
        {
          kicker: "03",
          title: "مواقع وإدارة محتوى",
          copy: "WordPress وصفحات هبوط ولوحات تحكم وتكاملات ومسارات محتوى سهلة الصيانة."
        },
        {
          kicker: "04",
          title: "أساسيات DevOps",
          copy: "مسارات CI/CD، إعداد البيئات، فحوصات النشر، وتدفق إصدار مناسب للإنتاج."
        }
      ]
    },
    stack: {
      eyebrow: "التقنيات",
      title: "أدوات أستخدمها لبناء أنظمة ويب موثوقة"
    },
    projects: {
      eyebrow: "أعمال مختارة",
      title: "استبدل هذه النماذج بأقوى مشاريعك كمستقل",
      copy: "استخدم من ثلاثة إلى ستة دراسات حالة مع النتائج والتقنيات وسياق العميل وروابط مباشرة عند توفرها.",
      items: [
        {
          type: "لوحة SaaS",
          title: "منصة تحليلات تشغيلية",
          stack: "React, Node.js, MongoDB, CI/CD",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80"
        },
        {
          type: "موقع أعمال",
          title: "موقع شركة موجه للتحويل",
          stack: "WordPress, Laravel, SQL",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
        },
        {
          type: "منصة عميل",
          title: "مسار حجز آمن",
          stack: "Angular, Spring Boot, SQL",
          image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80"
        }
      ]
    },
    process: {
      eyebrow: "منهجية التسليم",
      title: "سير عمل بسيط يثق به العملاء",
      steps: [
        { title: "استكشاف", copy: "الأهداف والمستخدمون والقيود ومعايير النجاح تتحول إلى نطاق تقني واضح." },
        { title: "بناء", copy: "الميزات والتكاملات والواجهة والمنطق الخلفي ونماذج البيانات تتحرك معا." },
        { title: "إطلاق", copy: "النشر وفحوصات CI/CD وإعداد البيئة والتوثيق تجهز المشروع للتسليم." }
      ]
    },
    contact: {
      eyebrow: "تواصل",
      title: "أخبرني بما تريد بناءه",
      copy: "شارك فكرة المشروع والموعد والتقنيات والميزانية. سأرد عليك بخطوة عملية واضحة.",
      name: "الاسم",
      email: "البريد الإلكتروني",
      company: "الشركة",
      budget: "الميزانية",
      budgetPlaceholder: "اختر النطاق",
      budgetOptions: ["تعديل صغير", "$500 - $1,500", "$1,500 - $5,000", "$5,000+"],
      message: "تفاصيل المشروع",
      submit: "إرسال",
      sending: "جار الإرسال...",
      success: "تم إرسال الرسالة. سأعود إليك قريبا.",
      error: "تعذر إرسال الرسالة. تحقق من API واتصال MongoDB."
    },
    footer: {
      name: "Mohamed Amine Oudi",
      copy: "Freelance full-stack engineer for web platforms, automation, AI chatbots, and deployment-ready products.",
      linksLabel: "Footer contact links",
      qrEyebrow: "Quick access",
      qrTitle: "Scan to open my portfolio",
      qrCopy: "Use your camera to open the live website instantly.",
      qrAlt: "QR code linking to Mohamed Amine Oudi portfolio",
      links: {
        email: "Email",
        linkedin: "LinkedIn",
        github: "GitHub"
      },
      copyright: "Copyright 2026 Mohamed Amine Oudi. All rights reserved."
    }
  }
};

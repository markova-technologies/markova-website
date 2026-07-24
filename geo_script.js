const fs = require("fs");
let html = fs.readFileSync("public/index.html", "utf8");

// Add definition text right after the hero-description paragraph
html = html.replace(
    '<p class="hero-description">\n                        Markova gives businesses an AI workforce that can understand their operations, coordinate specialized AI workers, take real actions, and work alongside human teams.\n                    </p>',
    `<p class="hero-description" style="display: none;">Markova is an AI workforce operating system that connects specialized agents to perform real business operations.</p>
                    <p class="hero-description">
                        Markova gives businesses an AI workforce that can understand their operations, coordinate specialized AI workers, take real actions, and work alongside human teams.
                    </p>`
);

// Replace FAQ structured data
const newFaq = `    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Markova?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Markova is an AI workforce operating system that allows businesses to deploy specialized AI agents capable of understanding business context, executing tasks across connected systems, and collaborating with human teams."
      }
    },
    {
      "@type": "Question",
      "name": "What is Pulse?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pulse is an upcoming intelligent product developed by Markova, designed to integrate seamlessly into our AI workforce ecosystem."
      }
    },
    {
      "@type": "Question",
      "name": "Does Markova support Amharic?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Markova builds multilingual AI systems, including robust support for Amharic and localized voice agents for the African market."
      }
    },
    {
      "@type": "Question",
      "name": "Who is Markova for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Markova is for any enterprise, local business, or organization looking to scale their operations by hiring AI employees instead of relying on basic software automation."
      }
    }
  ]
}
</script>`;

html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, newFaq);

// Replace Org structured data
const newOrg = `<!-- GEO structured data -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Markova",
    "url": "https://markova.tech",
    "logo": "https://markova.tech/favicon.ico",
    "description": "Markova is an AI workforce operating system that connects specialized agents to perform real business operations.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Addis Ababa",
      "addressLocality": "Addis Ababa",
      "addressCountry": "Ethiopia"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+251920002789",
      "contactType": "customer support",
      "areaServed": "Worldwide",
      "availableLanguage": ["en", "am"]
    },
    "sameAs": [
      "https://t.me/officialmarkova",
      "https://x.com/0fficialmarkova",
      "https://www.facebook.com/share/1H5nKXCg1V/",
      "https://www.instagram.com/official_markova/"
    ]
  }
  </script>`;

html = html.replace(/<!-- GEO structured data -->[\s\S]*?<\/script>/, newOrg);

fs.writeFileSync("public/index.html", html, "utf8");
console.log("GEO updated successfully.");

// src/data/charity_info.js

export const charity_info = {
  "american-red-cross": {
    trustScore: 88,
    category: "Disaster Relief",
    website: "https://www.redcross.org",
    bannerUrl: "../../public/images/redcross_banner.jpg",
    mission: "To prevent and alleviate human suffering in the face of emergencies by mobilizing the power of volunteers and the generosity of donors.",
    impactStatement: "Since 1881, the Red Cross has saved countless lives during disasters and emergencies.",

    impact: {
      fundsTracked: "$12.4M",
      programs: "Emergency Relief • Disaster Response • Training",
      lastUpdate: "Jan 17, 2026",
      donorCount: "45,000+",
      averageDonation: "$87",
    },

    recentActivity: [
      { ts: "2026-01-17", type: "Funds released", detail: "$1.2M released after receipt verification" },
      { ts: "2026-01-15", type: "Receipt verified", detail: "Disaster relief supply invoices approved" },
      { ts: "2026-01-13", type: "Donation received", detail: "$450K USDC escrowed" },
    ],
  },

  "united-way": {
    trustScore: 64,
    category: "Community Development",
    website: "https://www.unitedway.org",
    bannerUrl: "../../public/images/unitedway_banner.png",
    mission: "To improve lives by mobilizing the caring power of communities to strengthen education, financial stability, and health.",
    impactStatement: "Connecting corporate and individual donors to local causes that create lasting community impact.",

    impact: {
      fundsTracked: "$6.1M",
      programs: "Education • Financial Stability • Health",
      lastUpdate: "Jan 14, 2026",
      donorCount: "28,000+",
      averageDonation: "$218",
    },

    recentActivity: [
      { ts: "2026-01-16", type: "Update posted", detail: "Community impact report published" },
      { ts: "2026-01-14", type: "Receipt pending", detail: "Awaiting documentation for outreach spend" },
      { ts: "2026-01-12", type: "Donation received", detail: "$320K escrowed" },
    ],
  },

  "unicef-usa": {
    trustScore: 91,
    category: "Children & Education",
    website: "https://www.unicefusa.org",
    bannerUrl: "../../public/images/unicef_banner.jpeg",
    mission: "Providing emergency aid and developmental assistance to children and mothers in developing countries.",
    impactStatement: "Reaching 190+ countries to ensure every child survives and thrives in a safe, healthy environment.",

    impact: {
      fundsTracked: "$18.9M",
      programs: "Child Protection • Education • Health",
      lastUpdate: "Jan 18, 2026",
      donorCount: "65,000+",
      averageDonation: "$290",
    },

    recentActivity: [
      { ts: "2026-01-18", type: "Funds released", detail: "$2.3M released for education programs" },
      { ts: "2026-01-16", type: "Receipt verified", detail: "School supply purchases verified" },
      { ts: "2026-01-14", type: "Donation received", detail: "$900K escrowed" },
    ],
  },

  "doctors-without-borders": {
    trustScore: 85,
    category: "Healthcare",
    website: "https://www.doctorswithoutborders.org",
    bannerUrl: "../../public/images/dwob_banner.png",
    mission: "To deliver medical aid to people affected by conflict, natural disasters, and epidemics.",
    impactStatement: "Operating in 70+ countries, providing critical healthcare regardless of political boundaries.",

    impact: {
      fundsTracked: "$14.2M",
      programs: "Emergency Medicine • Vaccination • Mental Health",
      lastUpdate: "Jan 18, 2026",
      donorCount: "35,000+",
      averageDonation: "$405",
    },

    recentActivity: [
      { ts: "2026-01-18", type: "Funds released", detail: "$1.8M released for medical supplies" },
      { ts: "2026-01-16", type: "Receipt verified", detail: "Medical equipment purchases verified" },
      { ts: "2026-01-14", type: "Donation received", detail: "$600K escrowed" },
    ],
  },

  "save-the-children": {
    trustScore: 82,
    category: "Children & Education",
    website: "https://www.savethechildren.org",
    bannerUrl: "../../public/images/stc_logo.png",
    mission: "Committed to achieving immediate and lasting change in the lives of disadvantaged children.",
    impactStatement: "Protecting and empowering children in over 120 countries worldwide.",

    impact: {
      fundsTracked: "$16.7M",
      programs: "Child Protection • Education • Emergency Response",
      lastUpdate: "Jan 18, 2026",
      donorCount: "52,000+",
      averageDonation: "$321",
    },

    recentActivity: [
      { ts: "2026-01-18", type: "Funds released", detail: "$2.1M released for child welfare programs" },
      { ts: "2026-01-16", type: "Receipt verified", detail: "Educational materials approved" },
      { ts: "2026-01-14", type: "Donation received", detail: "$750K escrowed" },
    ],
  },

  "feeding-america": {
    trustScore: 91,
    category: "Food Security",
    website: "https://www.feedingamerica.org",
    bannerUrl: "../../public/images/fa-social.png",
    mission: "To feed America's hungry through a nationwide network of member food banks.",
    impactStatement: "Providing 4.3 billion meals annually to families struggling with food insecurity.",

    impact: {
      fundsTracked: "$21.3M",
      programs: "Food Distribution • Nutrition Support • Community Programs",
      lastUpdate: "Jan 18, 2026",
      donorCount: "78,000+",
      averageDonation: "$273",
    },

    recentActivity: [
      { ts: "2026-01-18", type: "Funds released", detail: "$2.8M released for food distribution" },
      { ts: "2026-01-16", type: "Receipt verified", detail: "Food supply invoices approved" },
      { ts: "2026-01-14", type: "Donation received", detail: "$1.2M escrowed" },
    ],
  },
};

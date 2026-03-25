import type { Core } from '@strapi/strapi';

async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) return;

  const contentTypes = [
    'api::testimonial.testimonial',
    'api::news-item.news-item',
    'api::team-member.team-member',
    'api::hero-banner.hero-banner',
    'api::concept-section.concept-section',
    'api::concept-item.concept-item',
    'api::fee-section.fee-section',
  ];

  const actions = ['find', 'findOne'];

  const existing = await strapi.query('plugin::users-permissions.permission').findMany({
    where: { role: publicRole.id },
  });

  for (const ct of contentTypes) {
    for (const action of actions) {
      const actionKey = `${ct}.${action}`;
      const found = existing.find((p: any) => p.action === actionKey);
      if (!found) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: actionKey, role: publicRole.id, enabled: true },
        });
      } else if (!found.enabled) {
        await strapi.query('plugin::users-permissions.permission').update({
          where: { id: found.id },
          data: { enabled: true },
        });
      }
    }
  }
}

async function seedData(strapi: Core.Strapi) {
  const testimonialCount = await strapi.query('api::testimonial.testimonial').count({});
  if (testimonialCount === 0) {
    const testimonials = [
      {
        name: 'Rajesh Mehta',
        quote: 'Criskros transformed our annual sports day into something truly exceptional. The multi-sport format pushed every team member out of their comfort zone in the best possible way.',
        designation: 'HR Director',
        company: 'TechVision India',
        publishedAt: new Date(),
      },
      {
        name: 'Priya Nair',
        quote: 'We had 7 people from completely different departments come together and win. Criskros is not just sport — it\'s the best team-building experience we\'ve had in years.',
        designation: 'CEO',
        company: 'Nexus Solutions',
        publishedAt: new Date(),
      },
      {
        name: 'Arun Sharma',
        quote: 'The concept of smart sports is brilliant. Strategy and fitness combined — it levels the playing field and makes everyone feel they can contribute meaningfully.',
        designation: 'Operations Head',
        company: 'Pinnacle Corp',
        publishedAt: new Date(),
      },
    ];
    for (const t of testimonials) {
      await strapi.query('api::testimonial.testimonial').create({ data: t });
    }
  }

  const newsCount = await strapi.query('api::news-item.news-item').count({});
  if (newsCount === 0) {
    const news = [
      {
        title: 'Criskros Season 1 Registration Now Open',
        date: new Date('2026-03-01'),
        description: 'We are thrilled to announce that registrations for the inaugural Criskros season are now open. Teams from across India are invited to participate in this unique multi-sport corporate event.',
        category: 'Announcement',
        publishedAt: new Date(),
      },
      {
        title: 'What Makes Criskros Different from Regular Sports Days',
        date: new Date('2026-02-15'),
        description: 'Unlike traditional corporate sports events, Criskros combines multiple disciplines with strategy and team dynamics. Here\'s a deep dive into what makes it truly smart sports.',
        category: 'Feature',
        publishedAt: new Date(),
      },
      {
        title: 'Venue Announcement: Criskros Season 1 Location Confirmed',
        date: new Date('2026-02-01'),
        description: 'We are pleased to announce the venue for the first Criskros event. A world-class multi-sport facility has been confirmed, offering state-of-the-art infrastructure for all disciplines.',
        category: 'Event Update',
        publishedAt: new Date(),
      },
    ];
    for (const n of news) {
      await strapi.query('api::news-item.news-item').create({ data: n });
    }
  }

  const memberCount = await strapi.query('api::team-member.team-member').count({});
  if (memberCount === 0) {
    const members = [
      {
        name: 'Vikram Anand',
        role: 'Founder & CEO',
        bio: 'Former national-level athlete and corporate leader with 20+ years of experience. Vikram conceived Criskros to bridge the gap between corporate wellness and competitive sport.',
        memberType: 'management',
        order: 1,
        publishedAt: new Date(),
      },
      {
        name: 'Sunita Reddy',
        role: 'Co-Founder & COO',
        bio: 'Sports management professional with expertise in large-scale event operations. Sunita brings unmatched organizational excellence to every Criskros event.',
        memberType: 'management',
        order: 2,
        publishedAt: new Date(),
      },
      {
        name: 'Kiran Patel',
        role: 'Head of Partnerships',
        bio: 'Corporate partnership specialist with a deep passion for sports. Kiran builds the bridges between organizations and the Criskros community.',
        memberType: 'management',
        order: 3,
        publishedAt: new Date(),
      },
      {
        name: 'Dr. Arvind Rao',
        role: 'Sports Science Advisor',
        bio: 'PhD in Sports Science and former Olympic coach. Dr. Rao advises on the multi-sport format to ensure Criskros is both challenging and safe for all participants.',
        memberType: 'mentor',
        order: 1,
        publishedAt: new Date(),
      },
      {
        name: 'Meena Krishnan',
        role: 'Business Strategy Advisor',
        bio: 'Serial entrepreneur and angel investor. Meena brings strategic vision to Criskros\'s growth plans and corporate outreach programs.',
        memberType: 'advisor',
        order: 1,
        publishedAt: new Date(),
      },
    ];
    for (const m of members) {
      await strapi.query('api::team-member.team-member').create({ data: m });
    }
  }

  // Seed Hero Banner using document service (creates draft + publishes, so admin shows data)
  const docs = strapi as any;
  const heroBannerDraft = await docs.documents('api::hero-banner.hero-banner').findFirst({ status: 'draft' });
  if (!heroBannerDraft) {
    const hb = await docs.documents('api::hero-banner.hero-banner').create({
      data: {
        headline: 'The Ultimate Smart Sports Experience',
        highlightText: 'Smart Sports',
        subheadline: 'Where corporate teams battle across multiple sports disciplines. It\'s not just about athletic prowess—it\'s about strategy, teamwork, and dynamic execution.',
        primaryCtaText: 'Register Your Team',
        primaryCtaUrl: '#register',
        secondaryCtaText: 'Watch Trailer',
        secondaryCtaUrl: '#concept',
      },
    });
    await docs.documents('api::hero-banner.hero-banner').publish({ documentId: hb.documentId });
  }

  // Seed Concept Section using document service
  const conceptSectionDraft = await docs.documents('api::concept-section.concept-section').findFirst({ status: 'draft' });
  if (!conceptSectionDraft) {
    const cs = await docs.documents('api::concept-section.concept-section').create({
      data: {
        sectionLabel: 'The Concept',
        heading: 'What is Criskros?',
        description: 'Criskros is an innovative multi-sport team event designed exclusively for organizations and corporates.',
        imageQuote: 'More than a game. It\'s a movement.',
        imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=1000',
      },
    });
    await docs.documents('api::concept-section.concept-section').publish({ documentId: cs.documentId });
  }

  // Seed Concept Items using document service
  const conceptItemCount = await strapi.query('api::concept-item.concept-item').count({});
  if (conceptItemCount === 0) {
    const items = [
      { title: 'Team of 7', description: 'Teams consist of exactly 7 members representing their organization. A mix of men and women is highly encouraged.', icon: 'users', colorVariant: 'primary', order: 1 },
      { title: 'Multi-Disciplinary', description: 'Compete across diverse sports disciplines. No single sport defines the champion.', icon: 'target', colorVariant: 'accent', order: 2 },
      { title: 'Smart Sports', description: 'It rewards strategy, team dynamics, and adaptability just as much as pure athletic strength.', icon: 'zap', colorVariant: 'primary', order: 3 },
    ];
    for (const item of items) {
      const ci = await docs.documents('api::concept-item.concept-item').create({ data: item });
      await docs.documents('api::concept-item.concept-item').publish({ documentId: ci.documentId });
    }
  }

  // Seed Fee Section using document service
  const feeSectionDraft = await docs.documents('api::fee-section.fee-section').findFirst({ status: 'draft' });
  if (!feeSectionDraft) {
    const fs = await docs.documents('api::fee-section.fee-section').create({
      data: {
        sectionLabel: 'Requirements',
        heading: 'Team & Fees',
        badgeText: 'Per Team',
        price: '₹1,50,000',
        priceUnit: '/ team',
        teamCompositionHeading: 'Team Composition',
        teamRules: 'Strictly 7 members per team\nAll members must belong to the same organization\nMix of men and women is highly encouraged',
        includedItems: 'Tournament entry for 7 players\nPremium custom team jerseys & kits\nAll professional sports equipment\nCatered meals and hydration stations\nAccess to networking gala\nProfessional media coverage of team',
        ctaText: 'Start Registration',
        ctaUrl: '#register',
        description: "Secure your organization's slot in the ultimate tournament.",
      },
    });
    await docs.documents('api::fee-section.fee-section').publish({ documentId: fs.documentId });
  }
}

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions(strapi);
    await seedData(strapi);
  },
};

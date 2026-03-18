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
}

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicPermissions(strapi);
    await seedData(strapi);
  },
};

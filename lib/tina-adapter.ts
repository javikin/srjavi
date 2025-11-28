// Adapter to convert simplified Tina JSON format to BlogPost format

export function tinaToBlogPost(tinaData: any) {
  // Helper to convert section paragraphs to content array
  // sectionKey is the key in the JSON (e.g., "section1", "section2")
  const sectionToContent = (section: any, sectionKey: string) => {
    const content = [];

    // Add callout if exists
    if (section.callout) {
      content.push({
        type: "callout",
        text: section.callout,
        jsonPath: `${sectionKey}.callout`,
      });
    }

    // Add all paragraphs
    let i = 1;
    while (section[`paragraph${i}`]) {
      content.push({
        type: "paragraph",
        text: section[`paragraph${i}`],
        emphasis: i === Object.keys(section).filter(k => k.startsWith('paragraph')).length,
        jsonPath: `${sectionKey}.paragraph${i}`,
      });
      i++;
    }

    return content;
  };

  return {
    meta: {
      title: tinaData.title,
      subtitle: tinaData.subtitle,
      date: tinaData.date,
      tags: tinaData.tags || [],
      readTime: tinaData.readTime,
    },
    hero: tinaData.hero,
    sections: [
      // Intro section
      {
        type: "intro",
        content: [
          {
            type: "quote",
            text: tinaData.intro?.quote,
            jsonPath: "intro.quote",
          },
          {
            type: "paragraph",
            text: tinaData.intro?.paragraph1,
            jsonPath: "intro.paragraph1",
          },
          {
            type: "paragraph",
            text: tinaData.intro?.paragraph2,
            emphasis: true,
            jsonPath: "intro.paragraph2",
          },
        ],
      },
      // Section 1
      {
        type: "section",
        title: tinaData.section1?.title,
        titleJsonPath: "section1.title",
        layout: "image-left",
        image: {
          src: "/images/journal/carrillo-studio/02-garden-nature.jpg",
          alt: "Jardín tropical exuberante en Carrillo",
          caption: "Descubrí lo mucho que disfruto estar cerca de la naturaleza",
        },
        content: sectionToContent(tinaData.section1 || {}, "section1"),
      },
      // Section 2 - Dual Voice (Two Worlds)
      {
        type: "section",
        title: tinaData.section2?.title,
        titleJsonPath: "section2.title",
        layout: "dual-voice",
        callout: tinaData.section2?.callout,
        calloutJsonPath: "section2.callout",
        content: sectionToContent(tinaData.section2 || {}, "section2"),
      },
      // Section 3
      {
        type: "section",
        title: tinaData.section3?.title,
        titleJsonPath: "section3.title",
        layout: "image-left",
        image: {
          src: "/images/journal/carrillo-studio/08-working-garden.jpg",
          alt: "Trabajando con laptop en el jardín",
          caption: "El jardín donde empiezan las mañanas con café y código",
        },
        content: sectionToContent(tinaData.section3 || {}, "section3"),
      },
      // Pull Quote
      {
        type: "pull-quote",
        text: tinaData.pullQuote,
        jsonPath: "pullQuote",
      },
      // Section 4 - Only include if it has content
      ...(tinaData.section4?.title || tinaData.section4?.paragraph1 ? [{
        type: "section",
        title: tinaData.section4?.title,
        titleJsonPath: "section4.title",
        layout: "three-column-photos",
        images: [
          {
            src: "/images/journal/carrillo-studio/04-room-before.jpg",
            alt: "Habitación antes de la transformación",
            caption: "Antes: Un espacio lleno de la historia de alguien más",
          },
          {
            src: "/images/journal/carrillo-studio/05-painting-process.jpg",
            alt: "Proceso de pintura",
            caption: "El trabajo de hacerlo mío",
          },
          {
            src: "/images/journal/carrillo-studio/06-cat-supervising.jpg",
            alt: "Gato supervisando el trabajo",
            caption: "con control de calidad del gato residente (ese día intenté robarme el gato y me atraparon)",
          },
          {
            src: "/images/journal/carrillo-studio/07-room-after.jpg",
            alt: "Habitación después de la transformación",
            caption: "Vacío, limpio y lleno de posibilidades. Listo para mi historia.",
          },
        ],
        content: sectionToContent(tinaData.section4 || {}, "section4"),
      }] : []),
      // Section 5 - Only include if it has content
      ...(tinaData.section5?.title || tinaData.section5?.paragraph1 ? [{
        type: "section",
        title: tinaData.section5?.title,
        titleJsonPath: "section5.title",
        layout: "image-left-wide",
        image: {
          src: "/images/journal/carrillo-studio/09-night-setup.jpg",
          alt: "Setup de trabajo nocturno",
          caption: "Las noches tranquilas son ideales para que las ideas fluyan sin interrupciones",
        },
        content: [
          {
            type: "paragraph",
            text: tinaData.section5?.paragraph1,
            jsonPath: "section5.paragraph1",
          },
          {
            type: "rhythm-box",
            title: tinaData.section5?.rhythmTitle,
            titleJsonPath: "section5.rhythmTitle",
            items: [
              {
                icon: "☀️",
                color: "mint",
                text: tinaData.section5?.morningText,
                jsonPath: "section5.morningText",
              },
              {
                icon: "🌤️",
                color: "coral",
                text: tinaData.section5?.afternoonText,
                jsonPath: "section5.afternoonText",
              },
              {
                icon: "🌙",
                color: "lavender",
                text: tinaData.section5?.nightText,
                jsonPath: "section5.nightText",
              },
            ],
          },
          {
            type: "paragraph",
            text: tinaData.section5?.closingText,
            jsonPath: "section5.closingText",
          },
        ],
      }] : []),
      // Closing
      {
        type: "closing",
        title: tinaData.closing?.title,
        titleJsonPath: "closing.title",
        content: sectionToContent(tinaData.closing || {}, "closing"),
      },
    ],
  };
}

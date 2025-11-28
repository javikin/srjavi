// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "content/posts",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "subtitle",
            label: "Subtitle",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true
          },
          {
            type: "string",
            name: "readTime",
            label: "Read Time (e.g., '9 min')"
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true
          },
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              {
                type: "image",
                name: "image",
                label: "Hero Image"
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text"
              }
            ]
          },
          {
            type: "object",
            name: "intro",
            label: "Introduction",
            fields: [
              {
                type: "string",
                name: "quote",
                label: "Opening Quote",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "string",
                name: "paragraph1",
                label: "First Paragraph",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "string",
                name: "paragraph2",
                label: "Second Paragraph (emphasis)",
                ui: {
                  component: "textarea"
                }
              }
            ]
          },
          {
            type: "object",
            name: "section1",
            label: "Section 1: De M\xE9rida al Limbo",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Section Title"
              },
              {
                type: "string",
                name: "paragraph1",
                label: "Paragraph 1",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph2",
                label: "Paragraph 2",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph3",
                label: "Paragraph 3",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph4",
                label: "Paragraph 4",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph5",
                label: "Paragraph 5",
                ui: { component: "textarea" }
              }
            ]
          },
          {
            type: "object",
            name: "section2",
            label: "Section 2: M\xE9rida",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Section Title"
              },
              {
                type: "string",
                name: "callout",
                label: "Callout",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph1",
                label: "Paragraph 1",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph2",
                label: "Paragraph 2",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph3",
                label: "Paragraph 3",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph4",
                label: "Paragraph 4",
                ui: { component: "textarea" }
              }
            ]
          },
          {
            type: "object",
            name: "section3",
            label: "Section 3: Vivir el Presente",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Section Title"
              },
              {
                type: "string",
                name: "paragraph1",
                label: "Paragraph 1",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph2",
                label: "Paragraph 2",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "callout",
                label: "Callout",
                ui: { component: "textarea" }
              }
            ]
          },
          {
            type: "string",
            name: "pullQuote",
            label: "Pull Quote",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "object",
            name: "section4",
            label: "Section 4: El Acto F\xEDsico",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Section Title"
              },
              {
                type: "string",
                name: "paragraph1",
                label: "Paragraph 1",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph2",
                label: "Paragraph 2",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "callout",
                label: "Callout",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph3",
                label: "Paragraph 3",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph4",
                label: "Paragraph 4",
                ui: { component: "textarea" }
              }
            ]
          },
          {
            type: "object",
            name: "section5",
            label: "Section 5: El Ritmo",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Section Title"
              },
              {
                type: "string",
                name: "rhythmTitle",
                label: "Rhythm Box Title"
              },
              {
                type: "string",
                name: "morningText",
                label: "Morning Text",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "string",
                name: "afternoonText",
                label: "Afternoon Text",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "string",
                name: "nightText",
                label: "Night Text",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "string",
                name: "closingText",
                label: "Closing Text",
                ui: {
                  component: "textarea"
                }
              }
            ]
          },
          {
            type: "object",
            name: "closing",
            label: "Closing Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title"
              },
              {
                type: "string",
                name: "paragraph1",
                label: "Paragraph 1",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph2",
                label: "Paragraph 2",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph3",
                label: "Paragraph 3",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph4",
                label: "Paragraph 4",
                ui: { component: "textarea" }
              },
              {
                type: "string",
                name: "paragraph5",
                label: "Paragraph 5",
                ui: { component: "textarea" }
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};

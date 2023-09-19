import { defineMongooseModel } from "#nuxt/mongoose";

export const Template = defineMongooseModel({
  name: "Template",
  schema: {
    name: String,
    html: String,
    design: {
      type: Object,
      required: true,
    },
  },
  options: { timestamps: true },
  hooks(schema) {},
});

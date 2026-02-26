import { checkSchema } from "express-validator";

export default checkSchema({
  search: {
    trim: true,
    customSanitizer: {
      options: (value: unknown) => {
        return value ? value : "";
      },
    },
  },
});

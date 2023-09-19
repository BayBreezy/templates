declare type AccordionItem = {
  title?: string;
  content?: string;
  value: string;
  disabled?: boolean;
  icon?: string;
};

declare type Template = {
  _id?: string;
  name?: string;
  html?: string;
  design: Object;
  createdAt?: Date;
  updatedAt?: Date;
};

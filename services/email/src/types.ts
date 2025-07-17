export type EmailTemplate = {
  type: string;
  email: string;
  link: string;
  firstName: string;
  lastName: string;
};

export type SendEmailPayload = {
  userId: string;
  tenantId: string;
  payload: EmailTemplate;
};

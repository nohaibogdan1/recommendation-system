export type SendEmailPayload = {
  userId: string;
  tenantId: string;
  payload: {
    type: string;
    email: string;
    link: string;
    firstName: string;
    lastName: string;
  };
};

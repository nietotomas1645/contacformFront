export interface ContactForm {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    comments: string;
    attachmentPath?: string;
  }
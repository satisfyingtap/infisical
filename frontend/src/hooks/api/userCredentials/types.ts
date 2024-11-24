export type TUserCredential = {
  id: string;
  type: "login" | "card" | "note";
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
} & (
  | {
      type: "login";
      url: string;
      username: string;
      password: string;
    }
  | {
      type: "card";
      cardholderName: string;
      number: string;
      expMonth: string;
      expYear: string;
      code: string;
    }
  | {
      type: "note";
      content: string;
    }
);

export type TCreatedSharedSecret = {
  id: string;
};

// Base type for creating any credential
export type TCreateUserCredentialRequest = {
  type: "login" | "card" | "note";
  name: string;
} & (
  | {
      type: "login";
      username: string;
      password: string;
    }
  | {
      type: "card";
      cardholderName: string;
      number: string;
      expMonth: string;
      expYear: string;
      code: string;
    }
  | {
      type: "note";
      content: string;
    }
);
export type TUpdateUserCredentialRequest = TCreateUserCredentialRequest & {
  id: string;
};

export type TDeleteUserCredentialRequest = {
  id: string;
};

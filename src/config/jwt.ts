import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const emailTokenSecret = process.env.EMAIL_TOKEN_SECRET;

type JWTOptions = {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  emailTokenSecret: string;
  accessTokenExpiresIn?: string | number;
  refreshTokenExpiresIn?: string | number;
  emailTokenExpiresIn?: string | number;
};

export type EncodedPayload = {
  id: string;
  email: string;
};

export type DecodedPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

class JWT {
  #accessTokenSecret: string;
  #refreshTokenSecret: string;
  #emailTokenSecret: string;
  #accessTokenExpiresIn: string | number;
  #refreshTokenExpiresIn: string | number;
  #emailTokenExpiresIn: string | number;

  constructor(options: JWTOptions) {
    if (
      !options.accessTokenSecret ||
      !options.refreshTokenSecret ||
      !options.emailTokenSecret
    ) {
      throw new Error(
        "accessTokenSecret, refreshTokenSecret & emailTokenSecret strings must all be provided"
      );
    } else if (
      typeof options.accessTokenSecret !== "string" ||
      typeof options.refreshTokenSecret !== "string" ||
      typeof options.emailTokenSecret !== "string"
    ) {
      throw new Error(
        "accessTokenSecret, refreshTokenSecret & emailTokenSecret must all be of string type"
      );
    }

    this.#accessTokenSecret = options.accessTokenSecret;
    this.#refreshTokenSecret = options.refreshTokenSecret;
    this.#emailTokenSecret = options.emailTokenSecret;
    this.#accessTokenExpiresIn = options.accessTokenExpiresIn || "1h";
    this.#refreshTokenExpiresIn = options.refreshTokenExpiresIn || "1d";
    this.#emailTokenExpiresIn = options.emailTokenExpiresIn || "1h";
  }

  generateAccessToken(payload: EncodedPayload) {
    return jwt.sign(payload, this.#accessTokenSecret, {
      expiresIn: this.#accessTokenExpiresIn,
    });
  }

  generateRefreshToken(payload: EncodedPayload) {
    return jwt.sign(payload, this.#refreshTokenSecret, {
      expiresIn: this.#refreshTokenExpiresIn,
    });
  }

  generateEmailToken(payload: EncodedPayload) {
    return jwt.sign(payload, this.#emailTokenSecret, {
      expiresIn: this.#emailTokenExpiresIn,
    });
  }

  verifyToken(token: string, type: "access" | "refresh" | "email") {
    try {
      const secret =
        type === "refresh"
          ? this.#refreshTokenSecret
          : type === "email"
          ? this.#emailTokenSecret
          : this.#accessTokenSecret;
      return jwt.verify(token, secret) as DecodedPayload;
    } catch (error) {
      return null;
    }
  }
}

let jsonwebtoken: JWT;

try {
  jsonwebtoken = new JWT({
    accessTokenSecret: accessTokenSecret as string,
    refreshTokenSecret: refreshTokenSecret as string,
    emailTokenSecret: emailTokenSecret as string,
  });
} catch (error) {
  console.log("JWT initialization error: ", (error as NativeError).message);
  process.exit(1);
}

export default jsonwebtoken;

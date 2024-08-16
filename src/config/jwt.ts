import jwt from "jsonwebtoken";

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET ||
  "2c7c540cf8cec4de43c93cf941df630a42b41ecf7f923686159a37549cdba0d8";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET ||
  "24fc5e816fe886a7bae6b91e1b634874ce0469fae4b73657e6aad51c6e22c6f1";
const emailTokenSecret =
  process.env.EMAIL_TOKEN_SECRET ||
  "24fc5e816fe886a7bae6b91e1b634874ce0469fae4b73657e6aad51c6e22c6f1";

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

const jsonwebtoken = new JWT({
  accessTokenSecret,
  refreshTokenSecret,
  emailTokenSecret,
});

export default jsonwebtoken;

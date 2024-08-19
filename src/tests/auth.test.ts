import { expect } from "chai";
import request from "supertest";
import app from "@/app";
import User from "@/models/userModel";
import jsonwebtoken from "@/config/jwt";

describe("User Authentication API", () => {
  let testUserOneEmailVerificationToken: string;
  const testEmailOne = "mocha.t.e.s.t.1567887@mocha.com";
  const testPassword = "some-password-does-little-matter";

  before(async () => {
    const user = new User({
      name: "Mocha mocha",
      email: testEmailOne,
      password: testPassword,
    });
    testUserOneEmailVerificationToken = user.generateEmailVerificationToken();
    await user.save();
  });

  after(async () => {
    await User.findOneAndDelete({ email: testEmailOne });
  });

  // Test email password login api
  describe("POST /api/auth/login", () => {
    it("should set an accessToken cookie on successful login", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testEmailOne,
        password: testPassword,
      });

      const cookies = res.headers["set-cookie"];
      expect(cookies).to.be.an("array");
      expect(cookies[0]).to.include("accessToken=");
    });

    it("should return status 200, an accessToken and a refreshToken for valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testEmailOne,
        password: testPassword,
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("accessToken");
      expect(res.body).to.have.property("refreshToken");

      const cookies = res.headers["set-cookie"];
      expect(cookies).to.be.an("array");
      expect(cookies[0]).to.include("accessToken=");
    });

    it("should return status 404 for invalid credentials, and do not set any cookie", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testEmailOne,
        password: "this-password-is-wrong",
      });
      const res2 = await request(app).post("/api/auth/login").send({
        email: "this.email.cannot.exist.616469@noMail.com",
        password: "who cares",
      });

      expect(res.status).to.equal(404);
      expect(res2.status).to.equal(404);
      expect(res.headers["set-cookie"]).to.be.undefined;
      expect(res2.headers["set-cookie"]).to.be.undefined;
    });
  });

  // Test email verification api
  describe("GET /api/auth/verify-email?token=", () => {
    it("should return status 200 and a success message for valid token", async () => {
      const res = await request(app).get(
        `/api/auth/verify-email?token=${testUserOneEmailVerificationToken}`
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message").that.is.string;
    });

    it("should return status 400 and a error message when token is invalid or not provided", async () => {
      const res = await request(app).get(`/api/auth/verify-email`);
      const res2 = await request(app).get(
        `/api/auth/verify-email?token=${testUserOneEmailVerificationToken}invalid`
      );

      expect(res.status).to.equal(400);
      expect(res2.status).to.equal(400);
      expect(res.body).to.have.property("message").that.is.string;
      expect(res2.body).to.have.property("message").that.is.string;
    });

    it("should return status 404 and a error message when user no longer exists, eg: user got deleted or banned before verification", async () => {
      // generate a email token with a id that does not belong to any user
      // this way it will pass the jwt verification
      // but will fail in finding that user
      // because the user really does not exist
      const tokenForGhost = jsonwebtoken.generateEmailToken({
        id: "66c3b3e0e1877b520db50a3d",
        email: "doesnot@matter.com",
      });
      const res = await request(app).get(
        `/api/auth/verify-email?token=${tokenForGhost}`
      );

      console.log("MESSAGE", res.body.message);
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message").that.is.string;
    });
  });
});

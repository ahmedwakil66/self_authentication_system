import { expect } from "chai";
import request from "supertest";
import app from "@/app";
import User from "@/models/userModel";
import jsonwebtoken from "@/config/jwt";

describe("User Authentication API", () => {
  let userOneRefreshToken: string;
  let userOneEmailVerificationToken: string;
  let userTwoAccessToken: string;
  let userTwoRefreshToken: string;
  const emailOne = "mocha.t.e.s.t.1567777@mocha.com";
  const emailTwo = "mocha.t.e.s.t.1568888@mocha.com";
  const password = "some-password-does-little-matter";

  before(async () => {
    const userOne = new User({
      name: "Mocha mocha one",
      email: emailOne,
      password: password,
    });
    const userTwo = new User({
      name: "Mocha mocha two",
      email: emailTwo,
      password: password,
    });
    userOneRefreshToken = userOne.generateRefreshToken();
    userOneEmailVerificationToken = userOne.generateEmailVerificationToken();
    userTwoAccessToken = userTwo.generateAccessToken();
    userTwoRefreshToken = userTwo.generateRefreshToken();
    await userOne.save();
    await userTwo.save();
  });

  after(async () => {
    await User.findOneAndDelete({ email: emailOne });
    await User.findOneAndDelete({ email: emailTwo });
  });

  // Test email password login api
  describe("POST /api/auth/login", () => {
    it("should set an accessToken cookie on successful login", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: emailOne,
        password: password,
      });

      const cookies = res.headers["set-cookie"];
      expect(cookies).to.be.an("array");
      expect(cookies[0]).to.include("accessToken=");
    });

    it("should return status 200, an accessToken and a refreshToken for valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: emailOne,
        password: password,
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
        email: emailOne,
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

  // Test logout api
  describe("POST /api/auth/logout", () => {
    it("should remove accessToken cookie and return status 200 with a success message", async () => {
      const res1 = await request(app).post("/api/auth/logout").send({
        accessToken: userTwoAccessToken,
      });
      const res2 = await request(app).post("/api/auth/logout").send({
        refreshToken: userTwoRefreshToken,
      });

      const cookies = {
        res1: res1.headers["set-cookie"],
        res2: res2.headers["set-cookie"],
      };

      expect(res1.status).to.equal(res2.status).to.equal(200);
      expect(res1.body).to.have.property("message").that.is.string;
      expect(res2.body).to.have.property("message").that.is.string;
      expect(cookies.res1).to.be.an("array");
      expect(cookies.res2).to.be.an("array");
      expect(cookies.res1[0])
        .to.include("accessToken=")
        .and.include("Max-Age=0");
      expect(cookies.res2[0])
        .to.include("accessToken=")
        .and.include("Max-Age=0");
    });

    it("should return status 400 with an error message when token is invalid or not provided", async () => {
      const res1 = await request(app).post("/api/auth/logout");
      const res2 = await request(app).post("/api/auth/logout").send({
        accessToken: "some-wrong-access-token",
      });
      const res3 = await request(app).post("/api/auth/logout").send({
        refreshToken: "some-wrong-refresh-token",
      });

      expect(res1.status)
        .to.equal(res2.status)
        .to.equal(res3.status)
        .to.equal(400);
      expect(res1.body).to.have.property("message").that.is.string;
      expect(res2.body).to.have.property("message").that.is.string;
      expect(res3.body).to.have.property("message").that.is.string;
    });
  });

  // Test refresh access token api
  describe("POST /api/auth/refresh", () => {
    it("should set an accessToken cookie and return status 200 with the new access token string", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: userOneRefreshToken });

      const cookies = res.headers["set-cookie"];

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("accessToken").that.is.string;
      expect(cookies).to.be.an("array");
      expect(cookies[0]).to.include("accessToken=");
    });

    it("should return status 401 and an error message if refreshToken not provided", async () => {
      const res = await request(app).post("/api/auth/refresh");

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message").that.is.string;
    });

    it("should return status 403 and an error message if refreshToken is invalid or expired", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: "an-invalid-refresh-token" });

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property("message").that.is.string;
    });
  });

  // Test email verification api
  describe("GET /api/auth/verify-email?token=", () => {
    it("should return status 200 and a success message for valid token", async () => {
      const res = await request(app).get(
        `/api/auth/verify-email?token=${userOneEmailVerificationToken}`
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message").that.is.string;
    });

    it("should return status 400 and a error message when token is invalid or not provided", async () => {
      const res = await request(app).get(`/api/auth/verify-email`);
      const res2 = await request(app).get(
        `/api/auth/verify-email?token=some-invalid-token`
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
        id: process.env.TEST_INVALID_USER_ID || "66c3b3e0e1877b520db50a3d",
        email: "doesnot@matter.com",
      });
      const res = await request(app).get(
        `/api/auth/verify-email?token=${tokenForGhost}`
      );

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message").that.is.string;
    });
  });
});

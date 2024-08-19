import app from "@/app";
import User from "@/models/userModel";
import { expect } from "chai";
import request from "supertest";

describe("User control API", () => {
  let testUserOneId: string;
  let testUserOneAccessToken: string;
  const testEmailOne = "mocha.t.e.s.t.3136411@mocha.com";
  const testEmailTwo = "mocha.t.e.s.t.3136422@mocha.com";

  before(async () => {
    const user = new User({
      email: testEmailOne,
      name: "Mocha mocha",
      password: "some-password-does-not-matter",
    });
    testUserOneId = user._id.toString();
    testUserOneAccessToken = user.generateAccessToken();
    await user.save();
  });

  after(async () => {
    await User.findOneAndDelete({ email: testEmailOne });
    await User.findOneAndDelete({ email: testEmailTwo });
  });

  // Test user creation/registration api
  describe("POST /api/users", () => {
    it("should create a new user, return status 201 with the newly created user's id ", async () => {
      const res = await request(app).post("/api/users").send({
        name: "Mocha",
        email: testEmailTwo,
        password: "some-password",
      });

      expect(res.status).is.equal(201);
      expect(res.body).has.property("user").that.has.property("id").and.is
        .string;
      expect(res.body)
        .has.property("message")
        .that.is.a("string")
        .and.include("Account created");
    });

    it("should return status 409 with user already exists message for duplicate user", async () => {
      const res = await request(app).post("/api/users").send({
        name: "Mocha",
        email: testEmailOne,
        password: "some-password",
      });

      expect(res.status).to.equal(409);
      expect(res.body).not.has.property("user");
      expect(res.body)
        .has.property("message")
        .that.is.a("string")
        .and.include("User already exists");
    });
  });

  // Test user info update api
  describe("PUT /api/users/:id", () => {
    it("should update user and return status 200 with updated object and a success message", async () => {
      const updatedDoc = {
        name: "Mocha renamed",
      };
      const res = await request(app)
        .put(`/api/users/${testUserOneId}`)
        .set("Authorization", `Bearer ${testUserOneAccessToken}`)
        .send(updatedDoc);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message").that.is.a.string;
      expect(res.body)
        .to.have.property("updated")
        .that.is.to.deep.equal(updatedDoc);
    });

    it("should return status 403 with a failure message when token is invalid", async () => {
      const res = await request(app)
        .put(`/api/users/${testUserOneId}`)
        .set("Authorization", `Bearer ${testUserOneAccessToken}invalid`)
        .send({ name: "Mocha should not be renamed" });

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property("message").that.is.a.string;
    });

    it("should return status 401 with a failure message when token is not provided", async () => {
      const res = await request(app)
        .put(`/api/users/${testUserOneId}`)
        .send({ name: "Mocha should not be renamed" });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message").that.is.a.string;
    });
  });
});

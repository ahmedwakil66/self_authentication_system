import extractUpdatedDoc from "@/utils/extractUpdatedDoc";
import { expect } from "chai";

describe("extractUpdatedDoc function", () => {
  it("should extract told properties only, from a given object and returns a new object.", () => {
    const result = extractUpdatedDoc(["name", "email", "tags", "nestedObj"], {
      name: "wakil",
      email: "ahmedwakil66@gmail.com",
      password: "as23df45gh67",
      tags: ["student", "teacher"],
      nestedObj: { a: 1, b: "1" },
    });

    expect(result).to.be.a("object");
    expect(Object.keys(result)).to.have.property("length", 4);
    expect(result).to.have.property("name").that.equal("wakil");
    expect(result)
      .to.have.property("email")
      .that.equal("ahmedwakil66@gmail.com");
    expect(result)
      .to.have.deep.property("tags")
      .that.equal(["student", "teacher"]);
    expect(result)
      .to.have.deep.property("nestedObj")
      .that.equal({ a: 1, b: "1" });
  });
});

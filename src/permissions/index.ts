import { DecodedPayload } from "../@types";
import User, { UserRole } from "../models/userModel";
import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export default function defineAbilityFor(me: DecodedPayload | undefined) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  // anyone can see id,name for any user but cannot list
  can("read", User, ["_id", "name"]);
  cannot("readList", User).because("Ops! Mango public cannot list users");

  if (me) {
    // Logged-in users can view (id,name,role) of all users
    can(["read", "readList"], User, ["_id", "name", "role"]);

    // Logged-in users can read their own full fields
    can("read", User, { _id: me.id });

    // Logged-in users can update their own name, email, and password
    can(["update"], User, ["name", "email", "password"], { _id: me.id });

    if (me.role?.includes(UserRole.Admin)) {
      // Admin user can do anything
      can("manage", User);
    }
  }

  return build();
}

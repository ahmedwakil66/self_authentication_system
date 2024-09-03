import { DecodedPayload } from "../@types";
import User, { UserRole } from "../models/userModel";
import { AbilityBuilder, createMongoAbility } from "@casl/ability";

// export type Action = "create" | "read" | "update" | "delete" | "manage";
// export type Subject = typeof User;
// export type AppAbility = Ability<[Action, Subject]>;

export default function defineAbilityFor(me: DecodedPayload | undefined) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  can("read", User, ["_id", "name"]);

  if (!me) return build();

  if (me.role?.length) {
    can("read", User, ["_id", "name", "role"]);
    can("read", User, { _id: me.id, email: me.email });
    can("manage", User, ["name", "email", "password"], { _id: me.id });

    if (me.role.includes(UserRole.Admin)) {
      can("read", User);
      can("manage", User);
    }
  }

  return build();
}

import { DecodedPayload } from "../@types";
import User, { UserRole } from "../models/userModel";
import BlogPost, { BlogPostStatus } from "../models/blogModel";
import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import mongoose from "mongoose";

export default function defineAbilityFor(me: DecodedPayload | undefined) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  // anyone can see id,name for any user but cannot list
  can("read", User, ["_id", "name"]);
  cannot("readList", User).because("Ops! Mango public cannot list users");

  // anyone can get and list published blog posts
  can(["read", "readList"], BlogPost, { status: BlogPostStatus.Published });

  if (me) {
    // Logged-in users can view (id,name,role) of all users
    can(["read", "readList"], User, ["_id", "name", "role"]);

    // Logged-in users can read and delete their own profile
    can(["read", "delete"], User, { _id: me.id });

    // Logged-in users can update their own name, email, and password
    can(["update"], User, ["name", "email", "password"], { _id: me.id });

    // Logged-in user can get its own blog post
    // @ts-ignore
    can("read", BlogPost, { "author.id": me.id });
    // Logged-in user can list all of its own blog posts
    can("readList", BlogPost, { author: new mongoose.Types.ObjectId(me.id) });
    // Logged-in user can update permitted fields of its own blog posts
    can("update", BlogPost, ["title", "body", "tags", "status"], {
      author: me.id,
    });
    // Logged-in user can delete its own blog post
    can("delete", BlogPost, { author: me.id });

    if (me.role?.includes(UserRole.Admin)) {
      // Admin user can do anything
      can("manage", User);
      can("manage", BlogPost);
    }
  }

  return build();
}

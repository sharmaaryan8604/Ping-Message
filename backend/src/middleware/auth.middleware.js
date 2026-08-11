import {
  clerkClient,
  getAuth,
} from "@clerk/express";
import User from "../models/Users.js";

async function syncUserFromClerk(
  clerkUserId
) {
  const clerkUser =
    await clerkClient.users.getUser(
      clerkUserId
    );

  const email =
    clerkUser.emailAddresses?.find(
      (entry) =>
        entry.id ===
        clerkUser.primaryEmailAddressId
    )?.emailAddress ??
    clerkUser.emailAddresses?.[0]
      ?.emailAddress;

  if (!email) {
    throw new Error(
      "Authenticated Clerk user is missing an email address"
    );
  }

  const fullName =
    [
      clerkUser.firstName,
      clerkUser.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    clerkUser.username ||
    email.split("@")[0];

  return User.findOneAndUpdate(
    {
      clerkId: clerkUser.id,
    },
    {
      clerkId: clerkUser.id,
      email,
      fullName,
      profilePic:
        clerkUser.imageUrl || "",
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function protectRoute(req, res, next) {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let user = await User.findOne({
      clerkId: auth.userId,
    });

    if (!user) {
      user = await syncUserFromClerk(
        auth.userId
      );
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Error in ProtectRoute:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

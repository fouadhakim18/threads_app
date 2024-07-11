import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const user = await currentUser();
  if (!user) return;
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  // Fetch Users

  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Search Bar */}

      <div className="mt-14 felx flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No users found</p>
        ) : (
          result.users.map((user) => (
            <UserCard
              key={user._id}
              id={user.id}
              username={user.username}
              name={user.name}
              userType="User"
              image={user.image}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Page;

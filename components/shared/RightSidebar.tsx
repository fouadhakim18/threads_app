import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import UserCard from "../cards/UserCard";

const RightSidebar = async () => {
  const user = await currentUser();
  if (!user) return null;

  const similarMinds = await fetchUsers({
    userId: user.id,
    pageSize: 4,
  });

  const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 });

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-7 flex w-[350px] flex-col gap-9">
          {suggestedCOmmunities.communities.length > 0 ? (
            <>
              {suggestedCOmmunities.communities.map((community) => (
                <UserCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  image={community.image}
                  userType="Community"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">
              No communities yet
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Similar Minds</h3>
        <div className="mt-7 flex w-[350px] flex-col gap-10">
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  image={person.image}
                  userType="User"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;

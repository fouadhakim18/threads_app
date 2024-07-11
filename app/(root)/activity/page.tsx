import { fetchUser, getActivities } from "@/lib/actions/user.actions";

import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";

const Page = async () => {
  const user = await currentUser();
  if (!user) return;
  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  //  get activities

  const activities = await getActivities(userInfo._id);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5 ">
        {activities.length === 0 ? (
          <p className="no-result">No activities found</p>
        ) : (
          activities.map((activity) => (
            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
              <article className="activity-card">
                <Image
                  src={activity.author.image}
                  alt={"Profile Picture"}
                  width={30}
                  height={30}
                  className="rounded-full object-cover"
                />

                <p className="!text-small-regular text-light-1 ml-1">
                  <span className="mr-1 text-purple-500">
                    {"@"}
                    {activity.author.username}
                  </span>{" "}
                  replied to your thread
                </p>
              </article>
            </Link>
          ))
        )}
      </section>
    </section>
  );
};

export default Page;

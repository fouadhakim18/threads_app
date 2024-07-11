"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder, model } from "mongoose";
import Thread from "../models/thread.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error("Failed to create/update user : " + error.message);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //     path: "communities",
    //     model: "Community",
    // });
  } catch (error) {
    throw new Error("Failed to fetch user : " + error);
  }
}

export async function fetchUserThreads(userId: string) {
  try {
    connectToDB();

    // TODO : Populate Community
    const threads = User.findOne({ id: userId }).populate({
      path: "threads",
      model: "Thread",
      populate: {
        path: "children",
        model: "Thread",
        populate: {
          path: "author",
          model: "User",
          select: "id name image",
        },
      },
    });

    return threads;
  } catch (error) {
    throw new Error("Failed to fetch user threads : " + error);
  }
}

export async function fetchUsers({
  userId,
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
  searchString = "",
}: {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
  searchString?: string;
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = {
      createdAt: sortBy,
    };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + pageSize;
    return { users, isNext };
  } catch (error) {
    throw new Error("Failed to fetch users : " + error);
  }
}

export async function getActivities(userId: string) {
  try {
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child threads  IDs
    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: "User",
      select: "id name image username",
    });

    return replies;
  } catch (error: any) {
    throw new Error("Failed to get activities : " + error.message);
  }
}

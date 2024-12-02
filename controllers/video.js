import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res, next) => {
  try {
    console.log(req.user.id, req.body,req.body.tags);
    let newVideo = await Video.create({
      userId: req.user.id,
      ...req.body,
    });
    res.status(200).json(newVideo);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found"));
    }
    if (req.user.id === video.userId) {
      let updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return next(createError(404, "Video not found"));
  }
  if (req.user.id === video.userId) {
    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json("The video has been deleted.");
  } else {
    return next(createError(403, "You can delete only your video!"));
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { view: 1 },
    });
    res.status(200).json("View has been increased");
  } catch (err) {
    next(err);
  }
};
export const random = async (req, res, next) => {
  try {
    let videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const trend = async (req, res, next) => {
  try {
    let videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);
    const videoPromises = user.subscribedUsers?.map((channelId) => {
      return new Promise(async (resolve, reject) => {
        let video = await Video.find({ userId: channelId });
        resolve(video);
      });
    });
    const list = await Promise.all(videoPromises);
    console.log(videoPromises);
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(err);
  }
};

export const getByTag = async (req, res, next) => {
  let tags = req.query.tags.split(",");
  console.log(tags)
  try {
    let videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

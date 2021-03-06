
import routes from "../routes";
import Comment from "../models/Comment";
import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
    try {
        const videos = await Video.find({});
        res.render("home", { pageTitle: "Home", videos });
    } catch (error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", videos: [] });
    }
};

export const search = async (req, res) => {
    const { query: { term: searchingBy } } = req;
    let videos = [];
    try {
        videos = await Video.find({ title: { $regex: searchingBy, $options: "i" } }); //내가 찾는 단어가 포함된 모든것 찾을때
    } catch (error) {
        console.log(error);
    }
    res.render("search", { pageTitle: "Search", searchingBy, videos });

}

export const getUpload = (req, res) => res.render("upload", { pageTitle: "upload" });

export const postUpload = async (req, res) => {
    const { body: { title, description },
        file: { path } } = req; // body : form 으로 부터 받아온 name , multer사용시는 multer가 file 별도로 줌
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description,
        creator: req.user._id
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));

}

export const videoDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id).populate("creator").populate("comments");

        res.render("videoDetail", { pageTitle: video.title, video });
    } catch {
        console.log(error);
        res.redirect(routes.home);
    }
}

export const getEditVideo = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id);
        console.log(req.user._id);
        console.log(video.creator);
        if (video.creator == req.user._id) {
            res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
        } else {
            //throw Error();
            res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
        }
    } catch (error) {
        console.log(error);
        res.redirect(routes.home);
    }

}
export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, { title, description });
        res.redirect(routes.videoDetail(id));
    } catch (error) {
        console.log(error);
        res.redirect(routes.home);
    }
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const video = await Video.findById(id);
        if (video.creator !== req.user._id) {
            throw Error();
        } else {
            await Video.findOneAndRemove({ _id: id });
        }


    } catch (error) {
        console.log(error);
    }
    res.redirect(routes.home);
}

export const postRegisterView = async (req, res) => {
    const { params: { id } } = req;
    try {
        const video = await Video.findById(id);
        video.views = video.views + 1;
        video.save();
        res.status(200);
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
}

export const postAddComment = async (req, res) => {
    const {
        params: { id },
        body: { comment },
    } = req;
    try {
        const video = await Video.findById(id);
        const newComment = await Comment.create({
            text: comment,
            creator: req.user._id,
        });
        const user = await User.findById(req.user._id);
        user.comments.push(newComment.id);
        video.comments.push(newComment.id);
        user.save();
        video.save();
        res.json({
            newCommentId: newComment._id,

        });
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.end();
    }
}

export const postDeleteComment = async (req, res) => {
    const {
        params: { id },
        body: { deleteCommentId },
    } = req;
    console.log(deleteCommentId);
    try {
        const video = await Video.findById(id);
        await Comment.findOneAndRemove({ _id: deleteCommentId });
        const user = await User.findById(req.user._id);
        video.comments.pull(deleteCommentId);
        video.save();
        user.comments.pull(deleteCommentId);
        user.save();
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.end();
    }
}
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: 'File URL is required'
        //fileUrl이 없는 비디오 생성시 다음 에러메시지
    },
    title: {
        type: String,
        required: "Title is required"
    },
    description: String,
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

const model = mongoose.model("Video", videoSchema);
export default model;
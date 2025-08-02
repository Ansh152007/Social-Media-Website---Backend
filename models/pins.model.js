import mongoose,{Schema} from "mongoose";

const pinSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [100, "Title cannot exceed 100 characters"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        maxLength: [1000, "Description cannot exceed 1000 characters"],
        trim: true
    },
    image: {
        type: String,
        required: [true, "Image is required"],
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Author is required"],
        index: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "User is required"]
        },
        text : {
            type: String,
            trim: true,
            maxLength: [500, "Comment cannot exceed 500 characters"],
            required: [true, "Comment text is required"],
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isPublic: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }],
},
{
    timestamps: true
})

pinSchema.index({ createdAt: -1 });

const Pin = mongoose.model('Pin', pinSchema)
export default Pin
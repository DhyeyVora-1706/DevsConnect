import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "rejected", "accepted"],
            message: `{VALUE} is not supported`
        }
    }
},
    { timestamps: true }
)

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(this.toUserId)) {
        throw new Error("You can't send connection request to yourself");
    }

    next();
});

export const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
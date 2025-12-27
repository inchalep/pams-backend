const { default: mongoose } = require("mongoose");
const Adoption = require("../schema/AdoptionSchema");
const PetSchema = require("../schema/PetSchema");
const { sendError, sendSuccess } = require("../utils/common");

const adoptRequest = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();
    const isExistRequest = await Adoption.exists({
      pet: req.body?.pet,
    });
    if (isExistRequest) {
      return sendSuccess(res, {
        statusCode: 200,
        success: false,
        message: "Pet is not available for adopt right now.",
      });
    }
    const dbData = await Adoption.create({
      ...req.body,
      user: userId,
    });

    await PetSchema.findByIdAndUpdate(req.body?.pet, {
      $set: {
        status: "PENDING",
      },
    });
    return sendSuccess(res, {
      statusCode: 201,
      data: dbData,
      message: "Adoption request created successfully.",
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      error: error.message,
    });
  }
};

const withdrowRequest = async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.user?._id?.toString();
    const isExistRequest = await Adoption.exists({
      pet: petId,
      user: userId,
      status: "PENDING",
    });

    if (!isExistRequest) {
      return sendSuccess(res, {
        statusCode: 200,
        message: "Adoption request not found.",
      });
    }

    await Adoption.findOneAndDelete({
      pet: petId,
      user: userId,
    });
    await PetSchema.findByIdAndUpdate(petId, {
      $set: {
        status: "AVAILABLE",
      },
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: "Adoption request cancel successfully.",
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      error: error.message,
    });
  }
};

const usersAdoptRequest = async (req, res) => {
  try {
    const user = req.user?._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const all = req.query.all;
    console.log(req.user, "all::", all);
    const skip = (page - 1) * limit;

    const query = {
      user: user._id,
    };
    if (req.user?.role == "ADMIN" && all === "true") {
      delete query.user;
      query.status='PENDING'
    }
    console.log(query,'ddd')
    const data = await Adoption.aggregate([
      {
        $match: query,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "pets",
          localField: "pet",
          foreignField: "_id",
          as: "petDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);
    const total = await Adoption.countDocuments(query);

    return sendSuccess(res, {
      statusCode: 200,
      data: {
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        list: data,
      },
      message: "data fetch successfully",
    });
  } catch (error) {
    console.log(error, "error:::");
    return sendError(res, {
      statusCode: 500,
      error: error.message,
    });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { petId } = req.params;
    const status = req.query.status;
    const userId = req.query.user;
    const query = {
      pet: new mongoose.Types.ObjectId(petId),
      user: new mongoose.Types.ObjectId(userId),
    };
    const isExistRequest = await Adoption.findOne(query);

    if (!isExistRequest) {
      return sendSuccess(res, {
        statusCode: 200,
        message: "Adoption request not found.",
      });
    }

    await Adoption.findOneAndUpdate(query, {
      $set: {
        status: status,
      },
    });
    await PetSchema.findByIdAndUpdate(petId, {
      $set: {
        status: status === "APPROVE" ? "ADOPTED" : "AVAILABLE",
      },
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: "Adoption request cancel successfully.",
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      error: error.message,
    });
  }
};

module.exports = {
  adoptRequest,
  withdrowRequest,
  usersAdoptRequest,
  updateRequest,
};

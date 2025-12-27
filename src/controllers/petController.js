const Pet = require("../schema/PetSchema");
const { sendSuccess, sendError } = require("../utils/common");

const addPet = async (req, res) => {
  try {
    const dbData = await Pet.create(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      data: dbData,
      message: "Pet created successfully.",
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      error: error.message,
    });
  }
};
const getPet = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, {
        statusCode: 403,
        error: "ID is required",
      });
    }
    const data = await Pet.findById(id);
    return sendSuccess(res, {
      statusCode: 200,
      data: data,
      message: "Pet created successfully.",
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      error: error.message,
    });
  }
};

const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, {
        statusCode: 403,
        error: "ID is required",
      });
    }
    const pet = await Pet.findById(id);
    if (!pet) {
      return sendSuccess(res, {
        statusCode: 200,
        data: null,
        message: "Pet not found",
      });
    }
    await Pet.findByIdAndUpdate(id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Pet updated successfully",
      data: true,
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      error: error.message,
    });
  }
};

const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, {
        statusCode: 403,
        error: "ID is required",
      });
    }
    await Pet.findByIdAndDelete(id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Pet deleted successfully",
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 501,
      error: error.message,
    });
  }
};

const getAllPets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const search = req.query.search;
    const sort = req.query.sort ?? "desc";
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { species: { $regex: search, $options: "i" } },
      ];
    }
    const data = await Pet.find(query)
      .sort({
        age: sort === "desc" ? -1 : 1,
      })
      .skip(skip)
      .limit(limit);
    const total = await Pet.countDocuments({});

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
    return sendError(res, {
      statusCode: 500,
      error: error.message,
    });
  }
};

module.exports = {
  addPet,
  getPet,
  updatePet,
  deletePet,
  getAllPets,
};

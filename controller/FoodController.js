import Food from "../models/Food.js";


// GET ALL FOODS

export const getFoods = async (req, res) => {

  try {

    const foods = await Food.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(foods);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// GET SINGLE FOOD

export const getFood = async (req, res) => {

  try {

    const food = await Food.findById(
      req.params.id
    ).populate("category", "name");


    if (!food) {

      return res.status(404).json({
        message: "Food not found"
      });

    }


    res.json(food);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// CREATE FOOD

export const createFood = async (req, res) => {

  try {

    const food = await Food.create(
      req.body
    );

    res.status(201).json(food);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};


// UPDATE FOOD

export const updateFood = async (req, res) => {

  try {

    const food =
      await Food.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );


    if (!food) {

      return res.status(404).json({
        message: "Food not found"
      });

    }


    res.json(food);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};


// DELETE FOOD

export const deleteFood = async (req, res) => {

  try {

    const food =
      await Food.findByIdAndDelete(
        req.params.id
      );


    if (!food) {

      return res.status(404).json({
        message: "Food not found"
      });

    }


    res.json({
      message: "Food deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
import Category from "../models/Category.js";


// GET CATEGORIES

export const getCategories = async (
  req,
  res
) => {

  try {

    const categories =
      await Category.find().sort({
        name: 1
      });

    res.json(categories);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// CREATE CATEGORY

export const createCategory = async (
  req,
  res
) => {

  try {

    const {
      name
    } = req.body;


    const category =
      await Category.create({
        name
      });


    res.status(201).json(
      category
    );

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};

export const updateCategory = async (
  req,
  res
) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};


// DELETE CATEGORY

export const deleteCategory = async (
  req,
  res
) => {

  try {

    await Category.findByIdAndDelete(
      req.params.id
    );


    res.json({
      message: "Category deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
import Cart from "../models/Cart.js";


// GET CART

export const getCart = async (
  req,
  res
) => {

  try {

    let cart = await Cart.findOne({
      user: req.user.id
    }).populate(
      "items.food"
    );


    if (!cart) {

      cart = await Cart.create({
        user: req.user.id,
        items: []
      });

    }


    res.json(cart);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// ADD TO CART

export const addToCart = async (
  req,
  res
) => {

  try {

    const {
      foodId,
      quantity = 1
    } = req.body;


    let cart =
      await Cart.findOne({
        user: req.user.id
      });


    if (!cart) {

      cart = new Cart({
        user: req.user.id,
        items: []
      });

    }


    const existingItem =
      cart.items.find(
        item =>
          item.food.toString() ===
          foodId
      );


    if (existingItem) {

      existingItem.quantity +=
        quantity;

    } else {

      cart.items.push({
        food: foodId,
        quantity
      });

    }


    await cart.save();


    const updatedCart =
      await Cart.findById(
        cart._id
      ).populate(
        "items.food"
      );


    res.json(updatedCart);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// UPDATE CART

export const updateCart = async (
  req,
  res
) => {

  try {

    const {
      foodId,
      quantity
    } = req.body;


    const cart =
      await Cart.findOne({
        user: req.user.id
      });


    if (!cart) {

      return res.status(404).json({
        message: "Cart not found"
      });

    }


    const item =
      cart.items.find(
        item =>
          item.food.toString() ===
          foodId
      );


    if (!item) {

      return res.status(404).json({
        message: "Food not found in cart"
      });

    }


    if (quantity <= 0) {

      cart.items =
        cart.items.filter(
          item =>
            item.food.toString() !==
            foodId
        );

    } else {

      item.quantity =
        quantity;

    }


    await cart.save();


    const updatedCart =
      await Cart.findById(
        cart._id
      ).populate(
        "items.food"
      );


    res.json(updatedCart);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// CLEAR CART

export const clearCart = async (
  req,
  res
) => {

  try {

    await Cart.findOneAndUpdate(

      {
        user: req.user.id
      },

      {
        items: []
      },

      {
        upsert: true
      }

    );


    res.json({
      message: "Cart cleared"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
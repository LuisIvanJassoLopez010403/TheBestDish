const OrderModel = require('../models/order.model').OrderModel;

/**
 * Create an empty order with client name
 *
 * @param req Actual Request
 * @param res Actual Response
 */
async function createNewOrder(req, res) {
    let clientName = req.body.clientName;

    let newOrder = new OrderModel({
        clientName: clientName
    });

    return res.json(newOrder);
}

/**
 * Add dish to existing order
 *
 * @param req Actual Request
 * @param res Actual Response
 */
async function addDish(req, res) {
    let orderId = req.body.orderId;
    let dishId = req.body.dishId;

    OrderModel.updateOne({"_id": orderId}, {
        $push: {
            dishes : dishId
        }
    });

    let updatedOder = OrderModel.findOne({_id: orderId});

    return res.json(updatedOder);

}

/**
 * Remove dish to existing order
 *
 * @param req Actual Request
 * @param res Actual Response
 */
async function removeDish(req, res) {
    let orderId = req.body.orderId;
    let dishId = req.body.dishId;

    OrderModel.updateOne({"_id": orderId}, {
        $pull: {
            dishes : dishId
        }
    });

    let updatedOder = OrderModel.findOne({_id: orderId});

    return res.json(updatedOder);

}

/**
 * Get an order by its Id
 *
 * @param req Actual Request
 * @param res Actual Response
 */
async function getOrder(req, res){

    let orderId = req.query.orderId;

    let orderObj = OrderModel.findOne({_id: orderId});

    return res.json(orderObj);
}

/**
 * Calculates the total price of an order applying discounts and promotions
 *
 * @param {Object} orderObj - Order object containing dishes and promo codes
 * @returns {Number} Total price after discounts
 */
function getTotal(orderObj) {
    if (!orderObj || typeof orderObj !== "object") {
        throw new Error("The order is null or invalid");
    }

    if (!Array.isArray(orderObj.dishes)) {
        throw new Error("Dishes must be an array");
    }

    if (orderObj.dishes.length === 0) {
        return 0;
    }

    let total = 0;
    let dishCount = {};
    let maxDiscount = 0;

    // Contar los platillos y bebidas
    for (let dish of orderObj.dishes) {

        if (!dish || typeof dish !== "object") {
            throw new Error("One or more dishes are empty or not an object")
        }

        if (!dish._id || !dish.price || !dish.type) {
            throw new Error("One or more dishes are missing one or more values"); 
        }

        if (typeof dish.price !== "number" || (dish.type !== "Meal" && dish.type !== "Drink")) {
            throw new Error("One or more dishes contain one or more invalid values")
        }

        if (dishCount[dish._id] && dishCount[dish._id].price !== dish.price) {
            throw new Error('One or more dishes have inconsistent prices');
        }

        if (!dishCount[dish._id]) {
            dishCount[dish._id] = { count: 0, price: dish.price, type: dish.type };
        }
        dishCount[dish._id].count++;
    }

    // Calcular total y buscar el mayor descuento aplicable
    for (let dishId in dishCount) {
        let { count, price, type } = dishCount[dishId];
        let discount = 0;

        if (type === "Meal" && count >= 3) {
            discount = Math.min(price, 20);
            total += count * price;
        } else if (type === "Drink" && count >= 2) {
            discount = Math.min(price, 10); 
            total += count * price;
        } else {
            total += count * price;
        }

        maxDiscount = Math.max(maxDiscount, discount);
    }

    // Aplicar solo el mayor descuento encontrado
    total -= maxDiscount;

    if (maxDiscount > 0 && orderObj.promoCode) {
        throw new Error("Promotional codes cannot be applied when a discount already exists in the order");
    }

    if (Array.isArray(orderObj.promoCode) && orderObj.promoCode.length > 1) {
        throw new Error("Only one promotional code can be applied per order");
    }

    // Aplicar código promocional solo si no hay descuento previo
if (maxDiscount === 0 && orderObj.promoCode) {
    let validPromoCodes = ["BIENVENIDA", "REFRESCATE", "COMBO", "PAREJA"];
    
    if (!validPromoCodes.includes(orderObj.promoCode)) {
        throw new Error("The promotional code is invalid");
    }

    let drinks = orderObj.dishes.filter(d => d.type === "Drink").sort((a, b) => a.price - b.price);
    let meals = orderObj.dishes.filter(d => d.type === "Meal").sort((a, b) => a.price - b.price);

    switch (orderObj.promoCode) {
        case "BIENVENIDA":
            total *= 0.7;
            break;
        case "REFRESCATE":
            if (drinks.length > 0) {
                total -= drinks[drinks.length - 1].price;
            }
            break;
        case "COMBO":
            if (drinks.length > 0 && meals.length > 0) {
                total -= drinks[0].price + meals[0].price;
            }
            break;
        case "PAREJA":
            let topDrinks = drinks.slice(-2).reduce((acc, drink) => acc + drink.price, 0);
            let topMeals = meals.slice(-2).reduce((acc, meal) => acc + meal.price, 0);
            total -= topDrinks + topMeals;
            break;
    }
}
    return Math.max(total, 0);
}

module.exports = {
    createNewOrder,
    addDish,
    removeDish,
    getOrder,
    getTotal
};
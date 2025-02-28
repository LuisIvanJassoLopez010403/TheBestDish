const { 
    getTotal
} = require("../controllers/order.controller");

describe('Order', function() {

    describe('Displays the order', function() {

        describe('Given that order is not an object', function() {
            it('will throw an error', function() {
                let newOrder1 = null;

                expect(() => getTotal(newOrder1)).toThrow("The order is null or invalid");

                let newOrder2 = "invalid";

                expect(() => getTotal(newOrder2)).toThrow("The order is null or invalid");

            })
        })

        describe('Given that dishes is not an array', function() {
            it('will throw an error', function() {
                let newOrder = {
                    clientName: "Client",
                    dishes: "notAnArray"
                };

                expect(() => getTotal(newOrder)).toThrow("Dishes must be an array");
            
            })
        })

        describe('Given that dishes is empty', function() {
            it('will get a total amount of zero', function() {
                let newOrder = {
                    clientName: "Client",
                    dishes: []
                };

                let result = getTotal(newOrder);
                expect(result).toBe(0);

            })
        })

        describe('Given that one or more dishes are empty or not an object', function() {
            it('will throw an error', function() {
                let newOrder1 = {
                    clientName: "Client 1",
                    dishes: ["notAnObject"]
                };

                expect(() => getTotal(newOrder1)).toThrow("One or more dishes are empty or not an object");

                let newOrder2 = {
                    clientName: "Client 2",
                    dishes: [{}]
                };

                expect(() => getTotal(newOrder1)).toThrow("One or more dishes are empty or not an object");

            })
        })

        describe('Given that one or more dishes are missing one or more values', function() {
            it('will throw an error', function() {
                let newOrder1 = {
                    clientName: "Client 1",
                    dishes: [{ _id: "dish1" }] 
                };

                expect(() => getTotal(newOrder1)).toThrow("One or more dishes are missing one or more values");

                let newOrder2 = {
                    clientName: "Client 2",
                    dishes: [{ _id: "dish1", price: 10 }] 
                };

                expect(() => getTotal(newOrder2)).toThrow("One or more dishes are missing one or more values");

                let newOrder3 = {
                    clientName: "Client 3",
                    dishes: [{ _id: "dish1", type: "Meal" }] 
                };

                expect(() => getTotal(newOrder3)).toThrow("One or more dishes are missing one or more values");

                let newOrder4 = {
                    clientName: "Client 4",
                    dishes: [{ price: 10 }] 
                };

                expect(() => getTotal(newOrder4)).toThrow("One or more dishes are missing one or more values");

                let newOrder5 = {
                    clientName: "Client 5",
                    dishes: [{ type: "Meal" }] 
                };

                expect(() => getTotal(newOrder5)).toThrow("One or more dishes are missing one or more values");

                let newOrder6 = {
                    clientName: "Client 6",
                    dishes: [{ price: 10, type: "Meal" }] 
                };
                
                expect(() => getTotal(newOrder6)).toThrow("One or more dishes are missing one or more values");

            })
        })
        
        describe('Given that one or more dishes contain one or more invalid values', function() {
            it("will throw an error if a dish price is not a number", function() {
                let newOrder = {
                    clientName: "Client",
                    dishes: [{ _id: "dish1", price: "ten", type: "Meal" }]
                };

                expect(() => getTotal(newOrder)).toThrow("One or more dishes contain one or more invalid values");

            })

            it("will throw an error if a dish type is neither Meal or Drink", function() {
                let newOrder = {
                    clientName: "Client",
                    dishes: [{ _id: "dish1", price: "ten", type: "Lunch" }]
                };

                expect(() => getTotal(newOrder)).toThrow("One or more dishes contain one or more invalid values");

            })
        })

        describe('Given that there is one or more dishes with the same id but different prices', function() {
            it('will throw an error', function() {
                let newOrder = {
                    clientName: 'Client',
                    dishes: [
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish1", price: 25, type: "Meal" },
                    ]
                };

                expect(() => getTotal(newOrder)).toThrow("One or more dishes have inconsistent prices");
                
            })
        })

        describe('Given that there is a valid order placed', function() {
            it('will sum the total of the dishes', function() {
                let newOrder = {
                    clientName: 'Client',
                    dishes: [
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish2", price: 45, type: "Meal" },
                        { _id: "dish3", price: 20, type: "Drink" },
                        { _id: "dish4", price: 25, type: "Drink" }
                    ]
                };

                let result = getTotal(newOrder);
                expect(result).toBe(150);
                
            })
        })

        describe('Given that there are 3 repeated meals in the order', function() {
            it('will add the total of only two dishes', function() {
                let newOrder = {
                    clientName: 'Client 1',
                    dishes: [
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish1", price: 15, type: "Meal" }

                    ]
                };
            
                let result = getTotal(newOrder);
                expect(result).toBe(30);

                let newOrder2 = {
                    clientName: 'Client 2',
                    dishes: [
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish2", price: 30, type: "Meal" },
                        { _id: "dish3", price: 20, type: "Drink" }

                    ]
                };
            
                let result2 = getTotal(newOrder2);
                expect(result2).toBe(80);

            })
            
            it('will add the total of only two dishes, but up to 20 in discount', function() {
                let newOrder = {
                    clientName: 'Client 3',
                    dishes: [
                        { _id: "dish1", price: 60, type: "Meal" },
                        { _id: "dish1", price: 60, type: "Meal" },
                        { _id: "dish1", price: 60, type: "Meal" }
                    ]
                };
            
                let result = getTotal(newOrder);
                expect(result).toBe(160);

                let newOrder2 = {
                    clientName: 'Client 4',
                    dishes: [
                        { _id: "dish1", price: 60, type: "Meal" },
                        { _id: "dish1", price: 60, type: "Meal" },
                        { _id: "dish1", price: 60, type: "Meal" },
                        { _id: "dish2", price: 30, type: "Meal" },
                        { _id: "dish3", price: 20, type: "Drink" }

                    ]
                };
            
                let result2 = getTotal(newOrder2);
                expect(result2).toBe(210);

            })
        })

        describe('Given that there 2 repeated drinks in the order', function() {
            it('will add the total of only one drink', function() {
                let newOrder = {
                    clientName: 'Client 1',
                    dishes: [
                        { _id: "dish1", price: 8, type: "Drink" },
                        { _id: "dish1", price: 8, type: "Drink" }
                    ]
                };
            
                let result = getTotal(newOrder);
                expect(result).toBe(8);

                let newOrder2 = {
                    clientName: 'Client 2',
                    dishes: [
                        { _id: "dish1", price: 8, type: "Drink" },
                        { _id: "dish1", price: 8, type: "Drink" },
                        { _id: "dish2", price: 15, type: "Drink" },
                        { _id: "dish3", price: 25, type: "Meal" }
                    ]
                };
            
                let result2 = getTotal(newOrder2);
                expect(result2).toBe(48);

            })

            it('will add the total of only one drink, but up to 10 in discount', function() {
                let newOrder = {
                    clientName: 'Client 3',
                    dishes: [
                        { _id: "dish1", price: 15, type: "Drink" },
                        { _id: "dish1", price: 15, type: "Drink" }
                    ]
                };
            
                let result = getTotal(newOrder);
                expect(result).toBe(20);

                let newOrder2 = {
                    clientName: 'Client 4',
                    dishes: [
                        { _id: "dish1", price: 15, type: "Drink" },
                        { _id: "dish1", price: 15, type: "Drink" },
                        { _id: "dish2", price: 15, type: "Drink" },
                        { _id: "dish3", price: 25, type: "Meal" }
                    ]
                };
            
                let result2 = getTotal(newOrder2);
                expect(result2).toBe(60);

            })
        })

        describe('Given that there are two or more available promotions in the order', function() {
            it('will apply only the promotion that gives the better discount', function() {
                let newOrder = {
                    clientName: 'Client 1',
                    dishes: [
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish2", price: 10, type: "Drink" },
                        { _id: "dish2", price: 10, type: "Drink" }
                    ]
                };
            
                let result = getTotal(newOrder);
                expect(result).toBe(50);

                let newOrder2 = {
                    clientName: 'Client 2',
                    dishes: [
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish2", price: 10, type: "Drink" },
                        { _id: "dish2", price: 10, type: "Drink" }
                    ]
                };
            
                let result2 = getTotal(newOrder2);
                expect(result2).toBe(90);

                let newOrder3 = {
                    clientName: 'Client 3',
                    dishes: [
                        { _id: "dish1", price: 5, type: "Meal" },
                        { _id: "dish1", price: 5, type: "Meal" },
                        { _id: "dish1", price: 5, type: "Meal" },
                        { _id: "dish2", price: 10, type: "Drink" },
                        { _id: "dish2", price: 10, type: "Drink" }
                    ]
                };
            
                let result3 = getTotal(newOrder3);
                expect(result3).toBe(25);

                let newOrder4 = {
                    clientName: 'Client 4',
                    dishes: [
                        { _id: "dish1", price: 5, type: "Meal" },
                        { _id: "dish1", price: 5, type: "Meal" },
                        { _id: "dish1", price: 5, type: "Meal" },
                        { _id: "dish2", price: 15, type: "Drink" },
                        { _id: "dish2", price: 15, type: "Drink" }
                    ]
                };
            
                let result4 = getTotal(newOrder4);
                expect(result4).toBe(35);

                let newOrder5 = {
                    clientName: 'Client 5',
                    dishes: [
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish2", price: 10, type: "Meal" },
                        { _id: "dish2", price: 10, type: "Meal" },
                        { _id: "dish2", price: 10, type: "Meal" }
                        
                    ]
                };
            
                let result5 = getTotal(newOrder5);
                expect(result5).toBe(100);

                let newOrder6 = {
                    clientName: 'Client 6',
                    dishes: [
                        { _id: "dish1", price: 20, type: "Drink" },
                        { _id: "dish1", price: 20, type: "Drink" },
                        { _id: "dish2", price: 8, type: "Drink" },
                        { _id: "dish2", price: 8, type: "Drink" }
                    ]
                };
            
                let result6 = getTotal(newOrder6);
                expect(result6).toBe(46);

            })
        })
        
        describe('Given that there is a discount offer and a promo code is applied', function() {
            it('will throw an error', function() {
                let newOrder1 = {
                    clientName: 'Client 1',
                    dishes: [
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish1", price: 15, type: "Meal" },
                        { _id: "dish1", price: 15, type: "Meal" }
                    ],
                    promoCode: "BIENVENIDA"
                };
            
                expect(() => getTotal(newOrder1)).toThrow("Promotional codes cannot be applied when a discount already exists in the order");

                let newOrder2 = {
                    clientName: 'Client 2',
                    dishes: [
                        { _id: "dish1", price: 8, type: "Drink" },
                        { _id: "dish1", price: 8, type: "Drink" }
                    ],
                    promoCode: "REFRESCATE"
                };
            
                expect(() => getTotal(newOrder2)).toThrow("Promotional codes cannot be applied when a discount already exists in the order");

            })
        })

        describe('Given that there is no discount offer and a promo code is applied', function() {
            it('will apply the promo code discount', function() {
                let newOrder = {
                    clientName: 'Client 1',
                    dishes: [
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish2", price: 20, type: "Drink" },
                    ],
                    promoCode: "BIENVENIDA"
                };
            
                let result = getTotal(newOrder);
                expect(result).toBe(35);

                let newOrder2 = {
                    clientName: 'Client 2',
                    dishes: [
                        { _id: "dish1", price: 30, type: "Drink" },
                        { _id: "dish2", price: 20, type: "Drink" },
                    ],
                    promoCode: "REFRESCATE"
                };
            
                let result2 = getTotal(newOrder2);
                expect(result2).toBe(20);

                let newOrder3 = {
                    clientName: 'Client 3',
                    dishes: [
                        { _id: "dish1", price: 50, type: "Meal" },
                        { _id: "dish2", price: 35, type: "Meal" },
                        { _id: "dish3", price: 20, type: "Drink" },
                        { _id: "dish4", price: 15, type: "Drink" }
                    ],
                    promoCode: "COMBO"
                };
            
                let result3 = getTotal(newOrder3);
                expect(result3).toBe(70);

                let newOrder4 = {
                    clientName: 'Client 4',
                    dishes: [
                        { _id: "dish1", price: 50, type: "Meal" },
                        { _id: "dish2", price: 35, type: "Meal" },
                        { _id: "dish3", price: 25, type: "Meal" },
                        { _id: "dish4", price: 20, type: "Drink" },
                        { _id: "dish5", price: 15, type: "Drink" },
                        { _id: "dish6", price: 10, type: "Drink" }
                    ],
                    promoCode: "PAREJA"
                };
            
                let result4 = getTotal(newOrder4);
                expect(result4).toBe(35);

            })
        })

        describe('Given that an invalid promocode is applied', function() {
            it('will throw an error', function() {
                let newOrder = {
                    clientName: 'Client',
                    dishes: [
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish2", price: 20, type: "Drink" },
                    ],
                    promoCode: "INVALID"
                };

                expect(() => getTotal(newOrder)).toThrow("The promotional code is invalid");

            })
        })

        describe('Given that more than one promo code is applied', function() {
            it('will throw an error', function() {
                let newOrder = {
                    clientName: 'Client',
                    dishes: [
                        { _id: "dish1", price: 30, type: "Meal" },
                        { _id: "dish2", price: 20, type: "Drink" },
                    ],
                    promoCode: ["BIENVENIDA", "REFRESCATE"]
                };

                expect(() => getTotal(newOrder)).toThrow("Only one promotional code can be applied per order");

            })
        })
    })
})

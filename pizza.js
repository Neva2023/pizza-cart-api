document.addEventListener ("alpine:init", () => {
    Alpine.data('pizzaCart', () => {
        return {
        qauntity1 : 0, 
        successMsg: 'Enjoy your pizzas', 
        errorMsg: 'Sorry-that money is not enough', 
        qauntity2:0 , 
        qauntity3:0, 
        price1:0, 
        price2:0, 
        price3:0,
        amount:0, 
        total:0 , 
        text:'', 
        checknr:0, 
        pizzas:[], 
        username:'',
        cartId:'',
        cartPizzas:[],
        cartTotal:0.00,
        paymentAmount:0,
        message:'',
        login(){ 
            if (this.username.length>2) {
                localStorage['username']=this.username;
                this.createCart();
            }else {
                alert("Username is too short")
            }

        },
        logout() {
            if (confirm('Do you want to logout?')) {

            this.username='';
            this.cartId='';
            localStorage['cartId']='';
            localStorage['username']='';
        }

        },

        createCart() {

            if (!this.username) {
                //this.cartId='No username to craete cart for'
                return Promise.resolve ();
            }

            const cartId = localStorage['cartId'];
            if (cartId) {
                this.cartId =cartId;
                return Promise.resolve ();
            }else {
                const createCartURL=`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                return axios.get(createCartURL)
                     .then(result => {
                        this.cartId=result.data.cart_code;
                        localStorage['cartId']=this.cartId;
            });

            }
                 
        },



        removePizza(pizzaId){
            return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove',{
                 "cart_code" : this.cartId,
                 "pizza_id" : pizzaId
             })
         },


        addPizza(pizzaId){
            return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add',{
                 "cart_code" : this.cartId,
                 "pizza_id" : pizzaId
             })
         },


        showCartData () {

            this.getCart()
                   .then (result => {
                    const cartData=result.data;
                    this.cartPizzas=result.data.pizzas;
                    this.cartTotal=cartData.total.toFixed(2);

                   });

        },

        getCart () {
            const getCartURL=`https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
            return axios.get(getCartURL);},

            pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay',{
                    "cart_code" : this.cartId,
                    amount  
                })

             },

         pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay',{
                    "cart_code" : this.cartId,
                    amount  
                })

             },



        
        init () {
        
        const storedUsername= localStorage['username'];
        if (storedUsername) {

        this.username= storedUsername;
        }
    

        axios 
        .get('https://pizza-api.projectcodex.net/api/pizzas')
        .then(result => {
          this.pizzas=result.data.pizzas;
        });

        if (!this.cartId) {
            this
                .createCart()
                .then (() => {
                    this.showCartData();
        })
           
        }

        

    },

        addPizzaToCart(pizzaId) {
                    this
                    .addPizza(pizzaId)
                    .then(() => {
                        this.showCartData();
        

                    })
                },
                removePizzaFromCart(pizzaId){
                    this
                    .removePizza(pizzaId)
                    .then(() => {
                        this.showCartData();
        
                    })
        
                },

                payForCart() {

                    this
                        .pay(this.paymentAmount)
                        .then(result => {
                            if (result.data.status=='failure') {
                                this.message=result.data.message;
                                setTimeout( () => this.message='', 3000);
                            }else {
                                this.message ='Payment received!';
                                setTimeout( () => {
                                    this.message='';
                                    this.cartPizzas=[];
                                    this.cartTotal=0.00;
                                    this.cartId='';
                                    this.paymentAmount=0.00;
                                    localStorage['cartId']='';
                                    this.createCart();
                                },3000);
        
                            }
                                
                            
                })
                               
                        
                }
        
        

                
        }}
        )}
                  
)


import React, {Component} from 'react';

import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from  '../../components/UI/Spinner/Spinner';
import withErrorHandler from  '../../hoc/withErrorHandler/withErrorHandler';

import axios from  '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};


class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('https://myburger-react-92b91-default-rtdb.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error => {
                this.setState({error:true});
            });
    }
    updatePurchaseState (ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })  
            .reduce((sum,el) => {
                return sum + el;
            }, 0);
        this.setState({purchaseable: sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const updatedTotalPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedTotalPrice
        })
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount<=0)
            return;
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const updatedTotalPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedTotalPrice
        })
        this.updatePurchaseState(updatedIngredients);
    }

    startPurhchaseHandler = () => {
        this.setState({ purchasing : true})
    }

    stopPurchaseHandler = () => {
        this.setState({ purchasing : false})
    }

    continuePurchaseHandler = () => {
        //alert("You can continue");
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice, 
            customer: {
                name: 'Arnab',
                address: {
                    country:'India'
                },
                email: 'test@gmail.com'
            }
        }
        axios.post('/orders.json', order)
            .then(
                this.setState({loading: false, purchasing: false})
            )
            .catch(
                this.setState({loading: false, purchasing: false})
            );
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0 ;
        }
        let orderSummary = null;
        

        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
        if(this.state.ingredients){
            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            purchaseCancelled = {this.stopPurchaseHandler}
            purchaseContinued = {this.continuePurchaseHandler}
            price= {this.state.totalPrice} />

            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled = {disabledInfo}
                    purchaseable = {this.state.purchaseable}
                    price={this.state.totalPrice}
                    purchase = {this.startPurhchaseHandler}
                    />
                </Aux>
            ) 
        }

        
        if(this.state.loading){
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} click={this.stopPurchaseHandler}>
                    {orderSummary}
                </Modal>
                {burger}
        </Aux>
    );
    }     
}


export default withErrorHandler(BurgerBuilder, axios);
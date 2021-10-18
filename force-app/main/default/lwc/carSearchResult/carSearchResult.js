import { LightningElement, api, wire, track } from 'lwc';
import getCars from '@salesforce/apex/CarSearchFormController.getCarTypes';

// https://developer.salesforce.com/docs/component-library/bundle/lightning-platform-show-toast-event/documentation
// Display toasts to provide feedback to a user following an action, such as after a record is created.
import { showToastEvent } from 'lightning/platformShowToastEvent';

export default class CarSearchResult extends LightningElement {

    @api carTypeId;

    @track cars;

    @wire(getCars, {carTypeId : '$carTypeId'})
    wiredCars({ data, error }) {
        if(data) {
            this.cars = data;
        } else if (error) {
            this.showToast('Error', error.body.message, 'error')
        }
    }

     // showToast to display error to user 
    // Required fields : title, message, and variant (error in this case). See line 25
    showToast (title, message, variant) {
        const event = new showToastEvent({
            title: title,
            message: message,
            variant: variant,

        });
        this.dispatchEvent(event);
    }

    get carsFound() {
        if(this.cars) {
            return true;
        } else {
            return false;
        }
    }
}
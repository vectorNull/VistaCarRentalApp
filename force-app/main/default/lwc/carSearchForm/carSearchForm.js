import { LightningElement, track, wire } from 'lwc';
import getCarTypes from '@salesforce/apex/CarSearchFormController.getCarTypes';

// https://developer.salesforce.com/docs/component-library/bundle/lightning-platform-show-toast-event/documentation
// Display toasts to provide feedback to a user following an action, such as after a record is created.
import { showToastEvent } from 'lightning/platformShowToastEvent';

//https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation/documentation
import { NavigationMixin } from 'lightning/navigation';

export default class CarSearchForm extends NavigationMixin(LightningElement) {
    @track carTypes;

    @wire (getCarTypes)
    wiredCarType({ data, error }) {
        if(data) {
            this.carTypes = [{value: '', label: 'All Types'}];
            data.forEach(element => {
                const carType = {};
                carType.label = element.Name
                carType.value = element.Id
                this.carTypes.push(carType)
            });
        } else if (error) {
            this.showToast('Error', error.body.message, 'error')
        }
    }

    handleCarTypeChange (event) {
        const carTypeId = event.detail.value;

        const carTypeSelectionChangeEvent = new CustomEvent('cartypeselect', {detail : carTypeId})
        this.dispatchEvent(carTypeSelectionChangeEvent);
    }

    createNewCarType(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes : {
                objectApiName:'Car_Type__c',
                actionName: 'new'
            }
        })
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
}
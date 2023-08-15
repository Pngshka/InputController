import { InputController } from './input-controller.js';


let someObj = {
    left: {
        keys: [37, 65]
    },
    right: {
        keys: [39, 68]//, enabled: false
    }
};
let inputController = new InputController();
inputController.bindActions(someObj);



function printDebug(text) {
    textAreaDisplay.textContent = text;
}

document.addEventListener(InputController.ACTION_ACTIVATED, e => printDebug('Активировано событие с названием: ' + e.name));
document.addEventListener(InputController.ACTION_DEACTIVATED, e => printDebug('Дективировано событие с названием: ' + e.name));

attachButton.onclick = () => {
    inputController.attach(document);
    printDebug("Контроллер нацелен на document");
}

detachButton.onclick = () => {
    inputController.detach();
    printDebug("Контроллер убрал слушателей");
}

activateButton.onclick = () => {
    inputController.enabled = true;
    printDebug("Контроллер активирован");
}

deactivateButton.onclick = () => {
    inputController.enabled = false;
    printDebug("Контроллер деактивирован");
}

unplugLeft.onclick = () => {
    inputController.disableAction("left");
    printDebug("Активность отключена");
}


addNewActivButton.onclick = () => {
    const spaceKeyCode = 32; 
    let newBind = {
        jump: {
            keys: [spaceKeyCode]
        }, 
        left: {
            keys: [44]
        }
    }
    inputController.bindActions(newBind);
    printDebug("Байнд дополнительное действие прыжок ");
}

setInterval(()=> 
    {
        let rect = interactiveObject.getBoundingClientRect();
        if (inputController.isActionActive('left') && inputController.focused) {
            console.log(rect);
            interactiveObject.style.position = 'fixed';
            interactiveObject.style.left = (rect.left - 10)+'px';
            interactiveObject.style.top = (rect.top)+'px';
        }
        if (inputController.isActionActive('right') && inputController.focused) {
            interactiveObject.style.position = 'fixed';
            interactiveObject.style.left = (rect.left + 10)+'px';
            interactiveObject.style.top = (rect.top)+'px';
        }
        if (inputController.isActionActive('jump') && inputController.focused) {
            console.log(interactiveObject.style);
            if (interactiveObject.style['background-color'] === 'black') {
                interactiveObject.style['background-color'] = 'green';
            }
            else {
                interactiveObject.style['background-color'] = 'black';
            }

        }
    }
, 100)
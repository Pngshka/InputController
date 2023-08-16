import { InputController } from './input-controller.js';
import { KeyboardPlugin } from './plugins/KeyboardPlugin.js';
import { MousePlugin } from './plugins/MousePlugin.js';
import { ActivWithKeyCode } from './plugins/ActivWithKeyCode.js';
import { ActivWithMouseCode } from './plugins/ActivWithMouseCode.js';


let leftAktiv = new ActivWithKeyCode("left", true, [37, 65]);
let rightAktiv = new ActivWithKeyCode("right", true, [39, 68]);
let jumpSecondAktiv = new ActivWithMouseCode("jump", true, [2]);
let leftSecondAktiv = new ActivWithMouseCode("left", true, [1]);
let rightSecondAktiv = new ActivWithMouseCode("right", true, [3]);

let inputController = new InputController();

let keyboardPlugin = new KeyboardPlugin(inputController);
let mousePlugin = new MousePlugin(inputController);

inputController.addPlugin(keyboardPlugin);
inputController.addPlugin(mousePlugin);

inputController.bindActions(leftAktiv);
inputController.bindActions(rightAktiv);
inputController.bindActions(jumpSecondAktiv);
inputController.bindActions(leftSecondAktiv);
inputController.bindActions(rightSecondAktiv);


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

enableLeft.onclick = () => {
    inputController.enableAction("left");
    printDebug("Активность включена");
}


addNewActivButton.onclick = () => {
    let jumpAktiv = new ActivWithKeyCode("jump", true, [32]);

    inputController.bindActions(jumpAktiv);
    printDebug("Байнд дополнительное действие прыжок ");
}

setInterval(() => {
    let rect = interactiveObject.getBoundingClientRect();
    if (inputController.isActionActive('left')) {
        //console.log(rect);
        interactiveObject.style.position = 'fixed';
        interactiveObject.style.left = (rect.left - 10) + 'px';
        interactiveObject.style.top = (rect.top) + 'px';
    }
    if (inputController.isActionActive('right')) {
        interactiveObject.style.position = 'fixed';
        interactiveObject.style.left = (rect.left + 10) + 'px';
        interactiveObject.style.top = (rect.top) + 'px';
    }
    if (inputController.isActionActive('jump')) {
        //console.log(interactiveObject.style);
        if (interactiveObject.style['background-color'] === 'black') {
            interactiveObject.style['background-color'] = 'green';
        }
        else {
            interactiveObject.style['background-color'] = 'black';
        }

    }
}
    , 100)
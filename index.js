// 'use strict';
//
// function showHideAll(shouldShow, selector) {
//     let elements = document.querySelectorAll(selector);
//     elements.forEach(function (e) {
//         e.style.display = shouldShow ? '' : 'none';
//     })
// }
//
// function readText(id) {
//     return document.getElementById(id).value;
// }
//
// function readBoolean(id) {
//     return document.getElementById(id).checked;
// }
//
// /* get references to DOM elements */
// let element = document.getElementById("output");
// let outputTextNode = document.createTextNode("");
// element.appendChild(outputTextNode);
//
// let abcDropdown = document.getElementById("abc");
// let defDropdown = document.getElementById("def-dropdown");
// let defCheckbox = document.getElementById("def-checkbox");
// /* end */
//
//
// /* set up listeners */
// function regenerateYaml() {
//     console.log("triggered: regen yaml");
//     outputTextNode.nodeValue = formatModel(readValuesFromUi());
// }
//
// let inputs = document.querySelectorAll("input");
// inputs.forEach(function (e) {
//     console.log("setting up input listener");
//     // which event to use: 'input' or 'change'?
//     //   From the docs: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
//     //     "Unlike the input event, the change event is not necessarily fired for each alteration to an element's value."
//     //   compare to: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
//     e.addEventListener('input', regenerateYaml);
// });
// let selects = document.querySelectorAll("select");
// selects.forEach(function (e) {
//     console.log("setting up select listener");
//     e.addEventListener('change', regenerateYaml);
// });
//
//
// let didChangeAbc = () => {
//     let value = abcDropdown.value;
//     showHideAll(false, ".abc-type");
//     showHideAll(true, `.abc-${value}`);
// };
// abcDropdown.addEventListener('change', didChangeAbc);
//
// defCheckbox.addEventListener('change', () => {
//     let shouldShow = defCheckbox.checked;
//     showHideAll(shouldShow, ".def");
// });
//
// let didChangeDef = () => {
//     let value = defDropdown.value;
//     showHideAll(false, ".def-type");
//     showHideAll(true, `.def-${value}`);
// };
// defDropdown.addEventListener('change', didChangeDef);
// /* end */
//
//
// /* set up initial state */
// defCheckbox.setAttribute("checked", "true");
//
// didChangeAbc();
//
// didChangeDef();
//
// regenerateYaml();
// /* end */

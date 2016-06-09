import { Component, OnInit } from '@angular/core';

import { CaptureKeystrokeButtonComponent } from '../widgets/capture-keystroke-button.component';

import { KeyAction } from '../../../../config-serializer/config-items/KeyAction';
import { KeystrokeAction } from '../../../../config-serializer/config-items/KeystrokeAction';
import { KeystrokeModifiersAction } from '../../../../config-serializer/config-items/KeystrokeModifiersAction';
import { KeystrokeWithModifiersAction } from '../../../../config-serializer/config-items/KeystrokeWithModifiersAction';
import { KeyActionSaver } from '../key-action-saver';

@Component({
    moduleId: module.id,
    selector: 'keypress-tab',
    template:
    `
        <div class="scancode-options" style="margin-bottom:10px; margin-top:2px">
            <b class="setting-label" style="position:relative; top:2px;">Scancode:</b>
            <select class="scancode" style="width: 200px">

            </select>
            <capture-keystroke-button></capture-keystroke-button>
        </div>
        <div class="scancode-options">
            <b class="setting-label" style="position:relative; top:-9px; margin-right:4px;">Modifiers:</b>
            <div class="btn-toolbar modifiers" style="display:inline-block">
                <div class="btn-group btn-group-sm modifiers__left">
                    <button type="button" class="btn btn-default" *ngFor="let modifier of leftModifiers">
                        {{modifier}}
                    </button>
                </div>
                <div class="btn-group btn-group-sm modifiers__right">
                    <button type="button" class="btn btn-default" *ngFor="let modifier of rightModifiers">
                        {{modifier}}
                    </button>
                </div>
            </div>
        </div>
        <div style="margin-top: 3rem;">
            <b class="setting-label" style="position:relative;">Long press action:</b>
            <select class="secondary-role" style="width:135px">
                    <option> None </option>
                    <optgroup label="Modifiers">
                        <option> LShift </option>
                        <option> LCtrl </option>
                        <option> LSuper </option>
                        <option> LAlt </option>
                        <option> RShift </option>
                        <option> RCtrl </option>
                        <option> RSuper </option>
                        <option> RAlt </option>
                     </optgroup>
                     <optgroup label="Layer switcher">
                        <option> Mod </option>
                        <option> Mouse </option>
                        <option> Fn </option>
                     </optgroup>
            </select>
            <i class="fa fa-question-circle" style="margin-left:5px" data-toggle="tooltip" data-placement="right"
                    title="This action happens when the key is being held along with another key.">
            </i>
        </div>
    `,
    styles: [require('./keypress-tab.component.scss')],
    directives: [CaptureKeystrokeButtonComponent]
})
export class KeypressTabComponent implements OnInit, KeyActionSaver {
    private leftModifiers: string[];
    private rightModifiers: string[];

    private leftModifierSelects: boolean[];
    private rightModifierSelects: boolean[];

    constructor() {
        this.leftModifiers = ['LShift', 'LCtrl', 'LSuper', 'LAlt'];
        this.rightModifiers = ['RShift', 'RCtrl', 'RSuper', 'RAlt'];
    }

    ngOnInit() { }

    getKeyAction(): KeystrokeAction | KeystrokeModifiersAction | KeystrokeWithModifiersAction {
        return;
    }

    keyActionValid(): boolean {
        return false;
    }

    toKeyAction(): KeyAction {
        return undefined;
    }
}

import { NgModule, Component, Input, Output, EventEmitter, ContentChildren, forwardRef, ViewChild, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, PrimeTemplate } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const CHIPS_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Chips),
    multi: true
};
export class Chips {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.allowDuplicate = true;
        this.onAdd = new EventEmitter();
        this.onRemove = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onChipClick = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
        this.updateFilledState();
    }
    onClick() {
        this.inputViewChild.nativeElement.focus();
    }
    onInput() {
        this.updateFilledState();
    }
    onPaste(event) {
        if (!this.disabled) {
            if (this.separator) {
                let pastedData = (event.clipboardData || window['clipboardData']).getData('Text');
                pastedData.split(this.separator).forEach(val => {
                    this.addItem(event, val, true);
                });
                this.inputViewChild.nativeElement.value = '';
            }
            this.updateFilledState();
        }
    }
    updateFilledState() {
        if (!this.value || this.value.length === 0) {
            this.filled = (this.inputViewChild && this.inputViewChild.nativeElement && this.inputViewChild.nativeElement.value != '');
        }
        else {
            this.filled = true;
        }
    }
    onItemClick(event, item) {
        this.onChipClick.emit({
            originalEvent: event,
            value: item
        });
    }
    writeValue(value) {
        this.value = value;
        this.updateMaxedOut();
        this.updateFilledState();
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
        this.cd.markForCheck();
    }
    resolveFieldData(data, field) {
        if (data && field) {
            if (field.indexOf('.') == -1) {
                return data[field];
            }
            else {
                let fields = field.split('.');
                let value = data;
                for (var i = 0, len = fields.length; i < len; ++i) {
                    value = value[fields[i]];
                }
                return value;
            }
        }
        else {
            return null;
        }
    }
    onInputFocus(event) {
        this.focus = true;
        this.onFocus.emit(event);
    }
    onInputBlur(event) {
        this.focus = false;
        if (this.addOnBlur && this.inputViewChild.nativeElement.value) {
            this.addItem(event, this.inputViewChild.nativeElement.value, false);
        }
        this.onModelTouched();
        this.onBlur.emit(event);
    }
    removeItem(event, index) {
        if (this.disabled) {
            return;
        }
        let removedItem = this.value[index];
        this.value = this.value.filter((val, i) => i != index);
        this.onModelChange(this.value);
        this.onRemove.emit({
            originalEvent: event,
            value: removedItem
        });
        this.updateFilledState();
        this.updateMaxedOut();
    }
    addItem(event, item, preventDefault) {
        this.value = this.value || [];
        if (item && item.trim().length) {
            if (this.allowDuplicate || this.value.indexOf(item) === -1) {
                this.value = [...this.value, item];
                this.onModelChange(this.value);
                this.onAdd.emit({
                    originalEvent: event,
                    value: item
                });
            }
        }
        this.updateFilledState();
        this.updateMaxedOut();
        this.inputViewChild.nativeElement.value = '';
        if (preventDefault) {
            event.preventDefault();
        }
    }
    onKeydown(event) {
        switch (event.which) {
            //backspace
            case 8:
                if (this.inputViewChild.nativeElement.value.length === 0 && this.value && this.value.length > 0) {
                    this.value = [...this.value];
                    let removedItem = this.value.pop();
                    this.onModelChange(this.value);
                    this.onRemove.emit({
                        originalEvent: event,
                        value: removedItem
                    });
                    this.updateFilledState();
                }
                break;
            //enter
            case 13:
                this.addItem(event, this.inputViewChild.nativeElement.value, true);
                break;
            case 9:
                if (this.addOnTab && this.inputViewChild.nativeElement.value !== '') {
                    this.addItem(event, this.inputViewChild.nativeElement.value, true);
                }
                break;
            default:
                if (this.max && this.value && this.max === this.value.length) {
                    event.preventDefault();
                }
                else if (this.separator) {
                    if (this.separator === ',' && event.which === 188) {
                        this.addItem(event, this.inputViewChild.nativeElement.value, true);
                    }
                }
                break;
        }
    }
    updateMaxedOut() {
        if (this.inputViewChild && this.inputViewChild.nativeElement) {
            if (this.max && this.value && this.max === this.value.length)
                this.inputViewChild.nativeElement.disabled = true;
            else
                this.inputViewChild.nativeElement.disabled = this.disabled || false;
        }
    }
}
Chips.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: Chips, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Chips.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.6", type: Chips, selector: "p-chips", inputs: { style: "style", styleClass: "styleClass", disabled: "disabled", field: "field", placeholder: "placeholder", max: "max", ariaLabelledBy: "ariaLabelledBy", tabindex: "tabindex", inputId: "inputId", allowDuplicate: "allowDuplicate", inputStyle: "inputStyle", inputStyleClass: "inputStyleClass", addOnTab: "addOnTab", addOnBlur: "addOnBlur", separator: "separator" }, outputs: { onAdd: "onAdd", onRemove: "onRemove", onFocus: "onFocus", onBlur: "onBlur", onChipClick: "onChipClick" }, host: { properties: { "class.p-inputwrapper-filled": "filled", "class.p-inputwrapper-focus": "focus" }, classAttribute: "p-element p-inputwrapper" }, providers: [CHIPS_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "inputViewChild", first: true, predicate: ["inputtext"], descendants: true }], ngImport: i0, template: `
        <div [ngClass]="'p-chips p-component'" [ngStyle]="style" [class]="styleClass" (click)="onClick()">
            <ul [ngClass]="{'p-inputtext p-chips-multiple-container':true,'p-focus':focus,'p-disabled':disabled}">
                <li #token *ngFor="let item of value; let i = index;" class="p-chips-token" (click)="onItemClick($event, item)">
                    <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                    <span *ngIf="!itemTemplate" class="p-chips-token-label">{{field ? resolveFieldData(item,field) : item}}</span>
                    <span *ngIf="!disabled" class="p-chips-token-icon pi pi-times-circle" (click)="removeItem($event,i)"></span>
                </li>
                <li class="p-chips-input-token">
                    <input #inputtext type="text" [attr.id]="inputId" [attr.placeholder]="(value && value.length ? null : placeholder)" [attr.tabindex]="tabindex" (keydown)="onKeydown($event)"
                    (input)="onInput()" (paste)="onPaste($event)" [attr.aria-labelledby]="ariaLabelledBy" (focus)="onInputFocus($event)" (blur)="onInputBlur($event)" [disabled]="disabled" [ngStyle]="inputStyle" [class]="inputStyleClass">
                </li>
            </ul>
        </div>
    `, isInline: true, styles: [".p-chips{display:inline-flex}.p-chips-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:flex;align-items:center;flex-wrap:wrap}.p-chips-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-chips-input-token{flex:1 1 auto;display:inline-flex}.p-chips-token-icon{cursor:pointer}.p-chips-input-token input{border:0 none;outline:0 none;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-chips{display:flex}\n"], directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: Chips, decorators: [{
            type: Component,
            args: [{ selector: 'p-chips', template: `
        <div [ngClass]="'p-chips p-component'" [ngStyle]="style" [class]="styleClass" (click)="onClick()">
            <ul [ngClass]="{'p-inputtext p-chips-multiple-container':true,'p-focus':focus,'p-disabled':disabled}">
                <li #token *ngFor="let item of value; let i = index;" class="p-chips-token" (click)="onItemClick($event, item)">
                    <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                    <span *ngIf="!itemTemplate" class="p-chips-token-label">{{field ? resolveFieldData(item,field) : item}}</span>
                    <span *ngIf="!disabled" class="p-chips-token-icon pi pi-times-circle" (click)="removeItem($event,i)"></span>
                </li>
                <li class="p-chips-input-token">
                    <input #inputtext type="text" [attr.id]="inputId" [attr.placeholder]="(value && value.length ? null : placeholder)" [attr.tabindex]="tabindex" (keydown)="onKeydown($event)"
                    (input)="onInput()" (paste)="onPaste($event)" [attr.aria-labelledby]="ariaLabelledBy" (focus)="onInputFocus($event)" (blur)="onInputBlur($event)" [disabled]="disabled" [ngStyle]="inputStyle" [class]="inputStyleClass">
                </li>
            </ul>
        </div>
    `, host: {
                        'class': 'p-element p-inputwrapper',
                        '[class.p-inputwrapper-filled]': 'filled',
                        '[class.p-inputwrapper-focus]': 'focus'
                    }, providers: [CHIPS_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, styles: [".p-chips{display:inline-flex}.p-chips-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:flex;align-items:center;flex-wrap:wrap}.p-chips-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-chips-input-token{flex:1 1 auto;display:inline-flex}.p-chips-token-icon{cursor:pointer}.p-chips-input-token input{border:0 none;outline:0 none;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-chips{display:flex}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], disabled: [{
                type: Input
            }], field: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], max: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], inputId: [{
                type: Input
            }], allowDuplicate: [{
                type: Input
            }], inputStyle: [{
                type: Input
            }], inputStyleClass: [{
                type: Input
            }], addOnTab: [{
                type: Input
            }], addOnBlur: [{
                type: Input
            }], separator: [{
                type: Input
            }], onAdd: [{
                type: Output
            }], onRemove: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], onChipClick: [{
                type: Output
            }], inputViewChild: [{
                type: ViewChild,
                args: ['inputtext']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class ChipsModule {
}
ChipsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: ChipsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ChipsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: ChipsModule, declarations: [Chips], imports: [CommonModule, InputTextModule, SharedModule], exports: [Chips, InputTextModule, SharedModule] });
ChipsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: ChipsModule, imports: [[CommonModule, InputTextModule, SharedModule], InputTextModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: ChipsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, InputTextModule, SharedModule],
                    exports: [Chips, InputTextModule, SharedModule],
                    declarations: [Chips]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY2hpcHMvY2hpcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQVksS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQWtCLGVBQWUsRUFBdUIsVUFBVSxFQUFDLFNBQVMsRUFBQyx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDaE8sT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxZQUFZLEVBQUMsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsaUJBQWlCLEVBQXVCLE1BQU0sZ0JBQWdCLENBQUM7OztBQUV2RSxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBUTtJQUN2QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ3BDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQTZCRixNQUFNLE9BQU8sS0FBSztJQTREZCxZQUFtQixFQUFjLEVBQVMsRUFBcUI7UUFBNUMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBeEN0RCxtQkFBYyxHQUFZLElBQUksQ0FBQztRQVk5QixVQUFLLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFOUMsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVoRCxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFL0MsZ0JBQVcsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FB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QUFXO3lHQUFYLFdBQVcsaUJBclFYLEtBQUssYUFpUUosWUFBWSxFQUFDLGVBQWUsRUFBQyxZQUFZLGFBalExQyxLQUFLLEVBa1FFLGVBQWUsRUFBQyxZQUFZO3lHQUduQyxXQUFXLFlBSlgsQ0FBQyxZQUFZLEVBQUMsZUFBZSxFQUFDLFlBQVksQ0FBQyxFQUNwQyxlQUFlLEVBQUMsWUFBWTsyRkFHbkMsV0FBVztrQkFMdkIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsZUFBZSxFQUFDLFlBQVksQ0FBQztvQkFDcEQsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFDLGVBQWUsRUFBQyxZQUFZLENBQUM7b0JBQzdDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQztpQkFDeEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxFbGVtZW50UmVmLElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXIsQWZ0ZXJDb250ZW50SW5pdCxDb250ZW50Q2hpbGRyZW4sUXVlcnlMaXN0LFRlbXBsYXRlUmVmLGZvcndhcmRSZWYsVmlld0NoaWxkLENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1NoYXJlZE1vZHVsZSxQcmltZVRlbXBsYXRlfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge0lucHV0VGV4dE1vZHVsZX0gZnJvbSAncHJpbWVuZy9pbnB1dHRleHQnO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGNvbnN0IENISVBTX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBDaGlwcyksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtY2hpcHMnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW25nQ2xhc3NdPVwiJ3AtY2hpcHMgcC1jb21wb25lbnQnXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIChjbGljayk9XCJvbkNsaWNrKClcIj5cbiAgICAgICAgICAgIDx1bCBbbmdDbGFzc109XCJ7J3AtaW5wdXR0ZXh0IHAtY2hpcHMtbXVsdGlwbGUtY29udGFpbmVyJzp0cnVlLCdwLWZvY3VzJzpmb2N1cywncC1kaXNhYmxlZCc6ZGlzYWJsZWR9XCI+XG4gICAgICAgICAgICAgICAgPGxpICN0b2tlbiAqbmdGb3I9XCJsZXQgaXRlbSBvZiB2YWx1ZTsgbGV0IGkgPSBpbmRleDtcIiBjbGFzcz1cInAtY2hpcHMtdG9rZW5cIiAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBpdGVtfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFpdGVtVGVtcGxhdGVcIiBjbGFzcz1cInAtY2hpcHMtdG9rZW4tbGFiZWxcIj57e2ZpZWxkID8gcmVzb2x2ZUZpZWxkRGF0YShpdGVtLGZpZWxkKSA6IGl0ZW19fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCIhZGlzYWJsZWRcIiBjbGFzcz1cInAtY2hpcHMtdG9rZW4taWNvbiBwaSBwaS10aW1lcy1jaXJjbGVcIiAoY2xpY2spPVwicmVtb3ZlSXRlbSgkZXZlbnQsaSlcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJwLWNoaXBzLWlucHV0LXRva2VuXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCAjaW5wdXR0ZXh0IHR5cGU9XCJ0ZXh0XCIgW2F0dHIuaWRdPVwiaW5wdXRJZFwiIFthdHRyLnBsYWNlaG9sZGVyXT1cIih2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPyBudWxsIDogcGxhY2Vob2xkZXIpXCIgW2F0dHIudGFiaW5kZXhdPVwidGFiaW5kZXhcIiAoa2V5ZG93bik9XCJvbktleWRvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIChpbnB1dCk9XCJvbklucHV0KClcIiAocGFzdGUpPVwib25QYXN0ZSgkZXZlbnQpXCIgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCIgKGZvY3VzKT1cIm9uSW5wdXRGb2N1cygkZXZlbnQpXCIgKGJsdXIpPVwib25JbnB1dEJsdXIoJGV2ZW50KVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFtuZ1N0eWxlXT1cImlucHV0U3R5bGVcIiBbY2xhc3NdPVwiaW5wdXRTdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50IHAtaW5wdXR3cmFwcGVyJyxcbiAgICAgICAgJ1tjbGFzcy5wLWlucHV0d3JhcHBlci1maWxsZWRdJzogJ2ZpbGxlZCcsXG4gICAgICAgICdbY2xhc3MucC1pbnB1dHdyYXBwZXItZm9jdXNdJzogJ2ZvY3VzJ1xuICAgIH0sXG4gICAgcHJvdmlkZXJzOiBbQ0hJUFNfVkFMVUVfQUNDRVNTT1JdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vY2hpcHMuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ2hpcHMgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGZpZWxkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbWF4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWxsZWRCeTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdGFiaW5kZXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFsbG93RHVwbGljYXRlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGlucHV0U3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGlucHV0U3R5bGVDbGFzczogYW55O1xuXG4gICAgQElucHV0KCkgYWRkT25UYWI6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBhZGRPbkJsdXI6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzZXBhcmF0b3I6IHN0cmluZztcblxuICAgIEBPdXRwdXQoKSBvbkFkZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25SZW1vdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uRm9jdXM6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQmx1cjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25DaGlwQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQFZpZXdDaGlsZCgnaW5wdXR0ZXh0JykgaW5wdXRWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBwdWJsaWMgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgdmFsdWU6IGFueTtcblxuICAgIG9uTW9kZWxDaGFuZ2U6IEZ1bmN0aW9uID0gKCkgPT4ge307XG5cbiAgICBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIHZhbHVlQ2hhbmdlZDogYm9vbGVhbjtcblxuICAgIGZvY3VzOiBib29sZWFuO1xuXG4gICAgZmlsbGVkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2goaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdpdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlZFN0YXRlKCk7XG4gICAgfVxuXG4gICAgb25DbGljaygpIHtcbiAgICAgICAgdGhpcy5pbnB1dFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgb25JbnB1dCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgIH1cblxuICAgIG9uUGFzdGUoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZXBhcmF0b3IpIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFzdGVkRGF0YSA9IChldmVudC5jbGlwYm9hcmREYXRhIHx8IHdpbmRvd1snY2xpcGJvYXJkRGF0YSddKS5nZXREYXRhKCdUZXh0Jyk7XG4gICAgICAgICAgICAgICAgcGFzdGVkRGF0YS5zcGxpdCh0aGlzLnNlcGFyYXRvcikuZm9yRWFjaCh2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEl0ZW0oZXZlbnQsIHZhbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUZpbGxlZFN0YXRlKCkge1xuICAgICAgICBpZiAoIXRoaXMudmFsdWUgfHwgdGhpcy52YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZmlsbGVkID0gKHRoaXMuaW5wdXRWaWV3Q2hpbGQgJiYgdGhpcy5pbnB1dFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50ICYmIHRoaXMuaW5wdXRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC52YWx1ZSAhPSAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZpbGxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkl0ZW1DbGljayhldmVudDogRXZlbnQsIGl0ZW06IGFueSkge1xuICAgICAgICB0aGlzLm9uQ2hpcENsaWNrLmVtaXQoe1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICB2YWx1ZTogaXRlbVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVNYXhlZE91dCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBzZXREaXNhYmxlZFN0YXRlKHZhbDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdmFsO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHJlc29sdmVGaWVsZERhdGEoZGF0YTogYW55LCBmaWVsZDogc3RyaW5nKTogYW55IHtcbiAgICAgICAgaWYgKGRhdGEgJiYgZmllbGQpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZC5pbmRleE9mKCcuJykgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVtmaWVsZF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgZmllbGRzOiBzdHJpbmdbXSA9IGZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gZGF0YTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwLCBsZW4gPSBmaWVsZHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZVtmaWVsZHNbaV1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSW5wdXRGb2N1cyhldmVudDogRm9jdXNFdmVudCkge1xuICAgICAgICB0aGlzLmZvY3VzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkZvY3VzLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uSW5wdXRCbHVyKGV2ZW50OiBGb2N1c0V2ZW50KSB7XG4gICAgICAgIHRoaXMuZm9jdXMgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuYWRkT25CbHVyICYmIHRoaXMuaW5wdXRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGV2ZW50LCB0aGlzLmlucHV0Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQudmFsdWUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIHJlbW92ZUl0ZW0oZXZlbnQ6IEV2ZW50LCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVtb3ZlZEl0ZW0gPSB0aGlzLnZhbHVlW2luZGV4XTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuZmlsdGVyKCh2YWwsIGkpID0+IGkhPWluZGV4KTtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICB0aGlzLm9uUmVtb3ZlLmVtaXQoe1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICB2YWx1ZTogcmVtb3ZlZEl0ZW1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVNYXhlZE91dCgpO1xuICAgIH1cblxuICAgIGFkZEl0ZW0oZXZlbnQ6IEV2ZW50LCBpdGVtOiBzdHJpbmcsIHByZXZlbnREZWZhdWx0OiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlfHxbXTtcbiAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS50cmltKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hbGxvd0R1cGxpY2F0ZSB8fCB0aGlzLnZhbHVlLmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFsuLi50aGlzLnZhbHVlLCBpdGVtXTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkFkZC5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpdGVtXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZU1heGVkT3V0KCk7XG4gICAgICAgIHRoaXMuaW5wdXRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuXG4gICAgICAgIGlmIChwcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICBzd2l0Y2goZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgIC8vYmFja3NwYWNlXG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC52YWx1ZS5sZW5ndGggPT09IDAgJiYgdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFsuLi50aGlzLnZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlbW92ZWRJdGVtID0gdGhpcy52YWx1ZS5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3ZlLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVtb3ZlZEl0ZW1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy9lbnRlclxuICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEl0ZW0oZXZlbnQsIHRoaXMuaW5wdXRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC52YWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFkZE9uVGFiICYmIHRoaXMuaW5wdXRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRJdGVtKGV2ZW50LCB0aGlzLmlucHV0Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQudmFsdWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heCAmJiB0aGlzLnZhbHVlICYmIHRoaXMubWF4ID09PSB0aGlzLnZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnNlcGFyYXRvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXBhcmF0b3IgPT09ICcsJyAmJiBldmVudC53aGljaCA9PT0gMTg4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEl0ZW0oZXZlbnQsIHRoaXMuaW5wdXRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC52YWx1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZU1heGVkT3V0KCkge1xuICAgICAgICBpZiAodGhpcy5pbnB1dFZpZXdDaGlsZCAmJiB0aGlzLmlucHV0Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1heCAmJiB0aGlzLnZhbHVlICYmIHRoaXMubWF4ID09PSB0aGlzLnZhbHVlLmxlbmd0aClcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZWQgfHwgZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSxJbnB1dFRleHRNb2R1bGUsU2hhcmVkTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQ2hpcHMsSW5wdXRUZXh0TW9kdWxlLFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbQ2hpcHNdXG59KVxuZXhwb3J0IGNsYXNzIENoaXBzTW9kdWxlIHsgfVxuIl19
import { NgModule, Component, ViewChild, Input, Output, EventEmitter, ContentChildren, forwardRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SharedModule, PrimeTemplate, TranslationKeys } from 'primeng/api';
import { DomHandler, ConnectedOverlayScrollHandler } from 'primeng/dom';
import { ObjectUtils, UniqueComponentId, ZIndexUtils } from 'primeng/utils';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/cdk/scrolling";
import * as i3 from "@angular/common";
import * as i4 from "primeng/button";
import * as i5 from "primeng/ripple";
export const AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutoComplete),
    multi: true
};
export class AutoComplete {
    constructor(el, renderer, cd, differs, config, overlayService) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.differs = differs;
        this.config = config;
        this.overlayService = overlayService;
        this.minLength = 1;
        this.delay = 300;
        this.type = 'text';
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.dropdownIcon = "pi pi-chevron-down";
        this.unique = true;
        this.completeOnFocus = false;
        this.completeMethod = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.onUnselect = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onDropdownClick = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onKeyUp = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.scrollHeight = '200px';
        this.dropdownMode = 'blank';
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
        this.autocomplete = 'off';
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.overlayVisible = false;
        this.focus = false;
        this.inputFieldValue = null;
        this.differ = differs.find([]).create(null);
        this.listId = UniqueComponentId() + '_list';
    }
    get suggestions() {
        return this._suggestions;
    }
    set suggestions(val) {
        this._suggestions = val;
        this.handleSuggestionsChange();
    }
    ngAfterViewChecked() {
        //Use timeouts as since Angular 4.2, AfterViewChecked is broken and not called after panel is updated
        if (this.suggestionsUpdated && this.overlay && this.overlay.offsetParent) {
            setTimeout(() => {
                if (this.overlay) {
                    this.alignOverlay();
                }
            }, 1);
            this.suggestionsUpdated = false;
        }
        if (this.highlightOptionChanged) {
            setTimeout(() => {
                if (this.overlay && this.itemsWrapper) {
                    let listItem = DomHandler.findSingle(this.overlay, 'li.p-highlight');
                    if (listItem) {
                        DomHandler.scrollInView(this.itemsWrapper, listItem);
                    }
                    if (this.virtualScroll && this.viewPort) {
                        let range = this.viewPort.getRenderedRange();
                        this.updateVirtualScrollSelectedIndex();
                        if (range.start > this.virtualScrollSelectedIndex || range.end < this.virtualScrollSelectedIndex) {
                            this.viewPort.scrollToIndex(this.virtualScrollSelectedIndex);
                        }
                    }
                }
            }, 1);
            this.highlightOptionChanged = false;
        }
    }
    handleSuggestionsChange() {
        if (this._suggestions != null && this.loading) {
            this.highlightOption = null;
            if (this._suggestions.length) {
                this.noResults = false;
                this.show();
                this.suggestionsUpdated = true;
                if (this.autoHighlight) {
                    this.highlightOption = this._suggestions[0];
                }
            }
            else {
                this.noResults = true;
                if (this.showEmptyMessage) {
                    this.show();
                    this.suggestionsUpdated = true;
                }
                else {
                    this.hide();
                }
            }
            this.loading = false;
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'group':
                    this.groupTemplate = item.template;
                    break;
                case 'selectedItem':
                    this.selectedItemTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'empty':
                    this.emptyTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    updateVirtualScrollSelectedIndex() {
        if (this.highlightOption && this.suggestions && this.suggestions.length) {
            this.virtualScrollSelectedIndex = this.findOptionIndex(this.highlightOption, this.suggestions);
        }
    }
    writeValue(value) {
        this.value = value;
        this.filled = this.value && this.value != '';
        this.updateInputField();
        this.cd.markForCheck();
    }
    getOptionGroupChildren(optionGroup) {
        return this.optionGroupChildren ? ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren) : optionGroup.items;
    }
    getOptionGroupLabel(optionGroup) {
        return this.optionGroupLabel ? ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel) : (optionGroup.label != undefined ? optionGroup.label : optionGroup);
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
    onInput(event) {
        // When an input element with a placeholder is clicked, the onInput event is invoked in IE.
        if (!this.inputKeyDown && DomHandler.isIE()) {
            return;
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        let value = event.target.value;
        if (!this.multiple && !this.forceSelection) {
            this.onModelChange(value);
        }
        if (value.length === 0 && !this.multiple) {
            this.hide();
            this.onClear.emit(event);
            this.onModelChange(value);
        }
        if (value.length >= this.minLength) {
            this.timeout = setTimeout(() => {
                this.search(event, value);
            }, this.delay);
        }
        else {
            this.hide();
        }
        this.updateFilledState();
        this.inputKeyDown = false;
    }
    onInputClick(event) {
        if (this.documentClickListener) {
            this.inputClick = true;
        }
    }
    search(event, query) {
        //allow empty string but not undefined or null
        if (query === undefined || query === null) {
            return;
        }
        this.loading = true;
        this.completeMethod.emit({
            originalEvent: event,
            query: query
        });
    }
    selectItem(option, focus = true) {
        if (this.forceSelectionUpdateModelTimeout) {
            clearTimeout(this.forceSelectionUpdateModelTimeout);
            this.forceSelectionUpdateModelTimeout = null;
        }
        if (this.multiple) {
            this.multiInputEL.nativeElement.value = '';
            this.value = this.value || [];
            if (!this.isSelected(option) || !this.unique) {
                this.value = [...this.value, option];
                this.onModelChange(this.value);
            }
        }
        else {
            this.inputEL.nativeElement.value = this.resolveFieldData(option);
            this.value = option;
            this.onModelChange(this.value);
        }
        this.onSelect.emit(option);
        this.updateFilledState();
        if (focus) {
            this.itemClicked = true;
            this.focusInput();
        }
    }
    show() {
        if (this.multiInputEL || this.inputEL) {
            let hasFocus = this.multiple ?
                this.multiInputEL.nativeElement.ownerDocument.activeElement == this.multiInputEL.nativeElement :
                this.inputEL.nativeElement.ownerDocument.activeElement == this.inputEL.nativeElement;
            if (!this.overlayVisible && hasFocus) {
                this.overlayVisible = true;
            }
        }
    }
    onOverlayAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.overlay = event.element;
                this.itemsWrapper = this.virtualScroll ? DomHandler.findSingle(this.overlay, '.cdk-virtual-scroll-viewport') : this.overlay;
                this.appendOverlay();
                if (this.autoZIndex) {
                    ZIndexUtils.set('overlay', this.overlay, this.baseZIndex + this.config.zIndex.overlay);
                }
                this.alignOverlay();
                this.bindDocumentClickListener();
                this.bindDocumentResizeListener();
                this.bindScrollListener();
                this.onShow.emit(event);
                break;
            case 'void':
                this.onOverlayHide();
                break;
        }
    }
    onOverlayAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                if (this.autoZIndex) {
                    ZIndexUtils.clear(event.element);
                }
                break;
        }
    }
    onOverlayClick(event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }
    appendOverlay() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.overlay);
            else
                DomHandler.appendChild(this.overlay, this.appendTo);
            if (!this.overlay.style.minWidth) {
                this.overlay.style.minWidth = DomHandler.getWidth(this.el.nativeElement.children[0]) + 'px';
            }
        }
    }
    resolveFieldData(value) {
        let data = this.field ? ObjectUtils.resolveFieldData(value, this.field) : value;
        return data !== (null || undefined) ? data : '';
    }
    restoreOverlayAppend() {
        if (this.overlay && this.appendTo) {
            this.el.nativeElement.appendChild(this.overlay);
        }
    }
    alignOverlay() {
        if (this.appendTo)
            DomHandler.absolutePosition(this.overlay, (this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement));
        else
            DomHandler.relativePosition(this.overlay, (this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement));
    }
    hide() {
        this.overlayVisible = false;
        this.cd.markForCheck();
    }
    handleDropdownClick(event) {
        if (!this.overlayVisible) {
            this.focusInput();
            let queryValue = this.multiple ? this.multiInputEL.nativeElement.value : this.inputEL.nativeElement.value;
            if (this.dropdownMode === 'blank')
                this.search(event, '');
            else if (this.dropdownMode === 'current')
                this.search(event, queryValue);
            this.onDropdownClick.emit({
                originalEvent: event,
                query: queryValue
            });
        }
        else {
            this.hide();
        }
    }
    focusInput() {
        if (this.multiple)
            this.multiInputEL.nativeElement.focus();
        else
            this.inputEL.nativeElement.focus();
    }
    get emptyMessageLabel() {
        return this.emptyMessage || this.config.getTranslation(TranslationKeys.EMPTY_MESSAGE);
    }
    removeItem(item) {
        let itemIndex = DomHandler.index(item);
        let removedValue = this.value[itemIndex];
        this.value = this.value.filter((val, i) => i != itemIndex);
        this.onModelChange(this.value);
        this.updateFilledState();
        this.onUnselect.emit(removedValue);
    }
    onKeydown(event) {
        if (this.overlayVisible) {
            switch (event.which) {
                //down
                case 40:
                    if (this.group) {
                        let highlightItemIndex = this.findOptionGroupIndex(this.highlightOption, this.suggestions);
                        if (highlightItemIndex !== -1) {
                            let nextItemIndex = highlightItemIndex.itemIndex + 1;
                            if (nextItemIndex < (this.getOptionGroupChildren(this.suggestions[highlightItemIndex.groupIndex]).length)) {
                                this.highlightOption = this.getOptionGroupChildren(this.suggestions[highlightItemIndex.groupIndex])[nextItemIndex];
                                this.highlightOptionChanged = true;
                            }
                            else if (this.suggestions[highlightItemIndex.groupIndex + 1]) {
                                this.highlightOption = this.getOptionGroupChildren(this.suggestions[highlightItemIndex.groupIndex + 1])[0];
                                this.highlightOptionChanged = true;
                            }
                        }
                        else {
                            this.highlightOption = this.getOptionGroupChildren(this.suggestions[0])[0];
                        }
                    }
                    else {
                        let highlightItemIndex = this.findOptionIndex(this.highlightOption, this.suggestions);
                        if (highlightItemIndex != -1) {
                            var nextItemIndex = highlightItemIndex + 1;
                            if (nextItemIndex != (this.suggestions.length)) {
                                this.highlightOption = this.suggestions[nextItemIndex];
                                this.highlightOptionChanged = true;
                            }
                        }
                        else {
                            this.highlightOption = this.suggestions[0];
                        }
                    }
                    event.preventDefault();
                    break;
                //up
                case 38:
                    if (this.group) {
                        let highlightItemIndex = this.findOptionGroupIndex(this.highlightOption, this.suggestions);
                        if (highlightItemIndex !== -1) {
                            let prevItemIndex = highlightItemIndex.itemIndex - 1;
                            if (prevItemIndex >= 0) {
                                this.highlightOption = this.getOptionGroupChildren(this.suggestions[highlightItemIndex.groupIndex])[prevItemIndex];
                                this.highlightOptionChanged = true;
                            }
                            else if (prevItemIndex < 0) {
                                let prevGroup = this.suggestions[highlightItemIndex.groupIndex - 1];
                                if (prevGroup) {
                                    this.highlightOption = this.getOptionGroupChildren(prevGroup)[this.getOptionGroupChildren(prevGroup).length - 1];
                                    this.highlightOptionChanged = true;
                                }
                            }
                        }
                    }
                    else {
                        let highlightItemIndex = this.findOptionIndex(this.highlightOption, this.suggestions);
                        if (highlightItemIndex > 0) {
                            let prevItemIndex = highlightItemIndex - 1;
                            this.highlightOption = this.suggestions[prevItemIndex];
                            this.highlightOptionChanged = true;
                        }
                    }
                    event.preventDefault();
                    break;
                //enter
                case 13:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                        this.hide();
                    }
                    event.preventDefault();
                    break;
                //escape
                case 27:
                    this.hide();
                    event.preventDefault();
                    break;
                //tab
                case 9:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                    }
                    this.hide();
                    break;
            }
        }
        else {
            if (event.which === 40 && this.suggestions) {
                this.search(event, event.target.value);
            }
        }
        if (this.multiple) {
            switch (event.which) {
                //backspace
                case 8:
                    if (this.value && this.value.length && !this.multiInputEL.nativeElement.value) {
                        this.value = [...this.value];
                        const removedValue = this.value.pop();
                        this.onModelChange(this.value);
                        this.updateFilledState();
                        this.onUnselect.emit(removedValue);
                    }
                    break;
            }
        }
        this.inputKeyDown = true;
    }
    onKeyup(event) {
        this.onKeyUp.emit(event);
    }
    onInputFocus(event) {
        if (!this.itemClicked && this.completeOnFocus) {
            let queryValue = this.multiple ? this.multiInputEL.nativeElement.value : this.inputEL.nativeElement.value;
            this.search(event, queryValue);
        }
        this.focus = true;
        this.onFocus.emit(event);
        this.itemClicked = false;
    }
    onInputBlur(event) {
        this.focus = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    }
    onInputChange(event) {
        if (this.forceSelection) {
            let valid = false;
            let inputValue = event.target.value.trim();
            if (this.suggestions) {
                for (let suggestion of this.suggestions) {
                    let itemValue = this.field ? ObjectUtils.resolveFieldData(suggestion, this.field) : suggestion;
                    if (itemValue && inputValue === itemValue.trim()) {
                        valid = true;
                        this.forceSelectionUpdateModelTimeout = setTimeout(() => {
                            this.selectItem(suggestion, false);
                        }, 250);
                        break;
                    }
                }
            }
            if (!valid) {
                if (this.multiple) {
                    this.multiInputEL.nativeElement.value = '';
                }
                else {
                    this.value = null;
                    this.inputEL.nativeElement.value = '';
                }
                this.onClear.emit(event);
                this.onModelChange(this.value);
                this.updateFilledState();
            }
        }
    }
    onInputPaste(event) {
        this.onKeydown(event);
    }
    isSelected(val) {
        let selected = false;
        if (this.value && this.value.length) {
            for (let i = 0; i < this.value.length; i++) {
                if (ObjectUtils.equals(this.value[i], val, this.dataKey)) {
                    selected = true;
                    break;
                }
            }
        }
        return selected;
    }
    findOptionIndex(option, suggestions) {
        let index = -1;
        if (suggestions) {
            for (let i = 0; i < suggestions.length; i++) {
                if (ObjectUtils.equals(option, suggestions[i])) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    findOptionGroupIndex(val, opts) {
        let groupIndex, itemIndex;
        if (opts) {
            for (let i = 0; i < opts.length; i++) {
                groupIndex = i;
                itemIndex = this.findOptionIndex(val, this.getOptionGroupChildren(opts[i]));
                if (itemIndex !== -1) {
                    break;
                }
            }
        }
        if (itemIndex !== -1) {
            return { groupIndex: groupIndex, itemIndex: itemIndex };
        }
        else {
            return -1;
        }
    }
    updateFilledState() {
        if (this.multiple)
            this.filled = (this.value && this.value.length) || (this.multiInputEL && this.multiInputEL.nativeElement && this.multiInputEL.nativeElement.value != '');
        else
            this.filled = (this.inputFieldValue && this.inputFieldValue != '') || (this.inputEL && this.inputEL.nativeElement && this.inputEL.nativeElement.value != '');
        ;
    }
    updateInputField() {
        let formattedValue = this.resolveFieldData(this.value);
        this.inputFieldValue = formattedValue;
        if (this.inputEL && this.inputEL.nativeElement) {
            this.inputEL.nativeElement.value = formattedValue;
        }
        this.updateFilledState();
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentClickListener = this.renderer.listen(documentTarget, 'click', (event) => {
                if (event.which === 3) {
                    return;
                }
                if (!this.inputClick && !this.isDropdownClick(event)) {
                    this.hide();
                }
                this.inputClick = false;
                this.cd.markForCheck();
            });
        }
    }
    isDropdownClick(event) {
        if (this.dropdown) {
            let target = event.target;
            return (target === this.dropdownButton.nativeElement || target.parentNode === this.dropdownButton.nativeElement);
        }
        else {
            return false;
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    bindDocumentResizeListener() {
        this.documentResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.documentResizeListener);
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    }
    onWindowResize() {
        this.hide();
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.containerEL.nativeElement, () => {
                if (this.overlayVisible) {
                    this.hide();
                }
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.overlay = null;
        this.onHide.emit();
    }
    ngOnDestroy() {
        if (this.forceSelectionUpdateModelTimeout) {
            clearTimeout(this.forceSelectionUpdateModelTimeout);
            this.forceSelectionUpdateModelTimeout = null;
        }
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        if (this.overlay) {
            ZIndexUtils.clear(this.overlay);
        }
        this.restoreOverlayAppend();
        this.onOverlayHide();
    }
}
AutoComplete.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: AutoComplete, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.IterableDiffers }, { token: i1.PrimeNGConfig }, { token: i1.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
AutoComplete.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.6", type: AutoComplete, selector: "p-autoComplete", inputs: { minLength: "minLength", delay: "delay", style: "style", panelStyle: "panelStyle", styleClass: "styleClass", panelStyleClass: "panelStyleClass", inputStyle: "inputStyle", inputId: "inputId", inputStyleClass: "inputStyleClass", placeholder: "placeholder", readonly: "readonly", disabled: "disabled", virtualScroll: "virtualScroll", itemSize: "itemSize", maxlength: "maxlength", name: "name", required: "required", size: "size", appendTo: "appendTo", autoHighlight: "autoHighlight", forceSelection: "forceSelection", type: "type", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", ariaLabel: "ariaLabel", dropdownAriaLabel: "dropdownAriaLabel", ariaLabelledBy: "ariaLabelledBy", dropdownIcon: "dropdownIcon", unique: "unique", group: "group", completeOnFocus: "completeOnFocus", field: "field", scrollHeight: "scrollHeight", dropdown: "dropdown", showEmptyMessage: "showEmptyMessage", dropdownMode: "dropdownMode", multiple: "multiple", tabindex: "tabindex", dataKey: "dataKey", emptyMessage: "emptyMessage", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", autofocus: "autofocus", autocomplete: "autocomplete", optionGroupChildren: "optionGroupChildren", optionGroupLabel: "optionGroupLabel", suggestions: "suggestions" }, outputs: { completeMethod: "completeMethod", onSelect: "onSelect", onUnselect: "onUnselect", onFocus: "onFocus", onBlur: "onBlur", onDropdownClick: "onDropdownClick", onClear: "onClear", onKeyUp: "onKeyUp", onShow: "onShow", onHide: "onHide" }, host: { properties: { "class.p-inputwrapper-filled": "filled", "class.p-inputwrapper-focus": "(focus && !disabled) ||\u00A0overlayVisible" }, classAttribute: "p-element p-inputwrapper" }, providers: [AUTOCOMPLETE_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerEL", first: true, predicate: ["container"], descendants: true }, { propertyName: "inputEL", first: true, predicate: ["in"], descendants: true }, { propertyName: "multiInputEL", first: true, predicate: ["multiIn"], descendants: true }, { propertyName: "multiContainerEL", first: true, predicate: ["multiContainer"], descendants: true }, { propertyName: "dropdownButton", first: true, predicate: ["ddBtn"], descendants: true }, { propertyName: "viewPort", first: true, predicate: CdkVirtualScrollViewport, descendants: true }], ngImport: i0, template: `
        <span #container [ngClass]="{'p-autocomplete p-component':true,'p-autocomplete-dd':dropdown,'p-autocomplete-multiple':multiple}" [ngStyle]="style" [class]="styleClass">
            <input *ngIf="!multiple" #in [attr.type]="type" [attr.id]="inputId" [ngStyle]="inputStyle" [class]="inputStyleClass" [autocomplete]="autocomplete" [attr.required]="required" [attr.name]="name"
            class="p-autocomplete-input p-inputtext p-component" [ngClass]="{'p-autocomplete-dd-input':dropdown,'p-disabled': disabled}" [value]="inputFieldValue" aria-autocomplete="list" role="searchbox"
            (click)="onInputClick($event)" (input)="onInput($event)" (keydown)="onKeydown($event)" (keyup)="onKeyup($event)" [attr.autofocus]="autofocus" (focus)="onInputFocus($event)" (blur)="onInputBlur($event)" (change)="onInputChange($event)" (paste)="onInputPaste($event)"
            [attr.placeholder]="placeholder" [attr.size]="size" [attr.maxlength]="maxlength" [attr.tabindex]="tabindex" [readonly]="readonly" [disabled]="disabled" [attr.aria-label]="ariaLabel" [attr.aria-labelledby]="ariaLabelledBy" [attr.aria-required]="required"
            ><ul *ngIf="multiple" #multiContainer class="p-autocomplete-multiple-container p-component p-inputtext" [ngClass]="{'p-disabled':disabled,'p-focus':focus}" (click)="multiIn.focus()">
                <li #token *ngFor="let val of value" class="p-autocomplete-token">
                    <ng-container *ngTemplateOutlet="selectedItemTemplate; context: {$implicit: val}"></ng-container>
                    <span *ngIf="!selectedItemTemplate" class="p-autocomplete-token-label">{{resolveFieldData(val)}}</span>
                    <span  class="p-autocomplete-token-icon pi pi-times-circle" (click)="removeItem(token)" *ngIf="!disabled && !readonly"></span>
                </li>
                <li class="p-autocomplete-input-token">
                    <input #multiIn [attr.type]="type" [attr.id]="inputId" [disabled]="disabled" [attr.placeholder]="(value&&value.length ? null : placeholder)" [attr.tabindex]="tabindex" [attr.maxlength]="maxlength" (input)="onInput($event)"  (click)="onInputClick($event)"
                            (keydown)="onKeydown($event)" [readonly]="readonly" (keyup)="onKeyup($event)" [attr.autofocus]="autofocus" (focus)="onInputFocus($event)" (blur)="onInputBlur($event)" (change)="onInputChange($event)" (paste)="onInputPaste($event)" [autocomplete]="autocomplete"
                            [ngStyle]="inputStyle" [class]="inputStyleClass" [attr.aria-label]="ariaLabel" [attr.aria-labelledby]="ariaLabelledBy" [attr.aria-required]="required"
                            aria-autocomplete="list" [attr.aria-controls]="listId" role="searchbox" [attr.aria-expanded]="overlayVisible" aria-haspopup="true" [attr.aria-activedescendant]="'p-highlighted-option'">
                </li>
            </ul>
            <i *ngIf="loading" class="p-autocomplete-loader pi pi-spinner pi-spin"></i><button #ddBtn type="button" pButton [icon]="dropdownIcon" [attr.aria-label]="dropdownAriaLabel" class="p-autocomplete-dropdown" [disabled]="disabled" pRipple
                (click)="handleDropdownClick($event)" *ngIf="dropdown" [attr.tabindex]="tabindex"></button>
            <div #panel *ngIf="overlayVisible" (click)="onOverlayClick($event)" [ngClass]="['p-autocomplete-panel p-component']" [style.max-height]="virtualScroll ? 'auto' : scrollHeight" [ngStyle]="panelStyle" [class]="panelStyleClass"
                [@overlayAnimation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}" (@overlayAnimation.start)="onOverlayAnimationStart($event)" (@overlayAnimation.done)="onOverlayAnimationEnd($event)">
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                <ul role="listbox" [attr.id]="listId" class="p-autocomplete-items" [ngClass]="{'p-autocomplete-virtualscroll': virtualScroll}">
                    <ng-container *ngIf="group">
                        <ng-template ngFor let-optgroup [ngForOf]="suggestions">
                            <li class="p-autocomplete-item-group">
                                <span *ngIf="!groupTemplate">{{getOptionGroupLabel(optgroup)||'empty'}}</span>
                                <ng-container *ngTemplateOutlet="groupTemplate; context: {$implicit: optgroup}"></ng-container>
                            </li>
                            <ng-container *ngTemplateOutlet="itemslist; context: {$implicit: getOptionGroupChildren(optgroup)}"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="!group">
                            <ng-container *ngTemplateOutlet="itemslist; context: {$implicit: suggestions}"></ng-container>
                    </ng-container>
                    <ng-template #itemslist let-suggestionsToDisplay>
                        <ng-container *ngIf="!virtualScroll; else virtualScrollList">
                            <li role="option" *ngFor="let option of suggestionsToDisplay; let idx = index" class="p-autocomplete-item" pRipple [ngClass]="{'p-highlight': (option === highlightOption)}" [id]="highlightOption == option ? 'p-highlighted-option':''" (click)="selectItem(option)">
                                <span *ngIf="!itemTemplate">{{resolveFieldData(option)}}</span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: option, index: idx}"></ng-container>
                            </li>
                        </ng-container>
                        <ng-template #virtualScrollList>
                            <cdk-virtual-scroll-viewport [ngStyle]="{'height': scrollHeight}" [itemSize]="itemSize" *ngIf="virtualScroll && !noResults">
                                <ng-container *cdkVirtualFor="let option of suggestionsToDisplay; let i = index; let c = count; let f = first; let l = last; let e = even; let o = odd">
                                    <li role="option" class="p-autocomplete-item" pRipple [ngClass]="{'p-highlight': (option === highlightOption)}" [ngStyle]="{'height': itemSize + 'px'}" [id]="highlightOption == option ? 'p-highlighted-option':''" (click)="selectItem(option)">
                                        <span *ngIf="!itemTemplate">{{resolveFieldData(option)}}</span>
                                        <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: option, index: i}"></ng-container>
                                    </li>
                                </ng-container>
                            </cdk-virtual-scroll-viewport>
                        </ng-template>
                        <li *ngIf="noResults && showEmptyMessage" class="p-autocomplete-empty-message">
                            <ng-container *ngIf="!emptyTemplate; else empty">
                                {{emptyMessageLabel}}
                            </ng-container>
                            <ng-container #empty *ngTemplateOutlet="emptyTemplate"></ng-container>
                        </li>
                    </ng-template>
                </ul>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </span>
    `, isInline: true, styles: [".p-autocomplete{display:inline-flex;position:relative}.p-autocomplete-loader{position:absolute;top:50%;margin-top:-.5rem}.p-autocomplete-dd .p-autocomplete-input{flex:1 1 auto;width:1%}.p-autocomplete-dd .p-autocomplete-input,.p-autocomplete-dd .p-autocomplete-multiple-container{border-top-right-radius:0;border-bottom-right-radius:0}.p-autocomplete-dd .p-autocomplete-dropdown{border-top-left-radius:0;border-bottom-left-radius:0}.p-autocomplete .p-autocomplete-panel{min-width:100%;top:0;left:0}.p-autocomplete-panel{position:absolute;overflow:auto}.p-autocomplete-items{margin:0;padding:0;list-style-type:none}.p-autocomplete-item{cursor:pointer;white-space:nowrap;position:relative;overflow:hidden}.p-autocomplete-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:flex;align-items:center;flex-wrap:wrap}.p-autocomplete-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-autocomplete-token-icon{cursor:pointer}.p-autocomplete-input-token{flex:1 1 auto;display:inline-flex}.p-autocomplete-input-token input{border:0 none;outline:0 none;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-autocomplete{display:flex}.p-fluid .p-autocomplete-dd .p-autocomplete-input{width:1%}\n"], components: [{ type: i2.CdkVirtualScrollViewport, selector: "cdk-virtual-scroll-viewport", inputs: ["orientation", "appendOnly"], outputs: ["scrolledIndexChange"] }], directives: [{ type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i4.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { type: i5.Ripple, selector: "[pRipple]" }, { type: i2.CdkFixedSizeVirtualScroll, selector: "cdk-virtual-scroll-viewport[itemSize]", inputs: ["itemSize", "minBufferPx", "maxBufferPx"] }, { type: i2.CdkVirtualForOf, selector: "[cdkVirtualFor][cdkVirtualForOf]", inputs: ["cdkVirtualForOf", "cdkVirtualForTrackBy", "cdkVirtualForTemplate", "cdkVirtualForTemplateCacheSize"] }], animations: [
        trigger('overlayAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                animate('{{showTransitionParams}}')
            ]),
            transition(':leave', [
                animate('{{hideTransitionParams}}', style({ opacity: 0 }))
            ])
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: AutoComplete, decorators: [{
            type: Component,
            args: [{ selector: 'p-autoComplete', template: `
        <span #container [ngClass]="{'p-autocomplete p-component':true,'p-autocomplete-dd':dropdown,'p-autocomplete-multiple':multiple}" [ngStyle]="style" [class]="styleClass">
            <input *ngIf="!multiple" #in [attr.type]="type" [attr.id]="inputId" [ngStyle]="inputStyle" [class]="inputStyleClass" [autocomplete]="autocomplete" [attr.required]="required" [attr.name]="name"
            class="p-autocomplete-input p-inputtext p-component" [ngClass]="{'p-autocomplete-dd-input':dropdown,'p-disabled': disabled}" [value]="inputFieldValue" aria-autocomplete="list" role="searchbox"
            (click)="onInputClick($event)" (input)="onInput($event)" (keydown)="onKeydown($event)" (keyup)="onKeyup($event)" [attr.autofocus]="autofocus" (focus)="onInputFocus($event)" (blur)="onInputBlur($event)" (change)="onInputChange($event)" (paste)="onInputPaste($event)"
            [attr.placeholder]="placeholder" [attr.size]="size" [attr.maxlength]="maxlength" [attr.tabindex]="tabindex" [readonly]="readonly" [disabled]="disabled" [attr.aria-label]="ariaLabel" [attr.aria-labelledby]="ariaLabelledBy" [attr.aria-required]="required"
            ><ul *ngIf="multiple" #multiContainer class="p-autocomplete-multiple-container p-component p-inputtext" [ngClass]="{'p-disabled':disabled,'p-focus':focus}" (click)="multiIn.focus()">
                <li #token *ngFor="let val of value" class="p-autocomplete-token">
                    <ng-container *ngTemplateOutlet="selectedItemTemplate; context: {$implicit: val}"></ng-container>
                    <span *ngIf="!selectedItemTemplate" class="p-autocomplete-token-label">{{resolveFieldData(val)}}</span>
                    <span  class="p-autocomplete-token-icon pi pi-times-circle" (click)="removeItem(token)" *ngIf="!disabled && !readonly"></span>
                </li>
                <li class="p-autocomplete-input-token">
                    <input #multiIn [attr.type]="type" [attr.id]="inputId" [disabled]="disabled" [attr.placeholder]="(value&&value.length ? null : placeholder)" [attr.tabindex]="tabindex" [attr.maxlength]="maxlength" (input)="onInput($event)"  (click)="onInputClick($event)"
                            (keydown)="onKeydown($event)" [readonly]="readonly" (keyup)="onKeyup($event)" [attr.autofocus]="autofocus" (focus)="onInputFocus($event)" (blur)="onInputBlur($event)" (change)="onInputChange($event)" (paste)="onInputPaste($event)" [autocomplete]="autocomplete"
                            [ngStyle]="inputStyle" [class]="inputStyleClass" [attr.aria-label]="ariaLabel" [attr.aria-labelledby]="ariaLabelledBy" [attr.aria-required]="required"
                            aria-autocomplete="list" [attr.aria-controls]="listId" role="searchbox" [attr.aria-expanded]="overlayVisible" aria-haspopup="true" [attr.aria-activedescendant]="'p-highlighted-option'">
                </li>
            </ul>
            <i *ngIf="loading" class="p-autocomplete-loader pi pi-spinner pi-spin"></i><button #ddBtn type="button" pButton [icon]="dropdownIcon" [attr.aria-label]="dropdownAriaLabel" class="p-autocomplete-dropdown" [disabled]="disabled" pRipple
                (click)="handleDropdownClick($event)" *ngIf="dropdown" [attr.tabindex]="tabindex"></button>
            <div #panel *ngIf="overlayVisible" (click)="onOverlayClick($event)" [ngClass]="['p-autocomplete-panel p-component']" [style.max-height]="virtualScroll ? 'auto' : scrollHeight" [ngStyle]="panelStyle" [class]="panelStyleClass"
                [@overlayAnimation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}" (@overlayAnimation.start)="onOverlayAnimationStart($event)" (@overlayAnimation.done)="onOverlayAnimationEnd($event)">
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                <ul role="listbox" [attr.id]="listId" class="p-autocomplete-items" [ngClass]="{'p-autocomplete-virtualscroll': virtualScroll}">
                    <ng-container *ngIf="group">
                        <ng-template ngFor let-optgroup [ngForOf]="suggestions">
                            <li class="p-autocomplete-item-group">
                                <span *ngIf="!groupTemplate">{{getOptionGroupLabel(optgroup)||'empty'}}</span>
                                <ng-container *ngTemplateOutlet="groupTemplate; context: {$implicit: optgroup}"></ng-container>
                            </li>
                            <ng-container *ngTemplateOutlet="itemslist; context: {$implicit: getOptionGroupChildren(optgroup)}"></ng-container>
                        </ng-template>
                    </ng-container>
                    <ng-container *ngIf="!group">
                            <ng-container *ngTemplateOutlet="itemslist; context: {$implicit: suggestions}"></ng-container>
                    </ng-container>
                    <ng-template #itemslist let-suggestionsToDisplay>
                        <ng-container *ngIf="!virtualScroll; else virtualScrollList">
                            <li role="option" *ngFor="let option of suggestionsToDisplay; let idx = index" class="p-autocomplete-item" pRipple [ngClass]="{'p-highlight': (option === highlightOption)}" [id]="highlightOption == option ? 'p-highlighted-option':''" (click)="selectItem(option)">
                                <span *ngIf="!itemTemplate">{{resolveFieldData(option)}}</span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: option, index: idx}"></ng-container>
                            </li>
                        </ng-container>
                        <ng-template #virtualScrollList>
                            <cdk-virtual-scroll-viewport [ngStyle]="{'height': scrollHeight}" [itemSize]="itemSize" *ngIf="virtualScroll && !noResults">
                                <ng-container *cdkVirtualFor="let option of suggestionsToDisplay; let i = index; let c = count; let f = first; let l = last; let e = even; let o = odd">
                                    <li role="option" class="p-autocomplete-item" pRipple [ngClass]="{'p-highlight': (option === highlightOption)}" [ngStyle]="{'height': itemSize + 'px'}" [id]="highlightOption == option ? 'p-highlighted-option':''" (click)="selectItem(option)">
                                        <span *ngIf="!itemTemplate">{{resolveFieldData(option)}}</span>
                                        <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: option, index: i}"></ng-container>
                                    </li>
                                </ng-container>
                            </cdk-virtual-scroll-viewport>
                        </ng-template>
                        <li *ngIf="noResults && showEmptyMessage" class="p-autocomplete-empty-message">
                            <ng-container *ngIf="!emptyTemplate; else empty">
                                {{emptyMessageLabel}}
                            </ng-container>
                            <ng-container #empty *ngTemplateOutlet="emptyTemplate"></ng-container>
                        </li>
                    </ng-template>
                </ul>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </span>
    `, animations: [
                        trigger('overlayAnimation', [
                            transition(':enter', [
                                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                                animate('{{showTransitionParams}}')
                            ]),
                            transition(':leave', [
                                animate('{{hideTransitionParams}}', style({ opacity: 0 }))
                            ])
                        ])
                    ], host: {
                        'class': 'p-element p-inputwrapper',
                        '[class.p-inputwrapper-filled]': 'filled',
                        '[class.p-inputwrapper-focus]': '(focus && !disabled) || overlayVisible'
                    }, providers: [AUTOCOMPLETE_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, styles: [".p-autocomplete{display:inline-flex;position:relative}.p-autocomplete-loader{position:absolute;top:50%;margin-top:-.5rem}.p-autocomplete-dd .p-autocomplete-input{flex:1 1 auto;width:1%}.p-autocomplete-dd .p-autocomplete-input,.p-autocomplete-dd .p-autocomplete-multiple-container{border-top-right-radius:0;border-bottom-right-radius:0}.p-autocomplete-dd .p-autocomplete-dropdown{border-top-left-radius:0;border-bottom-left-radius:0}.p-autocomplete .p-autocomplete-panel{min-width:100%;top:0;left:0}.p-autocomplete-panel{position:absolute;overflow:auto}.p-autocomplete-items{margin:0;padding:0;list-style-type:none}.p-autocomplete-item{cursor:pointer;white-space:nowrap;position:relative;overflow:hidden}.p-autocomplete-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:flex;align-items:center;flex-wrap:wrap}.p-autocomplete-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-autocomplete-token-icon{cursor:pointer}.p-autocomplete-input-token{flex:1 1 auto;display:inline-flex}.p-autocomplete-input-token input{border:0 none;outline:0 none;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-autocomplete{display:flex}.p-fluid .p-autocomplete-dd .p-autocomplete-input{width:1%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.IterableDiffers }, { type: i1.PrimeNGConfig }, { type: i1.OverlayService }]; }, propDecorators: { minLength: [{
                type: Input
            }], delay: [{
                type: Input
            }], style: [{
                type: Input
            }], panelStyle: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], panelStyleClass: [{
                type: Input
            }], inputStyle: [{
                type: Input
            }], inputId: [{
                type: Input
            }], inputStyleClass: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], readonly: [{
                type: Input
            }], disabled: [{
                type: Input
            }], virtualScroll: [{
                type: Input
            }], itemSize: [{
                type: Input
            }], maxlength: [{
                type: Input
            }], name: [{
                type: Input
            }], required: [{
                type: Input
            }], size: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoHighlight: [{
                type: Input
            }], forceSelection: [{
                type: Input
            }], type: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], dropdownAriaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], dropdownIcon: [{
                type: Input
            }], unique: [{
                type: Input
            }], group: [{
                type: Input
            }], completeOnFocus: [{
                type: Input
            }], completeMethod: [{
                type: Output
            }], onSelect: [{
                type: Output
            }], onUnselect: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], onDropdownClick: [{
                type: Output
            }], onClear: [{
                type: Output
            }], onKeyUp: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], field: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], dropdown: [{
                type: Input
            }], showEmptyMessage: [{
                type: Input
            }], dropdownMode: [{
                type: Input
            }], multiple: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], dataKey: [{
                type: Input
            }], emptyMessage: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], autofocus: [{
                type: Input
            }], autocomplete: [{
                type: Input
            }], optionGroupChildren: [{
                type: Input
            }], optionGroupLabel: [{
                type: Input
            }], containerEL: [{
                type: ViewChild,
                args: ['container']
            }], inputEL: [{
                type: ViewChild,
                args: ['in']
            }], multiInputEL: [{
                type: ViewChild,
                args: ['multiIn']
            }], multiContainerEL: [{
                type: ViewChild,
                args: ['multiContainer']
            }], dropdownButton: [{
                type: ViewChild,
                args: ['ddBtn']
            }], viewPort: [{
                type: ViewChild,
                args: [CdkVirtualScrollViewport]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], suggestions: [{
                type: Input
            }] } });
export class AutoCompleteModule {
}
AutoCompleteModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: AutoCompleteModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AutoCompleteModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: AutoCompleteModule, declarations: [AutoComplete], imports: [CommonModule, InputTextModule, ButtonModule, SharedModule, RippleModule, ScrollingModule], exports: [AutoComplete, SharedModule, ScrollingModule] });
AutoCompleteModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: AutoCompleteModule, imports: [[CommonModule, InputTextModule, ButtonModule, SharedModule, RippleModule, ScrollingModule], SharedModule, ScrollingModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: AutoCompleteModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, InputTextModule, ButtonModule, SharedModule, RippleModule, ScrollingModule],
                    exports: [AutoComplete, SharedModule, ScrollingModule],
                    declarations: [AutoComplete]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUF3RCxLQUFLLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxlQUFlLEVBQWlDLFVBQVUsRUFBbUMsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcFIsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQWdCLE1BQU0scUJBQXFCLENBQUM7QUFDcEYsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLFlBQVksRUFBQyxhQUFhLEVBQUUsZUFBZSxFQUFnQyxNQUFNLGFBQWEsQ0FBQztBQUN2RyxPQUFPLEVBQUMsVUFBVSxFQUFFLDZCQUE2QixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3RFLE9BQU8sRUFBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFFLE9BQU8sRUFBQyxpQkFBaUIsRUFBdUIsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBQUMsd0JBQXdCLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7Ozs7Ozs7QUFFakYsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQVE7SUFDOUMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdB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WSxFQUFDLFlBQVksRUFBQyxlQUFlLENBQUM7b0JBQ3BELFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxWaWV3Q2hpbGQsRWxlbWVudFJlZixBZnRlclZpZXdDaGVja2VkLEFmdGVyQ29udGVudEluaXQsT25EZXN0cm95LElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXIsQ29udGVudENoaWxkcmVuLFF1ZXJ5TGlzdCxUZW1wbGF0ZVJlZixSZW5kZXJlcjIsZm9yd2FyZFJlZixDaGFuZ2VEZXRlY3RvclJlZixJdGVyYWJsZURpZmZlcnMsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHt0cmlnZ2VyLHN0eWxlLHRyYW5zaXRpb24sYW5pbWF0ZSxBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0lucHV0VGV4dE1vZHVsZX0gZnJvbSAncHJpbWVuZy9pbnB1dHRleHQnO1xuaW1wb3J0IHtCdXR0b25Nb2R1bGV9IGZyb20gJ3ByaW1lbmcvYnV0dG9uJztcbmltcG9ydCB7UmlwcGxlTW9kdWxlfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQge1NoYXJlZE1vZHVsZSxQcmltZVRlbXBsYXRlLCBUcmFuc2xhdGlvbktleXMsIFByaW1lTkdDb25maWcsIE92ZXJsYXlTZXJ2aWNlfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge0RvbUhhbmRsZXIsIENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQge09iamVjdFV0aWxzLCBVbmlxdWVDb21wb25lbnRJZCwgWkluZGV4VXRpbHN9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7Q2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LCBTY3JvbGxpbmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuXG5leHBvcnQgY29uc3QgQVVUT0NPTVBMRVRFX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBdXRvQ29tcGxldGUpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWF1dG9Db21wbGV0ZScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHNwYW4gI2NvbnRhaW5lciBbbmdDbGFzc109XCJ7J3AtYXV0b2NvbXBsZXRlIHAtY29tcG9uZW50Jzp0cnVlLCdwLWF1dG9jb21wbGV0ZS1kZCc6ZHJvcGRvd24sJ3AtYXV0b2NvbXBsZXRlLW11bHRpcGxlJzptdWx0aXBsZX1cIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICA8aW5wdXQgKm5nSWY9XCIhbXVsdGlwbGVcIiAjaW4gW2F0dHIudHlwZV09XCJ0eXBlXCIgW2F0dHIuaWRdPVwiaW5wdXRJZFwiIFtuZ1N0eWxlXT1cImlucHV0U3R5bGVcIiBbY2xhc3NdPVwiaW5wdXRTdHlsZUNsYXNzXCIgW2F1dG9jb21wbGV0ZV09XCJhdXRvY29tcGxldGVcIiBbYXR0ci5yZXF1aXJlZF09XCJyZXF1aXJlZFwiIFthdHRyLm5hbWVdPVwibmFtZVwiXG4gICAgICAgICAgICBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLWlucHV0IHAtaW5wdXR0ZXh0IHAtY29tcG9uZW50XCIgW25nQ2xhc3NdPVwieydwLWF1dG9jb21wbGV0ZS1kZC1pbnB1dCc6ZHJvcGRvd24sJ3AtZGlzYWJsZWQnOiBkaXNhYmxlZH1cIiBbdmFsdWVdPVwiaW5wdXRGaWVsZFZhbHVlXCIgYXJpYS1hdXRvY29tcGxldGU9XCJsaXN0XCIgcm9sZT1cInNlYXJjaGJveFwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25JbnB1dENsaWNrKCRldmVudClcIiAoaW5wdXQpPVwib25JbnB1dCgkZXZlbnQpXCIgKGtleWRvd24pPVwib25LZXlkb3duKCRldmVudClcIiAoa2V5dXApPVwib25LZXl1cCgkZXZlbnQpXCIgW2F0dHIuYXV0b2ZvY3VzXT1cImF1dG9mb2N1c1wiIChmb2N1cyk9XCJvbklucHV0Rm9jdXMoJGV2ZW50KVwiIChibHVyKT1cIm9uSW5wdXRCbHVyKCRldmVudClcIiAoY2hhbmdlKT1cIm9uSW5wdXRDaGFuZ2UoJGV2ZW50KVwiIChwYXN0ZSk9XCJvbklucHV0UGFzdGUoJGV2ZW50KVwiXG4gICAgICAgICAgICBbYXR0ci5wbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclwiIFthdHRyLnNpemVdPVwic2l6ZVwiIFthdHRyLm1heGxlbmd0aF09XCJtYXhsZW5ndGhcIiBbYXR0ci50YWJpbmRleF09XCJ0YWJpbmRleFwiIFtyZWFkb25seV09XCJyZWFkb25seVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCIgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCIgW2F0dHIuYXJpYS1yZXF1aXJlZF09XCJyZXF1aXJlZFwiXG4gICAgICAgICAgICA+PHVsICpuZ0lmPVwibXVsdGlwbGVcIiAjbXVsdGlDb250YWluZXIgY2xhc3M9XCJwLWF1dG9jb21wbGV0ZS1tdWx0aXBsZS1jb250YWluZXIgcC1jb21wb25lbnQgcC1pbnB1dHRleHRcIiBbbmdDbGFzc109XCJ7J3AtZGlzYWJsZWQnOmRpc2FibGVkLCdwLWZvY3VzJzpmb2N1c31cIiAoY2xpY2spPVwibXVsdGlJbi5mb2N1cygpXCI+XG4gICAgICAgICAgICAgICAgPGxpICN0b2tlbiAqbmdGb3I9XCJsZXQgdmFsIG9mIHZhbHVlXCIgY2xhc3M9XCJwLWF1dG9jb21wbGV0ZS10b2tlblwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic2VsZWN0ZWRJdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHZhbH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCIhc2VsZWN0ZWRJdGVtVGVtcGxhdGVcIiBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLXRva2VuLWxhYmVsXCI+e3tyZXNvbHZlRmllbGREYXRhKHZhbCl9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gIGNsYXNzPVwicC1hdXRvY29tcGxldGUtdG9rZW4taWNvbiBwaSBwaS10aW1lcy1jaXJjbGVcIiAoY2xpY2spPVwicmVtb3ZlSXRlbSh0b2tlbilcIiAqbmdJZj1cIiFkaXNhYmxlZCAmJiAhcmVhZG9ubHlcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJwLWF1dG9jb21wbGV0ZS1pbnB1dC10b2tlblwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgI211bHRpSW4gW2F0dHIudHlwZV09XCJ0eXBlXCIgW2F0dHIuaWRdPVwiaW5wdXRJZFwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFthdHRyLnBsYWNlaG9sZGVyXT1cIih2YWx1ZSYmdmFsdWUubGVuZ3RoID8gbnVsbCA6IHBsYWNlaG9sZGVyKVwiIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCIgW2F0dHIubWF4bGVuZ3RoXT1cIm1heGxlbmd0aFwiIChpbnB1dCk9XCJvbklucHV0KCRldmVudClcIiAgKGNsaWNrKT1cIm9uSW5wdXRDbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvbktleWRvd24oJGV2ZW50KVwiIFtyZWFkb25seV09XCJyZWFkb25seVwiIChrZXl1cCk9XCJvbktleXVwKCRldmVudClcIiBbYXR0ci5hdXRvZm9jdXNdPVwiYXV0b2ZvY3VzXCIgKGZvY3VzKT1cIm9uSW5wdXRGb2N1cygkZXZlbnQpXCIgKGJsdXIpPVwib25JbnB1dEJsdXIoJGV2ZW50KVwiIChjaGFuZ2UpPVwib25JbnB1dENoYW5nZSgkZXZlbnQpXCIgKHBhc3RlKT1cIm9uSW5wdXRQYXN0ZSgkZXZlbnQpXCIgW2F1dG9jb21wbGV0ZV09XCJhdXRvY29tcGxldGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cImlucHV0U3R5bGVcIiBbY2xhc3NdPVwiaW5wdXRTdHlsZUNsYXNzXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIiBbYXR0ci5hcmlhLXJlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWF1dG9jb21wbGV0ZT1cImxpc3RcIiBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImxpc3RJZFwiIHJvbGU9XCJzZWFyY2hib3hcIiBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cIm92ZXJsYXlWaXNpYmxlXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdPVwiJ3AtaGlnaGxpZ2h0ZWQtb3B0aW9uJ1wiPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPGkgKm5nSWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJwLWF1dG9jb21wbGV0ZS1sb2FkZXIgcGkgcGktc3Bpbm5lciBwaS1zcGluXCI+PC9pPjxidXR0b24gI2RkQnRuIHR5cGU9XCJidXR0b25cIiBwQnV0dG9uIFtpY29uXT1cImRyb3Bkb3duSWNvblwiIFthdHRyLmFyaWEtbGFiZWxdPVwiZHJvcGRvd25BcmlhTGFiZWxcIiBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLWRyb3Bkb3duXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgcFJpcHBsZVxuICAgICAgICAgICAgICAgIChjbGljayk9XCJoYW5kbGVEcm9wZG93bkNsaWNrKCRldmVudClcIiAqbmdJZj1cImRyb3Bkb3duXCIgW2F0dHIudGFiaW5kZXhdPVwidGFiaW5kZXhcIj48L2J1dHRvbj5cbiAgICAgICAgICAgIDxkaXYgI3BhbmVsICpuZ0lmPVwib3ZlcmxheVZpc2libGVcIiAoY2xpY2spPVwib25PdmVybGF5Q2xpY2soJGV2ZW50KVwiIFtuZ0NsYXNzXT1cIlsncC1hdXRvY29tcGxldGUtcGFuZWwgcC1jb21wb25lbnQnXVwiIFtzdHlsZS5tYXgtaGVpZ2h0XT1cInZpcnR1YWxTY3JvbGwgPyAnYXV0bycgOiBzY3JvbGxIZWlnaHRcIiBbbmdTdHlsZV09XCJwYW5lbFN0eWxlXCIgW2NsYXNzXT1cInBhbmVsU3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgW0BvdmVybGF5QW5pbWF0aW9uXT1cInt2YWx1ZTogJ3Zpc2libGUnLCBwYXJhbXM6IHtzaG93VHJhbnNpdGlvblBhcmFtczogc2hvd1RyYW5zaXRpb25PcHRpb25zLCBoaWRlVHJhbnNpdGlvblBhcmFtczogaGlkZVRyYW5zaXRpb25PcHRpb25zfX1cIiAoQG92ZXJsYXlBbmltYXRpb24uc3RhcnQpPVwib25PdmVybGF5QW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiIChAb3ZlcmxheUFuaW1hdGlvbi5kb25lKT1cIm9uT3ZlcmxheUFuaW1hdGlvbkVuZCgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImhlYWRlclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPHVsIHJvbGU9XCJsaXN0Ym94XCIgW2F0dHIuaWRdPVwibGlzdElkXCIgY2xhc3M9XCJwLWF1dG9jb21wbGV0ZS1pdGVtc1wiIFtuZ0NsYXNzXT1cInsncC1hdXRvY29tcGxldGUtdmlydHVhbHNjcm9sbCc6IHZpcnR1YWxTY3JvbGx9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1vcHRncm91cCBbbmdGb3JPZl09XCJzdWdnZXN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLWl0ZW0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCIhZ3JvdXBUZW1wbGF0ZVwiPnt7Z2V0T3B0aW9uR3JvdXBMYWJlbChvcHRncm91cCl8fCdlbXB0eSd9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImdyb3VwVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IG9wdGdyb3VwfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1zbGlzdDsgY29udGV4dDogeyRpbXBsaWNpdDogZ2V0T3B0aW9uR3JvdXBDaGlsZHJlbihvcHRncm91cCl9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtc2xpc3Q7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHN1Z2dlc3Rpb25zfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNpdGVtc2xpc3QgbGV0LXN1Z2dlc3Rpb25zVG9EaXNwbGF5PlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiF2aXJ0dWFsU2Nyb2xsOyBlbHNlIHZpcnR1YWxTY3JvbGxMaXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIHJvbGU9XCJvcHRpb25cIiAqbmdGb3I9XCJsZXQgb3B0aW9uIG9mIHN1Z2dlc3Rpb25zVG9EaXNwbGF5OyBsZXQgaWR4ID0gaW5kZXhcIiBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLWl0ZW1cIiBwUmlwcGxlIFtuZ0NsYXNzXT1cInsncC1oaWdobGlnaHQnOiAob3B0aW9uID09PSBoaWdobGlnaHRPcHRpb24pfVwiIFtpZF09XCJoaWdobGlnaHRPcHRpb24gPT0gb3B0aW9uID8gJ3AtaGlnaGxpZ2h0ZWQtb3B0aW9uJzonJ1wiIChjbGljayk9XCJzZWxlY3RJdGVtKG9wdGlvbilcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCIhaXRlbVRlbXBsYXRlXCI+e3tyZXNvbHZlRmllbGREYXRhKG9wdGlvbil9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogb3B0aW9uLCBpbmRleDogaWR4fVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjdmlydHVhbFNjcm9sbExpc3Q+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNkay12aXJ0dWFsLXNjcm9sbC12aWV3cG9ydCBbbmdTdHlsZV09XCJ7J2hlaWdodCc6IHNjcm9sbEhlaWdodH1cIiBbaXRlbVNpemVdPVwiaXRlbVNpemVcIiAqbmdJZj1cInZpcnR1YWxTY3JvbGwgJiYgIW5vUmVzdWx0c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpjZGtWaXJ0dWFsRm9yPVwibGV0IG9wdGlvbiBvZiBzdWdnZXN0aW9uc1RvRGlzcGxheTsgbGV0IGkgPSBpbmRleDsgbGV0IGMgPSBjb3VudDsgbGV0IGYgPSBmaXJzdDsgbGV0IGwgPSBsYXN0OyBsZXQgZSA9IGV2ZW47IGxldCBvID0gb2RkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgcm9sZT1cIm9wdGlvblwiIGNsYXNzPVwicC1hdXRvY29tcGxldGUtaXRlbVwiIHBSaXBwbGUgW25nQ2xhc3NdPVwieydwLWhpZ2hsaWdodCc6IChvcHRpb24gPT09IGhpZ2hsaWdodE9wdGlvbil9XCIgW25nU3R5bGVdPVwieydoZWlnaHQnOiBpdGVtU2l6ZSArICdweCd9XCIgW2lkXT1cImhpZ2hsaWdodE9wdGlvbiA9PSBvcHRpb24gPyAncC1oaWdobGlnaHRlZC1vcHRpb24nOicnXCIgKGNsaWNrKT1cInNlbGVjdEl0ZW0ob3B0aW9uKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiIWl0ZW1UZW1wbGF0ZVwiPnt7cmVzb2x2ZUZpZWxkRGF0YShvcHRpb24pfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogb3B0aW9uLCBpbmRleDogaX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvY2RrLXZpcnR1YWwtc2Nyb2xsLXZpZXdwb3J0PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSAqbmdJZj1cIm5vUmVzdWx0cyAmJiBzaG93RW1wdHlNZXNzYWdlXCIgY2xhc3M9XCJwLWF1dG9jb21wbGV0ZS1lbXB0eS1tZXNzYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFlbXB0eVRlbXBsYXRlOyBlbHNlIGVtcHR5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7ZW1wdHlNZXNzYWdlTGFiZWx9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgI2VtcHR5ICpuZ1RlbXBsYXRlT3V0bGV0PVwiZW1wdHlUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJmb290ZXJUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc3Bhbj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignb3ZlcmxheUFuaW1hdGlvbicsIFtcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJzplbnRlcicsIFtcbiAgICAgICAgICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAnc2NhbGVZKDAuOCknfSksXG4gICAgICAgICAgICAgICAgYW5pbWF0ZSgne3tzaG93VHJhbnNpdGlvblBhcmFtc319JylcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIHRyYW5zaXRpb24oJzpsZWF2ZScsIFtcbiAgICAgICAgICAgICAgICBhbmltYXRlKCd7e2hpZGVUcmFuc2l0aW9uUGFyYW1zfX0nLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgIF0pXG4gICAgXSxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWVsZW1lbnQgcC1pbnB1dHdyYXBwZXInLFxuICAgICAgICAnW2NsYXNzLnAtaW5wdXR3cmFwcGVyLWZpbGxlZF0nOiAnZmlsbGVkJyxcbiAgICAgICAgJ1tjbGFzcy5wLWlucHV0d3JhcHBlci1mb2N1c10nOiAnKGZvY3VzICYmICFkaXNhYmxlZCkgfHzCoG92ZXJsYXlWaXNpYmxlJ1xuICAgIH0sXG4gICAgcHJvdmlkZXJzOiBbQVVUT0NPTVBMRVRFX1ZBTFVFX0FDQ0VTU09SXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL2F1dG9jb21wbGV0ZS5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBBdXRvQ29tcGxldGUgaW1wbGVtZW50cyBBZnRlclZpZXdDaGVja2VkLEFmdGVyQ29udGVudEluaXQsT25EZXN0cm95LENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcblxuICAgIEBJbnB1dCgpIG1pbkxlbmd0aDogbnVtYmVyID0gMTtcblxuICAgIEBJbnB1dCgpIGRlbGF5OiBudW1iZXIgPSAzMDA7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgcGFuZWxTdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcGFuZWxTdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBpbnB1dFN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBpbnB1dElkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBpbnB1dFN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSByZWFkb25seTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgdmlydHVhbFNjcm9sbDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGl0ZW1TaXplOiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBtYXhsZW5ndGg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHJlcXVpcmVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc2l6ZTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgYXBwZW5kVG86IGFueTtcblxuICAgIEBJbnB1dCgpIGF1dG9IaWdobGlnaHQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBmb3JjZVNlbGVjdGlvbjogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuICAgIEBJbnB1dCgpIGF1dG9aSW5kZXg6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgYmFzZVpJbmRleDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZHJvcGRvd25BcmlhTGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkcm9wZG93bkljb246IHN0cmluZyA9IFwicGkgcGktY2hldnJvbi1kb3duXCI7XG5cbiAgICBASW5wdXQoKSB1bmlxdWU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgZ3JvdXA6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBjb21wbGV0ZU9uRm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBPdXRwdXQoKSBjb21wbGV0ZU1ldGhvZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uVW5zZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uRm9jdXM6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQmx1cjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Ecm9wZG93bkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAT3V0cHV0KCkgb25DbGVhcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25LZXlVcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TaG93OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkhpZGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQElucHV0KCkgZmllbGQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNjcm9sbEhlaWdodDogc3RyaW5nID0gJzIwMHB4JztcblxuICAgIEBJbnB1dCgpIGRyb3Bkb3duOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc2hvd0VtcHR5TWVzc2FnZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGRyb3Bkb3duTW9kZTogc3RyaW5nID0gJ2JsYW5rJztcblxuICAgIEBJbnB1dCgpIG11bHRpcGxlOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgdGFiaW5kZXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGRhdGFLZXk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGVtcHR5TWVzc2FnZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc2hvd1RyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnLjEycyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKSc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcuMXMgbGluZWFyJztcblxuICAgIEBJbnB1dCgpIGF1dG9mb2N1czogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGF1dG9jb21wbGV0ZTogc3RyaW5nID0gJ29mZic7XG5cbiAgICBASW5wdXQoKSBvcHRpb25Hcm91cENoaWxkcmVuOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBvcHRpb25Hcm91cExhYmVsOiBzdHJpbmc7XG5cbiAgICBAVmlld0NoaWxkKCdjb250YWluZXInKSBjb250YWluZXJFTDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ2luJykgaW5wdXRFTDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ211bHRpSW4nKSBtdWx0aUlucHV0RUw6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdtdWx0aUNvbnRhaW5lcicpIG11bHRpQ29udGFpbmVyRUw6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdkZEJ0bicpIGRyb3Bkb3duQnV0dG9uOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZChDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQpIHZpZXdQb3J0OiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQ7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBvdmVybGF5OiBIVE1MRGl2RWxlbWVudDtcblxuICAgIGl0ZW1zV3JhcHBlcjogSFRNTERpdkVsZW1lbnQ7XG5cbiAgICBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBlbXB0eVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHNlbGVjdGVkSXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZ3JvdXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHZhbHVlOiBhbnk7XG5cbiAgICBfc3VnZ2VzdGlvbnM6IGFueVtdO1xuXG4gICAgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgdGltZW91dDogYW55O1xuXG4gICAgb3ZlcmxheVZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGRvY3VtZW50Q2xpY2tMaXN0ZW5lcjogYW55O1xuXG4gICAgc3VnZ2VzdGlvbnNVcGRhdGVkOiBib29sZWFuO1xuXG4gICAgaGlnaGxpZ2h0T3B0aW9uOiBhbnk7XG5cbiAgICBoaWdobGlnaHRPcHRpb25DaGFuZ2VkOiBib29sZWFuO1xuXG4gICAgZm9jdXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGZpbGxlZDogYm9vbGVhbjtcblxuICAgIGlucHV0Q2xpY2s6IGJvb2xlYW47XG5cbiAgICBpbnB1dEtleURvd246IGJvb2xlYW47XG5cbiAgICBub1Jlc3VsdHM6IGJvb2xlYW47XG5cbiAgICBkaWZmZXI6IGFueTtcblxuICAgIGlucHV0RmllbGRWYWx1ZTogc3RyaW5nID0gbnVsbDtcblxuICAgIGxvYWRpbmc6IGJvb2xlYW47XG5cbiAgICBzY3JvbGxIYW5kbGVyOiBhbnk7XG5cbiAgICBkb2N1bWVudFJlc2l6ZUxpc3RlbmVyOiBhbnk7XG5cbiAgICBmb3JjZVNlbGVjdGlvblVwZGF0ZU1vZGVsVGltZW91dDogYW55O1xuXG4gICAgbGlzdElkOiBzdHJpbmc7XG5cbiAgICBpdGVtQ2xpY2tlZDogYm9vbGVhbjtcblxuICAgIHZpcnR1YWxTY3JvbGxTZWxlY3RlZEluZGV4OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwdWJsaWMgZGlmZmVyczogSXRlcmFibGVEaWZmZXJzLCBwdWJsaWMgY29uZmlnOiBQcmltZU5HQ29uZmlnLCBwdWJsaWMgb3ZlcmxheVNlcnZpY2U6IE92ZXJsYXlTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuZGlmZmVyID0gZGlmZmVycy5maW5kKFtdKS5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMubGlzdElkID0gVW5pcXVlQ29tcG9uZW50SWQoKSArICdfbGlzdCc7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHN1Z2dlc3Rpb25zKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1Z2dlc3Rpb25zO1xuICAgIH1cblxuICAgIHNldCBzdWdnZXN0aW9ucyh2YWw6YW55W10pIHtcbiAgICAgICAgdGhpcy5fc3VnZ2VzdGlvbnMgPSB2YWw7XG4gICAgICAgIHRoaXMuaGFuZGxlU3VnZ2VzdGlvbnNDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgICAgIC8vVXNlIHRpbWVvdXRzIGFzIHNpbmNlIEFuZ3VsYXIgNC4yLCBBZnRlclZpZXdDaGVja2VkIGlzIGJyb2tlbiBhbmQgbm90IGNhbGxlZCBhZnRlciBwYW5lbCBpcyB1cGRhdGVkXG4gICAgICAgIGlmICh0aGlzLnN1Z2dlc3Rpb25zVXBkYXRlZCAmJiB0aGlzLm92ZXJsYXkgJiYgdGhpcy5vdmVybGF5Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3ZlcmxheSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduT3ZlcmxheSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc1VwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodE9wdGlvbkNoYW5nZWQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJsYXkgJiYgdGhpcy5pdGVtc1dyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpc3RJdGVtID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMub3ZlcmxheSwgJ2xpLnAtaGlnaGxpZ2h0Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnNjcm9sbEluVmlldyh0aGlzLml0ZW1zV3JhcHBlciwgbGlzdEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbCAmJiB0aGlzLnZpZXdQb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmFuZ2UgPSB0aGlzLnZpZXdQb3J0LmdldFJlbmRlcmVkUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmlydHVhbFNjcm9sbFNlbGVjdGVkSW5kZXgoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJhbmdlLnN0YXJ0ID4gdGhpcy52aXJ0dWFsU2Nyb2xsU2VsZWN0ZWRJbmRleCB8fCByYW5nZS5lbmQgPCB0aGlzLnZpcnR1YWxTY3JvbGxTZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3UG9ydC5zY3JvbGxUb0luZGV4KHRoaXMudmlydHVhbFNjcm9sbFNlbGVjdGVkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbkNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVN1Z2dlc3Rpb25zQ2hhbmdlKCkge1xuICAgICAgICBpZiAodGhpcy5fc3VnZ2VzdGlvbnMgIT0gbnVsbCAmJiB0aGlzLmxvYWRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdWdnZXN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vUmVzdWx0cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNVcGRhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF1dG9IaWdobGlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb24gPSB0aGlzLl9zdWdnZXN0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vUmVzdWx0cyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zaG93RW1wdHlNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2goaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdpdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZ3JvdXAnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc2VsZWN0ZWRJdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2VtcHR5JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zvb3Rlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9vdGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1cGRhdGVWaXJ0dWFsU2Nyb2xsU2VsZWN0ZWRJbmRleCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0T3B0aW9uICYmIHRoaXMuc3VnZ2VzdGlvbnMgJiYgdGhpcy5zdWdnZXN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMudmlydHVhbFNjcm9sbFNlbGVjdGVkSW5kZXggPSB0aGlzLmZpbmRPcHRpb25JbmRleCh0aGlzLmhpZ2hsaWdodE9wdGlvbiwgdGhpcy5zdWdnZXN0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5maWxsZWQgPSB0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUgIT0gJyc7XG4gICAgICAgIHRoaXMudXBkYXRlSW5wdXRGaWVsZCgpO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGdldE9wdGlvbkdyb3VwQ2hpbGRyZW4ob3B0aW9uR3JvdXA6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25Hcm91cENoaWxkcmVuID8gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShvcHRpb25Hcm91cCwgdGhpcy5vcHRpb25Hcm91cENoaWxkcmVuKSA6IG9wdGlvbkdyb3VwLml0ZW1zO1xuICAgIH1cblxuICAgIGdldE9wdGlvbkdyb3VwTGFiZWwob3B0aW9uR3JvdXA6IGFueSkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25Hcm91cExhYmVsID8gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShvcHRpb25Hcm91cCwgdGhpcy5vcHRpb25Hcm91cExhYmVsKSA6IChvcHRpb25Hcm91cC5sYWJlbCAhPSB1bmRlZmluZWQgPyBvcHRpb25Hcm91cC5sYWJlbCA6IG9wdGlvbkdyb3VwKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICAgIH1cblxuICAgIHNldERpc2FibGVkU3RhdGUodmFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB2YWw7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgb25JbnB1dChldmVudDogRXZlbnQpIHtcbiAgICAgICAgLy8gV2hlbiBhbiBpbnB1dCBlbGVtZW50IHdpdGggYSBwbGFjZWhvbGRlciBpcyBjbGlja2VkLCB0aGUgb25JbnB1dCBldmVudCBpcyBpbnZva2VkIGluIElFLlxuICAgICAgICBpZiAoIXRoaXMuaW5wdXRLZXlEb3duICYmIERvbUhhbmRsZXIuaXNJRSgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWx1ZSA9ICg8SFRNTElucHV0RWxlbWVudD4gZXZlbnQudGFyZ2V0KS52YWx1ZTtcbiAgICAgICAgaWYgKCF0aGlzLm11bHRpcGxlICYmICF0aGlzLmZvcmNlU2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCAmJiAhdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICB0aGlzLm9uQ2xlYXIuZW1pdChldmVudCk7XG5cdCAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPj0gdGhpcy5taW5MZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoKGV2ZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICB9LCB0aGlzLmRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5pbnB1dEtleURvd24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvbklucHV0Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Q2xpY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VhcmNoKGV2ZW50OiBhbnksIHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICAgICAgLy9hbGxvdyBlbXB0eSBzdHJpbmcgYnV0IG5vdCB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgIGlmIChxdWVyeSA9PT0gdW5kZWZpbmVkIHx8IHF1ZXJ5ID09PSBudWxsKSB7XG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICB9XG5cbiAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgdGhpcy5jb21wbGV0ZU1ldGhvZC5lbWl0KHtcbiAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgIHF1ZXJ5OiBxdWVyeVxuICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNlbGVjdEl0ZW0ob3B0aW9uOiBhbnksIGZvY3VzOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBpZiAodGhpcy5mb3JjZVNlbGVjdGlvblVwZGF0ZU1vZGVsVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZm9yY2VTZWxlY3Rpb25VcGRhdGVNb2RlbFRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5mb3JjZVNlbGVjdGlvblVwZGF0ZU1vZGVsVGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgICAgdGhpcy5tdWx0aUlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWV8fFtdO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWQob3B0aW9uKSB8fCAhdGhpcy51bmlxdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gWy4uLnRoaXMudmFsdWUsb3B0aW9uXTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSA9ICB0aGlzLnJlc29sdmVGaWVsZERhdGEob3B0aW9uKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBvcHRpb247XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uU2VsZWN0LmVtaXQob3B0aW9uKTtcbiAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuXG4gICAgICAgIGlmIChmb2N1cykge1xuICAgICAgICAgICAgdGhpcy5pdGVtQ2xpY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpSW5wdXRFTCB8fCB0aGlzLmlucHV0RUwpIHtcbiAgICAgICAgICAgIGxldCBoYXNGb2N1cyA9IHRoaXMubXVsdGlwbGUgP1xuICAgICAgICAgICAgICAgIHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudC5hY3RpdmVFbGVtZW50ID09IHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQgOlxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLm92ZXJsYXlWaXNpYmxlICYmIGhhc0ZvY3VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdmVybGF5VmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk92ZXJsYXlBbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXkgPSBldmVudC5lbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNXcmFwcGVyID0gdGhpcy52aXJ0dWFsU2Nyb2xsID8gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMub3ZlcmxheSwgJy5jZGstdmlydHVhbC1zY3JvbGwtdmlld3BvcnQnKSA6IHRoaXMub3ZlcmxheTtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZE92ZXJsYXkoKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgWkluZGV4VXRpbHMuc2V0KCdvdmVybGF5JywgdGhpcy5vdmVybGF5LCB0aGlzLmJhc2VaSW5kZXggKyB0aGlzLmNvbmZpZy56SW5kZXgub3ZlcmxheSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5hbGlnbk92ZXJsYXkoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2hvdy5lbWl0KGV2ZW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uT3ZlcmxheUhpZGUoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PdmVybGF5QW5pbWF0aW9uRW5kKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBzd2l0Y2goZXZlbnQudG9TdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAndm9pZCc6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcihldmVudC5lbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3ZlcmxheUNsaWNrKGV2ZW50KSB7XG4gICAgICAgIHRoaXMub3ZlcmxheVNlcnZpY2UuYWRkKHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXBwZW5kT3ZlcmxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcGVuZFRvID09PSAnYm9keScpXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm92ZXJsYXkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kQ2hpbGQodGhpcy5vdmVybGF5LCB0aGlzLmFwcGVuZFRvKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLm92ZXJsYXkuc3R5bGUubWluV2lkdGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXkuc3R5bGUubWluV2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSkgKyAncHgnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzb2x2ZUZpZWxkRGF0YSh2YWx1ZSkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZmllbGQgPyBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHZhbHVlLCB0aGlzLmZpZWxkKSA6IHZhbHVlO1xuICAgICAgICByZXR1cm4gZGF0YSAhPT0gKG51bGwgfHwgdW5kZWZpbmVkKSA/IGRhdGEgOiAnJztcbiAgICB9XG5cbiAgICByZXN0b3JlT3ZlcmxheUFwcGVuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheSAmJiB0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5vdmVybGF5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFsaWduT3ZlcmxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8pXG4gICAgICAgICAgICBEb21IYW5kbGVyLmFic29sdXRlUG9zaXRpb24odGhpcy5vdmVybGF5LCAodGhpcy5tdWx0aXBsZSA/IHRoaXMubXVsdGlDb250YWluZXJFTC5uYXRpdmVFbGVtZW50IDogdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgRG9tSGFuZGxlci5yZWxhdGl2ZVBvc2l0aW9uKHRoaXMub3ZlcmxheSwgKHRoaXMubXVsdGlwbGUgPyB0aGlzLm11bHRpQ29udGFpbmVyRUwubmF0aXZlRWxlbWVudCA6IHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50KSk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5VmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGhhbmRsZURyb3Bkb3duQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLm92ZXJsYXlWaXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICAgICAgICAgIGxldCBxdWVyeVZhbHVlID0gdGhpcy5tdWx0aXBsZSA/IHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgOiB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZHJvcGRvd25Nb2RlID09PSAnYmxhbmsnKVxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoKGV2ZW50LCAnJyk7XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyb3Bkb3duTW9kZSA9PT0gJ2N1cnJlbnQnKVxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoKGV2ZW50LCBxdWVyeVZhbHVlKTtcblxuICAgICAgICAgICAgdGhpcy5vbkRyb3Bkb3duQ2xpY2suZW1pdCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5VmFsdWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb2N1c0lucHV0KCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSlcbiAgICAgICAgICAgIHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICBnZXQgZW1wdHlNZXNzYWdlTGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1wdHlNZXNzYWdlIHx8IHRoaXMuY29uZmlnLmdldFRyYW5zbGF0aW9uKFRyYW5zbGF0aW9uS2V5cy5FTVBUWV9NRVNTQUdFKTtcbiAgICB9XG5cbiAgICByZW1vdmVJdGVtKGl0ZW06IGFueSkge1xuICAgICAgICBsZXQgaXRlbUluZGV4ID0gRG9tSGFuZGxlci5pbmRleChpdGVtKTtcbiAgICAgICAgbGV0IHJlbW92ZWRWYWx1ZSA9IHRoaXMudmFsdWVbaXRlbUluZGV4XTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuZmlsdGVyKCh2YWwsIGkpID0+IGkhPWl0ZW1JbmRleCk7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICB0aGlzLm9uVW5zZWxlY3QuZW1pdChyZW1vdmVkVmFsdWUpO1xuICAgIH1cblxuICAgIG9uS2V5ZG93bihldmVudCkge1xuICAgICAgICBpZiAodGhpcy5vdmVybGF5VmlzaWJsZSkge1xuICAgICAgICAgICAgc3dpdGNoKGV2ZW50LndoaWNoKSB7XG4gICAgICAgICAgICAgICAgLy9kb3duXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoaWdobGlnaHRJdGVtSW5kZXggPSB0aGlzLmZpbmRPcHRpb25Hcm91cEluZGV4KHRoaXMuaGlnaGxpZ2h0T3B0aW9uLCB0aGlzLnN1Z2dlc3Rpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodEl0ZW1JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dEl0ZW1JbmRleCA9IGhpZ2hsaWdodEl0ZW1JbmRleC5pdGVtSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0SXRlbUluZGV4IDwgKHRoaXMuZ2V0T3B0aW9uR3JvdXBDaGlsZHJlbih0aGlzLnN1Z2dlc3Rpb25zW2hpZ2hsaWdodEl0ZW1JbmRleC5ncm91cEluZGV4XSkubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbiA9IHRoaXMuZ2V0T3B0aW9uR3JvdXBDaGlsZHJlbih0aGlzLnN1Z2dlc3Rpb25zW2hpZ2hsaWdodEl0ZW1JbmRleC5ncm91cEluZGV4XSlbbmV4dEl0ZW1JbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuc3VnZ2VzdGlvbnNbaGlnaGxpZ2h0SXRlbUluZGV4Lmdyb3VwSW5kZXggKyAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbiA9IHRoaXMuZ2V0T3B0aW9uR3JvdXBDaGlsZHJlbih0aGlzLnN1Z2dlc3Rpb25zW2hpZ2hsaWdodEl0ZW1JbmRleC5ncm91cEluZGV4ICsgMV0pWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbkNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uID0gdGhpcy5nZXRPcHRpb25Hcm91cENoaWxkcmVuKHRoaXMuc3VnZ2VzdGlvbnNbMF0pWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhpZ2hsaWdodEl0ZW1JbmRleCA9IHRoaXMuZmluZE9wdGlvbkluZGV4KHRoaXMuaGlnaGxpZ2h0T3B0aW9uLCB0aGlzLnN1Z2dlc3Rpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodEl0ZW1JbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0SXRlbUluZGV4ID0gaGlnaGxpZ2h0SXRlbUluZGV4ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEl0ZW1JbmRleCAhPSAodGhpcy5zdWdnZXN0aW9ucy5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uID0gdGhpcy5zdWdnZXN0aW9uc1tuZXh0SXRlbUluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb25DaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbiA9IHRoaXMuc3VnZ2VzdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy91cFxuICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaGlnaGxpZ2h0SXRlbUluZGV4ID0gdGhpcy5maW5kT3B0aW9uR3JvdXBJbmRleCh0aGlzLmhpZ2hsaWdodE9wdGlvbiwgdGhpcy5zdWdnZXN0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGlnaGxpZ2h0SXRlbUluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmV2SXRlbUluZGV4ID0gaGlnaGxpZ2h0SXRlbUluZGV4Lml0ZW1JbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZJdGVtSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbiA9IHRoaXMuZ2V0T3B0aW9uR3JvdXBDaGlsZHJlbih0aGlzLnN1Z2dlc3Rpb25zW2hpZ2hsaWdodEl0ZW1JbmRleC5ncm91cEluZGV4XSlbcHJldkl0ZW1JbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByZXZJdGVtSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmV2R3JvdXAgPSB0aGlzLnN1Z2dlc3Rpb25zW2hpZ2hsaWdodEl0ZW1JbmRleC5ncm91cEluZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2R3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uID0gdGhpcy5nZXRPcHRpb25Hcm91cENoaWxkcmVuKHByZXZHcm91cClbdGhpcy5nZXRPcHRpb25Hcm91cENoaWxkcmVuKHByZXZHcm91cCkubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbkNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhpZ2hsaWdodEl0ZW1JbmRleCA9IHRoaXMuZmluZE9wdGlvbkluZGV4KHRoaXMuaGlnaGxpZ2h0T3B0aW9uLCB0aGlzLnN1Z2dlc3Rpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodEl0ZW1JbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJldkl0ZW1JbmRleCA9IGhpZ2hsaWdodEl0ZW1JbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb24gPSB0aGlzLnN1Z2dlc3Rpb25zW3ByZXZJdGVtSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy9lbnRlclxuICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodE9wdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RJdGVtKHRoaXMuaGlnaGxpZ2h0T3B0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAvL2VzY2FwZVxuICAgICAgICAgICAgICAgIGNhc2UgMjc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG5cbiAgICAgICAgICAgICAgICAvL3RhYlxuICAgICAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0T3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0odGhpcy5oaWdobGlnaHRPcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSA0MCAmJiB0aGlzLnN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2goZXZlbnQsZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICBzd2l0Y2goZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgICAgICAvL2JhY2tzcGFjZVxuICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGggJiYgIXRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBbLi4udGhpcy52YWx1ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1vdmVkVmFsdWUgPSB0aGlzLnZhbHVlLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblVuc2VsZWN0LmVtaXQocmVtb3ZlZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbnB1dEtleURvd24gPSB0cnVlO1xuICAgIH1cblxuICAgIG9uS2V5dXAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5vbktleVVwLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uSW5wdXRGb2N1cyhldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuaXRlbUNsaWNrZWQgJiYgdGhpcy5jb21wbGV0ZU9uRm9jdXMgKSB7XG4gICAgICAgICAgICBsZXQgcXVlcnlWYWx1ZSA9IHRoaXMubXVsdGlwbGUgPyB0aGlzLm11bHRpSW5wdXRFTC5uYXRpdmVFbGVtZW50LnZhbHVlIDogdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaChldmVudCwgcXVlcnlWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvY3VzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkZvY3VzLmVtaXQoZXZlbnQpO1xuICAgICAgICB0aGlzLml0ZW1DbGlja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb25JbnB1dEJsdXIoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5mb2N1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uSW5wdXRDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9yY2VTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWUudHJpbSgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zdWdnZXN0aW9ucykgIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBzdWdnZXN0aW9uIG9mIHRoaXMuc3VnZ2VzdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1WYWx1ZSA9IHRoaXMuZmllbGQgPyBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHN1Z2dlc3Rpb24sIHRoaXMuZmllbGQpIDogc3VnZ2VzdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1WYWx1ZSAmJiBpbnB1dFZhbHVlID09PSBpdGVtVmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcmNlU2VsZWN0aW9uVXBkYXRlTW9kZWxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RJdGVtKHN1Z2dlc3Rpb24sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMub25DbGVhci5lbWl0KGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25JbnB1dFBhc3RlKGV2ZW50OiBDbGlwYm9hcmRFdmVudCkge1xuICAgICAgICB0aGlzLm9uS2V5ZG93bihldmVudCk7XG4gICAgfVxuXG4gICAgaXNTZWxlY3RlZCh2YWw6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5lcXVhbHModGhpcy52YWx1ZVtpXSwgdmFsLCB0aGlzLmRhdGFLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxlY3RlZDtcbiAgICB9XG5cbiAgICBmaW5kT3B0aW9uSW5kZXgob3B0aW9uLCBzdWdnZXN0aW9ucyk6IG51bWJlciB7XG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gLTE7XG4gICAgICAgIGlmIChzdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWdnZXN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5lcXVhbHMob3B0aW9uLCBzdWdnZXN0aW9uc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuXG4gICAgZmluZE9wdGlvbkdyb3VwSW5kZXgodmFsOiBhbnksIG9wdHM6IGFueVtdKTogYW55IHtcbiAgICAgICAgbGV0IGdyb3VwSW5kZXgsIGl0ZW1JbmRleDtcblxuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaXRlbUluZGV4ID0gdGhpcy5maW5kT3B0aW9uSW5kZXgodmFsLCB0aGlzLmdldE9wdGlvbkdyb3VwQ2hpbGRyZW4ob3B0c1tpXSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW1JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB7Z3JvdXBJbmRleDogZ3JvdXBJbmRleCwgaXRlbUluZGV4OiBpdGVtSW5kZXh9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlRmlsbGVkU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKVxuICAgICAgICAgICAgdGhpcy5maWxsZWQgPSAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCkgfHzCoCh0aGlzLm11bHRpSW5wdXRFTCAmJiB0aGlzLm11bHRpSW5wdXRFTC5uYXRpdmVFbGVtZW50ICYmIHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgIT0gJycpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmZpbGxlZCA9ICh0aGlzLmlucHV0RmllbGRWYWx1ZSAmJiB0aGlzLmlucHV0RmllbGRWYWx1ZSAhPSAnJykgfHzCoCh0aGlzLmlucHV0RUwgJiYgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQgJiYgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgIT0gJycpOztcbiAgICB9XG5cbiAgICB1cGRhdGVJbnB1dEZpZWxkKCkge1xuICAgICAgICBsZXQgZm9ybWF0dGVkVmFsdWUgPSB0aGlzLnJlc29sdmVGaWVsZERhdGEodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMuaW5wdXRGaWVsZFZhbHVlID0gZm9ybWF0dGVkVmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5wdXRFTCAmJiB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBmb3JtYXR0ZWRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICBjb25zdCBkb2N1bWVudFRhcmdldDogYW55ID0gdGhpcy5lbCA/IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50IDogJ2RvY3VtZW50JztcblxuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaW5wdXRDbGljayAmJiAhdGhpcy5pc0Ryb3Bkb3duQ2xpY2soZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRDbGljayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRHJvcGRvd25DbGljayhldmVudCkge1xuICAgICAgICBpZiAodGhpcy5kcm9wZG93bikge1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIHJldHVybiAodGFyZ2V0ID09PSB0aGlzLmRyb3Bkb3duQnV0dG9uLm5hdGl2ZUVsZW1lbnQgfHwgdGFyZ2V0LnBhcmVudE5vZGUgPT09IHRoaXMuZHJvcGRvd25CdXR0b24ubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIgPSB0aGlzLm9uV2luZG93UmVzaXplLmJpbmQodGhpcyk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uV2luZG93UmVzaXplKCkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG5cbiAgICBiaW5kU2Nyb2xsTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBuZXcgQ29ubmVjdGVkT3ZlcmxheVNjcm9sbEhhbmRsZXIodGhpcy5jb250YWluZXJFTC5uYXRpdmVFbGVtZW50LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3ZlcmxheVZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgdW5iaW5kU2Nyb2xsTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci51bmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PdmVybGF5SGlkZSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5vdmVybGF5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5vbkhpZGUuZW1pdCgpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5mb3JjZVNlbGVjdGlvblVwZGF0ZU1vZGVsVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZm9yY2VTZWxlY3Rpb25VcGRhdGVNb2RlbFRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5mb3JjZVNlbGVjdGlvblVwZGF0ZU1vZGVsVGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm92ZXJsYXkpIHtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLmNsZWFyKHRoaXMub3ZlcmxheSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc3RvcmVPdmVybGF5QXBwZW5kKCk7XG4gICAgICAgIHRoaXMub25PdmVybGF5SGlkZSgpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLElucHV0VGV4dE1vZHVsZSxCdXR0b25Nb2R1bGUsU2hhcmVkTW9kdWxlLFJpcHBsZU1vZHVsZSxTY3JvbGxpbmdNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtBdXRvQ29tcGxldGUsU2hhcmVkTW9kdWxlLFNjcm9sbGluZ01vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbQXV0b0NvbXBsZXRlXVxufSlcbmV4cG9ydCBjbGFzcyBBdXRvQ29tcGxldGVNb2R1bGUgeyB9XG4iXX0=
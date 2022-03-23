import { NgModule, Component, Input, Output, EventEmitter, ViewChild, Inject, forwardRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { DomHandler, ConnectedOverlayScrollHandler } from 'primeng/dom';
import { ZIndexUtils } from 'primeng/utils';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/api";
import * as i5 from "primeng/tooltip";
export class MenuItemContent {
    constructor(menu) {
        this.menu = menu;
    }
    onItemKeyDown(event) {
        let listItem = event.currentTarget.parentElement;
        switch (event.code) {
            case 'ArrowDown':
                var nextItem = this.findNextItem(listItem);
                if (nextItem) {
                    nextItem.children[0].focus();
                }
                event.preventDefault();
                break;
            case 'ArrowUp':
                var prevItem = this.findPrevItem(listItem);
                if (prevItem) {
                    prevItem.children[0].focus();
                }
                event.preventDefault();
                break;
            case 'Space':
            case 'Enter':
                if (listItem && !DomHandler.hasClass(listItem, 'p-disabled')) {
                    listItem.children[0].click();
                }
                event.preventDefault();
                break;
            default:
                break;
        }
    }
    findNextItem(item) {
        let nextItem = item.nextElementSibling;
        if (nextItem)
            return DomHandler.hasClass(nextItem, 'p-disabled') || !DomHandler.hasClass(nextItem, 'p-menuitem') ? this.findNextItem(nextItem) : nextItem;
        else
            return null;
    }
    findPrevItem(item) {
        let prevItem = item.previousElementSibling;
        if (prevItem)
            return DomHandler.hasClass(prevItem, 'p-disabled') || !DomHandler.hasClass(prevItem, 'p-menuitem') ? this.findPrevItem(prevItem) : prevItem;
        else
            return null;
    }
}
MenuItemContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MenuItemContent, deps: [{ token: forwardRef(() => Menu) }], target: i0.ɵɵFactoryTarget.Component });
MenuItemContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.6", type: MenuItemContent, selector: "[pMenuItemContent]", inputs: { item: ["pMenuItemContent", "item"] }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <a *ngIf="!item.routerLink"  (keydown)="onItemKeyDown($event)" [attr.href]="item.url||null" class="p-menuitem-link" [attr.tabindex]="item.disabled ? null : '0'" [attr.data-automationid]="item.automationId" [target]="item.target" [attr.title]="item.title" [attr.id]="item.id"
            [ngClass]="{'p-disabled':item.disabled}" (click)="menu.itemClick($event, item)" role="menuitem" [target]="item.target">
            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{item.label}}</span>
            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
        </a>
        <a *ngIf="item.routerLink" (keydown)="onItemKeyDown($event)" [routerLink]="item.routerLink" [attr.data-automationid]="item.automationId" [queryParams]="item.queryParams" [routerLinkActive]="'p-menuitem-link-active'"
            [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" class="p-menuitem-link" [target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled ? null : '0'"
            [attr.title]="item.title" [ngClass]="{'p-disabled':item.disabled}" (click)="menu.itemClick($event, item)" role="menuitem" pRipple
            [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state">
            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{item.label}}</span>
            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
        </a>
    `, isInline: true, directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i2.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "relativeTo", "routerLink"] }, { type: i3.Ripple, selector: "[pRipple]" }, { type: i2.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MenuItemContent, decorators: [{
            type: Component,
            args: [{
                    selector: '[pMenuItemContent]',
                    template: `
        <a *ngIf="!item.routerLink"  (keydown)="onItemKeyDown($event)" [attr.href]="item.url||null" class="p-menuitem-link" [attr.tabindex]="item.disabled ? null : '0'" [attr.data-automationid]="item.automationId" [target]="item.target" [attr.title]="item.title" [attr.id]="item.id"
            [ngClass]="{'p-disabled':item.disabled}" (click)="menu.itemClick($event, item)" role="menuitem" [target]="item.target">
            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{item.label}}</span>
            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
        </a>
        <a *ngIf="item.routerLink" (keydown)="onItemKeyDown($event)" [routerLink]="item.routerLink" [attr.data-automationid]="item.automationId" [queryParams]="item.queryParams" [routerLinkActive]="'p-menuitem-link-active'"
            [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" class="p-menuitem-link" [target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled ? null : '0'"
            [attr.title]="item.title" [ngClass]="{'p-disabled':item.disabled}" (click)="menu.itemClick($event, item)" role="menuitem" pRipple
            [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state">
            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{item.label}}</span>
            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
        </a>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        'class': 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => Menu)]
                }] }]; }, propDecorators: { item: [{
                type: Input,
                args: ["pMenuItemContent"]
            }] } });
export class Menu {
    constructor(el, renderer, cd, config, overlayService) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.config = config;
        this.overlayService = overlayService;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
    }
    toggle(event) {
        if (this.visible)
            this.hide();
        else
            this.show(event);
        this.preventDocumentDefault = true;
    }
    show(event) {
        this.target = event.currentTarget;
        this.relativeAlign = event.relativeAlign;
        this.visible = true;
        this.preventDocumentDefault = true;
        this.cd.markForCheck();
    }
    onOverlayAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                if (this.popup) {
                    this.container = event.element;
                    this.moveOnTop();
                    this.onShow.emit({});
                    this.appendOverlay();
                    this.alignOverlay();
                    this.bindDocumentClickListener();
                    this.bindDocumentResizeListener();
                    this.bindScrollListener();
                }
                break;
            case 'void':
                this.onOverlayHide();
                this.onHide.emit({});
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
    alignOverlay() {
        if (this.relativeAlign)
            DomHandler.relativePosition(this.container, this.target);
        else
            DomHandler.absolutePosition(this.container, this.target);
    }
    appendOverlay() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                DomHandler.appendChild(this.container, this.appendTo);
        }
    }
    restoreOverlayAppend() {
        if (this.container && this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    }
    moveOnTop() {
        if (this.autoZIndex) {
            ZIndexUtils.set('menu', this.container, this.baseZIndex + this.config.zIndex.menu);
        }
    }
    hide() {
        this.visible = false;
        this.relativeAlign = false;
        this.cd.markForCheck();
    }
    onWindowResize() {
        this.hide();
    }
    itemClick(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        if (this.popup) {
            this.hide();
        }
    }
    onOverlayClick(event) {
        if (this.popup) {
            this.overlayService.add({
                originalEvent: event,
                target: this.el.nativeElement
            });
        }
        this.preventDocumentDefault = true;
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentClickListener = this.renderer.listen(documentTarget, 'click', () => {
                if (!this.preventDocumentDefault) {
                    this.hide();
                }
                this.preventDocumentDefault = false;
            });
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
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.target, () => {
                if (this.visible) {
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
        this.preventDocumentDefault = false;
        if (!this.cd.destroyed) {
            this.target = null;
        }
    }
    ngOnDestroy() {
        if (this.popup) {
            if (this.scrollHandler) {
                this.scrollHandler.destroy();
                this.scrollHandler = null;
            }
            if (this.container && this.autoZIndex) {
                ZIndexUtils.clear(this.container);
            }
            this.restoreOverlayAppend();
            this.onOverlayHide();
        }
    }
    hasSubMenu() {
        if (this.model) {
            for (var item of this.model) {
                if (item.items) {
                    return true;
                }
            }
        }
        return false;
    }
}
Menu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: Menu, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i4.PrimeNGConfig }, { token: i4.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
Menu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.6", type: Menu, selector: "p-menu", inputs: { model: "model", popup: "popup", style: "style", styleClass: "styleClass", appendTo: "appendTo", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onShow: "onShow", onHide: "onHide" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="{'p-menu p-component': true, 'p-menu-overlay': popup}"
            [class]="styleClass" [ngStyle]="style" *ngIf="!popup || visible" (click)="onOverlayClick($event)"
            [@overlayAnimation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}" [@.disabled]="popup !== true" (@overlayAnimation.start)="onOverlayAnimationStart($event)" (@overlayAnimation.done)="onOverlayAnimationEnd($event)">
            <ul class="p-menu-list p-reset" role="menu">
                <ng-template ngFor let-submenu [ngForOf]="model" *ngIf="hasSubMenu()">
                    <li class="p-menu-separator" *ngIf="submenu.separator" [ngClass]="{'p-hidden': submenu.visible === false}" role="separator"></li>
                    <li class="p-submenu-header" [attr.data-automationid]="submenu.automationId" *ngIf="!submenu.separator" [ngClass]="{'p-hidden': submenu.visible === false}" pTooltip [tooltipOptions]="submenu.tooltipOptions" role="none">
                        <span *ngIf="submenu.escape !== false; else htmlSubmenuLabel">{{submenu.label}}</span>
                        <ng-template #htmlSubmenuLabel><span [innerHTML]="submenu.label"></span></ng-template>
                    </li>
                    <ng-template ngFor let-item [ngForOf]="submenu.items">
                        <li class="p-menu-separator" *ngIf="item.separator" [ngClass]="{'p-hidden': (item.visible === false || submenu.visible === false)}"  role="separator"></li>
                        <li class="p-menuitem" *ngIf="!item.separator" [pMenuItemContent]="item" [ngClass]="{'p-hidden': (item.visible === false || submenu.visible === false)}" [ngStyle]="item.style" [class]="item.styleClass" pTooltip [tooltipOptions]="item.tooltipOptions" role="none"></li>
                    </ng-template>
                </ng-template>
                <ng-template ngFor let-item [ngForOf]="model" *ngIf="!hasSubMenu()">
                    <li class="p-menu-separator" *ngIf="item.separator" [ngClass]="{'p-hidden': item.visible === false}" role="separator"></li>
                    <li class="p-menuitem" *ngIf="!item.separator" [pMenuItemContent]="item" [ngClass]="{'p-hidden': item.visible === false}" [ngStyle]="item.style" [class]="item.styleClass" pTooltip [tooltipOptions]="item.tooltipOptions" role="none"></li>
                </ng-template>
            </ul>
        </div>
    `, isInline: true, styles: [".p-menu-overlay{position:absolute;top:0;left:0}.p-menu ul{margin:0;padding:0;list-style:none}.p-menu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-menu .p-menuitem-text{line-height:1}\n"], components: [{ type: MenuItemContent, selector: "[pMenuItemContent]", inputs: ["pMenuItemContent"] }], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i5.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "pTooltip", "tooltipDisabled", "tooltipOptions"] }], animations: [
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: Menu, decorators: [{
            type: Component,
            args: [{ selector: 'p-menu', template: `
        <div #container [ngClass]="{'p-menu p-component': true, 'p-menu-overlay': popup}"
            [class]="styleClass" [ngStyle]="style" *ngIf="!popup || visible" (click)="onOverlayClick($event)"
            [@overlayAnimation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}" [@.disabled]="popup !== true" (@overlayAnimation.start)="onOverlayAnimationStart($event)" (@overlayAnimation.done)="onOverlayAnimationEnd($event)">
            <ul class="p-menu-list p-reset" role="menu">
                <ng-template ngFor let-submenu [ngForOf]="model" *ngIf="hasSubMenu()">
                    <li class="p-menu-separator" *ngIf="submenu.separator" [ngClass]="{'p-hidden': submenu.visible === false}" role="separator"></li>
                    <li class="p-submenu-header" [attr.data-automationid]="submenu.automationId" *ngIf="!submenu.separator" [ngClass]="{'p-hidden': submenu.visible === false}" pTooltip [tooltipOptions]="submenu.tooltipOptions" role="none">
                        <span *ngIf="submenu.escape !== false; else htmlSubmenuLabel">{{submenu.label}}</span>
                        <ng-template #htmlSubmenuLabel><span [innerHTML]="submenu.label"></span></ng-template>
                    </li>
                    <ng-template ngFor let-item [ngForOf]="submenu.items">
                        <li class="p-menu-separator" *ngIf="item.separator" [ngClass]="{'p-hidden': (item.visible === false || submenu.visible === false)}"  role="separator"></li>
                        <li class="p-menuitem" *ngIf="!item.separator" [pMenuItemContent]="item" [ngClass]="{'p-hidden': (item.visible === false || submenu.visible === false)}" [ngStyle]="item.style" [class]="item.styleClass" pTooltip [tooltipOptions]="item.tooltipOptions" role="none"></li>
                    </ng-template>
                </ng-template>
                <ng-template ngFor let-item [ngForOf]="model" *ngIf="!hasSubMenu()">
                    <li class="p-menu-separator" *ngIf="item.separator" [ngClass]="{'p-hidden': item.visible === false}" role="separator"></li>
                    <li class="p-menuitem" *ngIf="!item.separator" [pMenuItemContent]="item" [ngClass]="{'p-hidden': item.visible === false}" [ngStyle]="item.style" [class]="item.styleClass" pTooltip [tooltipOptions]="item.tooltipOptions" role="none"></li>
                </ng-template>
            </ul>
        </div>
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
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-menu-overlay{position:absolute;top:0;left:0}.p-menu ul{margin:0;padding:0;list-style:none}.p-menu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-menu .p-menuitem-text{line-height:1}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i4.PrimeNGConfig }, { type: i4.OverlayService }]; }, propDecorators: { model: [{
                type: Input
            }], popup: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }] } });
export class MenuModule {
}
MenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MenuModule, declarations: [Menu, MenuItemContent], imports: [CommonModule, RouterModule, RippleModule, TooltipModule], exports: [Menu, RouterModule, TooltipModule] });
MenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MenuModule, imports: [[CommonModule, RouterModule, RippleModule, TooltipModule], RouterModule, TooltipModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
                    exports: [Menu, RouterModule, TooltipModule],
                    declarations: [Menu, MenuItemContent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9tZW51L21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQXlCLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFhLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFxQix1QkFBdUIsRUFBRSxpQkFBaUIsRUFBVyxNQUFNLGVBQWUsQ0FBQztBQUMxTixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFrQixNQUFNLHFCQUFxQixDQUFDO0FBQzFGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLDZCQUE2QixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRXhFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7Ozs7QUF5QmhELE1BQU0sT0FBTyxlQUFlO0lBTXhCLFlBQTRDLElBQUk7UUFDNUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFZLENBQUM7SUFDN0IsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFLO1FBQ2YsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUM7UUFFakQsUUFBUSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2hCLEtBQUssV0FBVztnQkFDWixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLFFBQVEsRUFBRTtvQkFDVixRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNoQztnQkFFRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU07WUFFVixLQUFLLFNBQVM7Z0JBQ1YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxRQUFRLEVBQUU7b0JBQ1YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDaEM7Z0JBRUQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixNQUFNO1lBRVYsS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLE9BQU87Z0JBQ1IsSUFBSSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsRUFBRTtvQkFDMUQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDaEM7Z0JBRUQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixNQUFNO1lBRVY7Z0JBQ0ksTUFBTTtTQUNiO0lBQ0wsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFJO1FBQ2IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBRXZDLElBQUksUUFBUTtZQUNSLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDOztZQUU1SSxPQUFPLElBQUksQ0FBQztJQUNwQixDQUFDO0lBRUQsWUFBWSxDQUFDLElBQUk7UUFDYixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7UUFFM0MsSUFBSSxRQUFRO1lBQ1IsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7O1lBRTVJLE9BQU8sSUFBSSxDQUFDO0lBQ3BCLENBQUM7OzRHQTlEUSxlQUFlLGtCQU1KLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0dBTmpDLGVBQWUsaUpBckJkOzs7Ozs7Ozs7Ozs7Ozs7S0FlVDsyRkFNUSxlQUFlO2tCQXZCM0IsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7OztLQWVUO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLFdBQVc7cUJBQ3ZCO2lCQUNKOzswQkFPZ0IsTUFBTTsyQkFBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDOzRDQUpmLElBQUk7c0JBQTlCLEtBQUs7dUJBQUMsa0JBQWtCOztBQTBHN0IsTUFBTSxPQUFPLElBQUk7SUEwQ2IsWUFBbUIsRUFBYyxFQUFTLFFBQW1CLEVBQVUsRUFBcUIsRUFBUyxNQUFxQixFQUFTLGNBQThCO1FBQTlJLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQVMsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBOUJ4SixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTNCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFFdkIsMEJBQXFCLEdBQVcsaUNBQWlDLENBQUM7UUFFbEUsMEJBQXFCLEdBQVcsWUFBWSxDQUFDO1FBSTVDLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUvQyxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUFrQjRHLENBQUM7SUFFdEssTUFBTSxDQUFDLEtBQUs7UUFDUixJQUFJLElBQUksQ0FBQyxPQUFPO1lBQ1osSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztZQUVaLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFckIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQUs7UUFDTixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsdUJBQXVCLENBQUMsS0FBcUI7UUFDekMsUUFBUSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ25CLEtBQUssU0FBUztnQkFDVixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ1osSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO29CQUMvQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNyQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7b0JBQ2pDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO29CQUNsQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztpQkFDN0I7Z0JBQ0QsTUFBTTtZQUVWLEtBQUssTUFBTTtnQkFDUCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQixNQUFNO1NBQ2I7SUFDTCxDQUFDO0lBRUQscUJBQXFCLENBQUMsS0FBcUI7UUFDdkMsUUFBUSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ25CLEtBQUssTUFBTTtnQkFDUCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ2pCLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNwQztnQkFDRCxNQUFNO1NBQ2I7SUFDTCxDQUFDO0lBRUQsWUFBWTtRQUNSLElBQUksSUFBSSxDQUFDLGFBQWE7WUFDbEIsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztZQUV6RCxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssTUFBTTtnQkFDeEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztnQkFFMUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM3RDtJQUNMLENBQUM7SUFFRCxvQkFBb0I7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNyRDtJQUNMLENBQUM7SUFFRCxTQUFTO1FBQ0wsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0RjtJQUNMLENBQUM7SUFFRCxJQUFJO1FBQ0EsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsY0FBYztRQUNWLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQWlCLEVBQUUsSUFBYztRQUN2QyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQy9CLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUMxQjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1QsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLElBQUksRUFBRSxJQUFJO2FBQ2IsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDWixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFRCxjQUFjLENBQUMsS0FBSztRQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDWixJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztnQkFDcEIsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWE7YUFDaEMsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFBO0lBQ3RDLENBQUM7SUFFRCx5QkFBeUI7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM3QixNQUFNLGNBQWMsR0FBUSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUV2RixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQzVFLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDZjtnQkFFRCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRUQsMkJBQTJCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzVCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7U0FDckM7SUFDTCxDQUFDO0lBRUQsMEJBQTBCO1FBQ3RCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCw0QkFBNEI7UUFDeEIsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDN0IsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1NBQ3RDO0lBQ0wsQ0FBQztJQUVELGtCQUFrQjtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtnQkFDckUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNkLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDZjtZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVELG9CQUFvQjtRQUNoQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQzdDO0lBQ0wsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDO1FBRXBDLElBQUksQ0FBRSxJQUFJLENBQUMsRUFBYyxDQUFDLFNBQVMsRUFBRTtZQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUN0QjtJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1osSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUM3QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzthQUM3QjtZQUVELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNyQztZQUVELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN4QjtJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ04sSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1osS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ1osT0FBTyxJQUFJLENBQUM7aUJBQ2Y7YUFDSjtTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7aUdBM1BRLElBQUk7cUZBQUosSUFBSSx1ZkF6Q0g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FzQlQsMFRBekZRLGVBQWUsK3JCQTBGWjtRQUNSLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtZQUN4QixVQUFVLENBQUMsUUFBUSxFQUFFO2dCQUNqQixLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsQ0FBQztnQkFDL0MsT0FBTyxDQUFDLDBCQUEwQixDQUFDO2FBQ3RDLENBQUM7WUFDRixVQUFVLENBQUMsUUFBUSxFQUFFO2dCQUNqQixPQUFPLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDN0QsQ0FBQztTQUNMLENBQUM7S0FDTDsyRkFRUSxJQUFJO2tCQTNDaEIsU0FBUzsrQkFDSSxRQUFRLFlBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FzQlQsY0FDVzt3QkFDUixPQUFPLENBQUMsa0JBQWtCLEVBQUU7NEJBQ3hCLFVBQVUsQ0FBQyxRQUFRLEVBQUU7Z0NBQ2pCLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxDQUFDO2dDQUMvQyxPQUFPLENBQUMsMEJBQTBCLENBQUM7NkJBQ3RDLENBQUM7NEJBQ0YsVUFBVSxDQUFDLFFBQVEsRUFBRTtnQ0FDakIsT0FBTyxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzZCQUM3RCxDQUFDO3lCQUNMLENBQUM7cUJBQ0wsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksUUFFL0I7d0JBQ0YsT0FBTyxFQUFFLFdBQVc7cUJBQ3ZCO2tOQUlRLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcscUJBQXFCO3NCQUE3QixLQUFLO2dCQUVHLHFCQUFxQjtzQkFBN0IsS0FBSztnQkFFa0Isa0JBQWtCO3NCQUF6QyxTQUFTO3VCQUFDLFdBQVc7Z0JBRVosTUFBTTtzQkFBZixNQUFNO2dCQUVHLE1BQU07c0JBQWYsTUFBTTs7QUEyT1gsTUFBTSxPQUFPLFVBQVU7O3VHQUFWLFVBQVU7d0dBQVYsVUFBVSxpQkFuUVYsSUFBSSxFQTVHSixlQUFlLGFBMldkLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGFBQWEsYUEvUHhELElBQUksRUFnUUcsWUFBWSxFQUFFLGFBQWE7d0dBR2xDLFVBQVUsWUFKVixDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxFQUNsRCxZQUFZLEVBQUUsYUFBYTsyRkFHbEMsVUFBVTtrQkFMdEIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUM7b0JBQ2xFLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDO29CQUM1QyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDO2lCQUN4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uRGVzdHJveSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBSZW5kZXJlcjIsIFZpZXdDaGlsZCwgSW5qZWN0LCBmb3J3YXJkUmVmLCBDaGFuZ2VEZXRlY3RvclJlZiwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBWaWV3UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0cmlnZ2VyLCBzdHlsZSwgdHJhbnNpdGlvbiwgYW5pbWF0ZSwgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEb21IYW5kbGVyLCBDb25uZWN0ZWRPdmVybGF5U2Nyb2xsSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IE1lbnVJdGVtLCBPdmVybGF5U2VydmljZSwgUHJpbWVOR0NvbmZpZyB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IFpJbmRleFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgVG9vbHRpcE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvdG9vbHRpcCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnW3BNZW51SXRlbUNvbnRlbnRdJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8YSAqbmdJZj1cIiFpdGVtLnJvdXRlckxpbmtcIiAgKGtleWRvd24pPVwib25JdGVtS2V5RG93bigkZXZlbnQpXCIgW2F0dHIuaHJlZl09XCJpdGVtLnVybHx8bnVsbFwiIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCIgW2F0dHIudGFiaW5kZXhdPVwiaXRlbS5kaXNhYmxlZCA/IG51bGwgOiAnMCdcIiBbYXR0ci5kYXRhLWF1dG9tYXRpb25pZF09XCJpdGVtLmF1dG9tYXRpb25JZFwiIFt0YXJnZXRdPVwiaXRlbS50YXJnZXRcIiBbYXR0ci50aXRsZV09XCJpdGVtLnRpdGxlXCIgW2F0dHIuaWRdPVwiaXRlbS5pZFwiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7J3AtZGlzYWJsZWQnOml0ZW0uZGlzYWJsZWR9XCIgKGNsaWNrKT1cIm1lbnUuaXRlbUNsaWNrKCRldmVudCwgaXRlbSlcIiByb2xlPVwibWVudWl0ZW1cIiBbdGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiICpuZ0lmPVwiaXRlbS5pY29uXCIgW25nQ2xhc3NdPVwiaXRlbS5pY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiAqbmdJZj1cIml0ZW0uZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBodG1sTGFiZWxcIj57e2l0ZW0ubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjaHRtbExhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJpdGVtLmxhYmVsXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvYT5cbiAgICAgICAgPGEgKm5nSWY9XCJpdGVtLnJvdXRlckxpbmtcIiAoa2V5ZG93bik9XCJvbkl0ZW1LZXlEb3duKCRldmVudClcIiBbcm91dGVyTGlua109XCJpdGVtLnJvdXRlckxpbmtcIiBbYXR0ci5kYXRhLWF1dG9tYXRpb25pZF09XCJpdGVtLmF1dG9tYXRpb25JZFwiIFtxdWVyeVBhcmFtc109XCJpdGVtLnF1ZXJ5UGFyYW1zXCIgW3JvdXRlckxpbmtBY3RpdmVdPVwiJ3AtbWVudWl0ZW0tbGluay1hY3RpdmUnXCJcbiAgICAgICAgICAgIFtyb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc109XCJpdGVtLnJvdXRlckxpbmtBY3RpdmVPcHRpb25zfHx7ZXhhY3Q6ZmFsc2V9XCIgY2xhc3M9XCJwLW1lbnVpdGVtLWxpbmtcIiBbdGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCIgW2F0dHIuaWRdPVwiaXRlbS5pZFwiIFthdHRyLnRhYmluZGV4XT1cIml0ZW0uZGlzYWJsZWQgPyBudWxsIDogJzAnXCJcbiAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cIml0ZW0udGl0bGVcIiBbbmdDbGFzc109XCJ7J3AtZGlzYWJsZWQnOml0ZW0uZGlzYWJsZWR9XCIgKGNsaWNrKT1cIm1lbnUuaXRlbUNsaWNrKCRldmVudCwgaXRlbSlcIiByb2xlPVwibWVudWl0ZW1cIiBwUmlwcGxlXG4gICAgICAgICAgICBbZnJhZ21lbnRdPVwiaXRlbS5mcmFnbWVudFwiIFtxdWVyeVBhcmFtc0hhbmRsaW5nXT1cIml0ZW0ucXVlcnlQYXJhbXNIYW5kbGluZ1wiIFtwcmVzZXJ2ZUZyYWdtZW50XT1cIml0ZW0ucHJlc2VydmVGcmFnbWVudFwiIFtza2lwTG9jYXRpb25DaGFuZ2VdPVwiaXRlbS5za2lwTG9jYXRpb25DaGFuZ2VcIiBbcmVwbGFjZVVybF09XCJpdGVtLnJlcGxhY2VVcmxcIiBbc3RhdGVdPVwiaXRlbS5zdGF0ZVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWljb25cIiAqbmdJZj1cIml0ZW0uaWNvblwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgKm5nSWY9XCJpdGVtLmVzY2FwZSAhPT0gZmFsc2U7IGVsc2UgaHRtbFJvdXRlTGFiZWxcIj57e2l0ZW0ubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjaHRtbFJvdXRlTGFiZWw+PHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiBbaW5uZXJIVE1MXT1cIml0ZW0ubGFiZWxcIj48L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9hPlxuICAgIGAsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBNZW51SXRlbUNvbnRlbnQge1xuXG4gICAgQElucHV0KFwicE1lbnVJdGVtQ29udGVudFwiKSBpdGVtOiBNZW51SXRlbTtcblxuICAgIG1lbnU6IE1lbnU7XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWVudSkpIG1lbnUpIHtcbiAgICAgICAgdGhpcy5tZW51ID0gbWVudSBhcyBNZW51O1xuICAgIH1cblxuICAgIG9uSXRlbUtleURvd24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGxpc3RJdGVtID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQuY29kZSkge1xuICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEl0ZW0gPSB0aGlzLmZpbmROZXh0SXRlbShsaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmNoaWxkcmVuWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgdmFyIHByZXZJdGVtID0gdGhpcy5maW5kUHJldkl0ZW0obGlzdEl0ZW0pO1xuICAgICAgICAgICAgICAgIGlmIChwcmV2SXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2SXRlbS5jaGlsZHJlblswXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICAgICAgICBpZiAobGlzdEl0ZW0gJiYgIURvbUhhbmRsZXIuaGFzQ2xhc3MobGlzdEl0ZW0sICdwLWRpc2FibGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdEl0ZW0uY2hpbGRyZW5bMF0uY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZE5leHRJdGVtKGl0ZW0pIHtcbiAgICAgICAgbGV0IG5leHRJdGVtID0gaXRlbS5uZXh0RWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKG5leHRJdGVtKVxuICAgICAgICAgICAgcmV0dXJuIERvbUhhbmRsZXIuaGFzQ2xhc3MobmV4dEl0ZW0sICdwLWRpc2FibGVkJykgfHwgIURvbUhhbmRsZXIuaGFzQ2xhc3MobmV4dEl0ZW0sICdwLW1lbnVpdGVtJykgPyB0aGlzLmZpbmROZXh0SXRlbShuZXh0SXRlbSkgOiBuZXh0SXRlbTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZmluZFByZXZJdGVtKGl0ZW0pIHtcbiAgICAgICAgbGV0IHByZXZJdGVtID0gaXRlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChwcmV2SXRlbSlcbiAgICAgICAgICAgIHJldHVybiBEb21IYW5kbGVyLmhhc0NsYXNzKHByZXZJdGVtLCAncC1kaXNhYmxlZCcpIHx8ICFEb21IYW5kbGVyLmhhc0NsYXNzKHByZXZJdGVtLCAncC1tZW51aXRlbScpID8gdGhpcy5maW5kUHJldkl0ZW0ocHJldkl0ZW0pIDogcHJldkl0ZW07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLW1lbnUnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgI2NvbnRhaW5lciBbbmdDbGFzc109XCJ7J3AtbWVudSBwLWNvbXBvbmVudCc6IHRydWUsICdwLW1lbnUtb3ZlcmxheSc6IHBvcHVwfVwiXG4gICAgICAgICAgICBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInN0eWxlXCIgKm5nSWY9XCIhcG9wdXAgfHwgdmlzaWJsZVwiIChjbGljayk9XCJvbk92ZXJsYXlDbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgIFtAb3ZlcmxheUFuaW1hdGlvbl09XCJ7dmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7c2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9uc319XCIgW0AuZGlzYWJsZWRdPVwicG9wdXAgIT09IHRydWVcIiAoQG92ZXJsYXlBbmltYXRpb24uc3RhcnQpPVwib25PdmVybGF5QW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiIChAb3ZlcmxheUFuaW1hdGlvbi5kb25lKT1cIm9uT3ZlcmxheUFuaW1hdGlvbkVuZCgkZXZlbnQpXCI+XG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJwLW1lbnUtbGlzdCBwLXJlc2V0XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LXN1Ym1lbnUgW25nRm9yT2ZdPVwibW9kZWxcIiAqbmdJZj1cImhhc1N1Yk1lbnUoKVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJwLW1lbnUtc2VwYXJhdG9yXCIgKm5nSWY9XCJzdWJtZW51LnNlcGFyYXRvclwiIFtuZ0NsYXNzXT1cInsncC1oaWRkZW4nOiBzdWJtZW51LnZpc2libGUgPT09IGZhbHNlfVwiIHJvbGU9XCJzZXBhcmF0b3JcIj48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJwLXN1Ym1lbnUtaGVhZGVyXCIgW2F0dHIuZGF0YS1hdXRvbWF0aW9uaWRdPVwic3VibWVudS5hdXRvbWF0aW9uSWRcIiAqbmdJZj1cIiFzdWJtZW51LnNlcGFyYXRvclwiIFtuZ0NsYXNzXT1cInsncC1oaWRkZW4nOiBzdWJtZW51LnZpc2libGUgPT09IGZhbHNlfVwiIHBUb29sdGlwIFt0b29sdGlwT3B0aW9uc109XCJzdWJtZW51LnRvb2x0aXBPcHRpb25zXCIgcm9sZT1cIm5vbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwic3VibWVudS5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxTdWJtZW51TGFiZWxcIj57e3N1Ym1lbnUubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjaHRtbFN1Ym1lbnVMYWJlbD48c3BhbiBbaW5uZXJIVE1MXT1cInN1Ym1lbnUubGFiZWxcIj48L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1pdGVtIFtuZ0Zvck9mXT1cInN1Ym1lbnUuaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cInAtbWVudS1zZXBhcmF0b3JcIiAqbmdJZj1cIml0ZW0uc2VwYXJhdG9yXCIgW25nQ2xhc3NdPVwieydwLWhpZGRlbic6IChpdGVtLnZpc2libGUgPT09IGZhbHNlIHx8wqBzdWJtZW51LnZpc2libGUgPT09IGZhbHNlKX1cIiAgcm9sZT1cInNlcGFyYXRvclwiPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJwLW1lbnVpdGVtXCIgKm5nSWY9XCIhaXRlbS5zZXBhcmF0b3JcIiBbcE1lbnVJdGVtQ29udGVudF09XCJpdGVtXCIgW25nQ2xhc3NdPVwieydwLWhpZGRlbic6IChpdGVtLnZpc2libGUgPT09IGZhbHNlIHx8IHN1Ym1lbnUudmlzaWJsZSA9PT0gZmFsc2UpfVwiIFtuZ1N0eWxlXT1cIml0ZW0uc3R5bGVcIiBbY2xhc3NdPVwiaXRlbS5zdHlsZUNsYXNzXCIgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cIml0ZW0udG9vbHRpcE9wdGlvbnNcIiByb2xlPVwibm9uZVwiPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LWl0ZW0gW25nRm9yT2ZdPVwibW9kZWxcIiAqbmdJZj1cIiFoYXNTdWJNZW51KClcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwicC1tZW51LXNlcGFyYXRvclwiICpuZ0lmPVwiaXRlbS5zZXBhcmF0b3JcIiBbbmdDbGFzc109XCJ7J3AtaGlkZGVuJzogaXRlbS52aXNpYmxlID09PSBmYWxzZX1cIiByb2xlPVwic2VwYXJhdG9yXCI+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwicC1tZW51aXRlbVwiICpuZ0lmPVwiIWl0ZW0uc2VwYXJhdG9yXCIgW3BNZW51SXRlbUNvbnRlbnRdPVwiaXRlbVwiIFtuZ0NsYXNzXT1cInsncC1oaWRkZW4nOiBpdGVtLnZpc2libGUgPT09IGZhbHNlfVwiIFtuZ1N0eWxlXT1cIml0ZW0uc3R5bGVcIiBbY2xhc3NdPVwiaXRlbS5zdHlsZUNsYXNzXCIgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cIml0ZW0udG9vbHRpcE9wdGlvbnNcIiByb2xlPVwibm9uZVwiPjwvbGk+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdvdmVybGF5QW5pbWF0aW9uJywgW1xuICAgICAgICAgICAgdHJhbnNpdGlvbignOmVudGVyJywgW1xuICAgICAgICAgICAgICAgIHN0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAnc2NhbGVZKDAuOCknIH0pLFxuICAgICAgICAgICAgICAgIGFuaW1hdGUoJ3t7c2hvd1RyYW5zaXRpb25QYXJhbXN9fScpXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJzpsZWF2ZScsIFtcbiAgICAgICAgICAgICAgICBhbmltYXRlKCd7e2hpZGVUcmFuc2l0aW9uUGFyYW1zfX0nLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpXG4gICAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgIF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9tZW51LmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgJ2NsYXNzJzogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIE1lbnUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuXG4gICAgQElucHV0KCkgbW9kZWw6IE1lbnVJdGVtW107XG5cbiAgICBASW5wdXQoKSBwb3B1cDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcHBlbmRUbzogYW55O1xuXG4gICAgQElucHV0KCkgYXV0b1pJbmRleDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBiYXNlWkluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KCkgc2hvd1RyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnLjEycyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKSc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcuMXMgbGluZWFyJztcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBPdXRwdXQoKSBvblNob3c6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uSGlkZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBjb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuXG4gICAgc2Nyb2xsSGFuZGxlcjogYW55O1xuXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBhbnk7XG5cbiAgICBkb2N1bWVudFJlc2l6ZUxpc3RlbmVyOiBhbnk7XG5cbiAgICBwcmV2ZW50RG9jdW1lbnREZWZhdWx0OiBib29sZWFuO1xuXG4gICAgdGFyZ2V0OiBhbnk7XG5cbiAgICB2aXNpYmxlOiBib29sZWFuO1xuXG4gICAgcmVsYXRpdmVBbGlnbjogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwdWJsaWMgY29uZmlnOiBQcmltZU5HQ29uZmlnLCBwdWJsaWMgb3ZlcmxheVNlcnZpY2U6IE92ZXJsYXlTZXJ2aWNlKSB7IH1cblxuICAgIHRvZ2dsZShldmVudCkge1xuICAgICAgICBpZiAodGhpcy52aXNpYmxlKVxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuc2hvdyhldmVudCk7XG5cbiAgICAgICAgdGhpcy5wcmV2ZW50RG9jdW1lbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzaG93KGV2ZW50KSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgdGhpcy5yZWxhdGl2ZUFsaWduID0gZXZlbnQucmVsYXRpdmVBbGlnbjtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wcmV2ZW50RG9jdW1lbnREZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlBbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3B1cCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGV2ZW50LmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZU9uVG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25TaG93LmVtaXQoe30pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZE92ZXJsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnbk92ZXJsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3ZvaWQnOlxuICAgICAgICAgICAgICAgIHRoaXMub25PdmVybGF5SGlkZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMub25IaWRlLmVtaXQoe30pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PdmVybGF5QW5pbWF0aW9uRW5kKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ZvaWQnOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIoZXZlbnQuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWxpZ25PdmVybGF5KCkge1xuICAgICAgICBpZiAodGhpcy5yZWxhdGl2ZUFsaWduKVxuICAgICAgICAgICAgRG9tSGFuZGxlci5yZWxhdGl2ZVBvc2l0aW9uKHRoaXMuY29udGFpbmVyLCB0aGlzLnRhcmdldCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYWJzb2x1dGVQb3NpdGlvbih0aGlzLmNvbnRhaW5lciwgdGhpcy50YXJnZXQpO1xuICAgIH1cblxuICAgIGFwcGVuZE92ZXJsYXkoKSB7XG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcHBlbmRUbyA9PT0gJ2JvZHknKVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIsIHRoaXMuYXBwZW5kVG8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdG9yZU92ZXJsYXlBcHBlbmQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciAmJiB0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZU9uVG9wKCkge1xuICAgICAgICBpZiAodGhpcy5hdXRvWkluZGV4KSB7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5zZXQoJ21lbnUnLCB0aGlzLmNvbnRhaW5lciwgdGhpcy5iYXNlWkluZGV4ICsgdGhpcy5jb25maWcuekluZGV4Lm1lbnUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVsYXRpdmVBbGlnbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIG9uV2luZG93UmVzaXplKCkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG5cbiAgICBpdGVtQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQsIGl0ZW06IE1lbnVJdGVtKSB7XG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpdGVtLnVybCAmJiAhaXRlbS5yb3V0ZXJMaW5rKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uY29tbWFuZCkge1xuICAgICAgICAgICAgaXRlbS5jb21tYW5kKHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnBvcHVwKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3ZlcmxheUNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnBvcHVwKSB7XG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlTZXJ2aWNlLmFkZCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmV2ZW50RG9jdW1lbnREZWZhdWx0ID0gdHJ1ZVxuICAgIH1cblxuICAgIGJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRvY3VtZW50VGFyZ2V0OiBhbnkgPSB0aGlzLmVsID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQgOiAnZG9jdW1lbnQnO1xuXG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50VGFyZ2V0LCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnByZXZlbnREb2N1bWVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2ZW50RG9jdW1lbnREZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcikge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZFNjcm9sbExpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbmV3IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyKHRoaXMudGFyZ2V0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICB1bmJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk92ZXJsYXlIaWRlKCkge1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnByZXZlbnREb2N1bWVudERlZmF1bHQgPSBmYWxzZTtcblxuICAgICAgICBpZiAoISh0aGlzLmNkIGFzIFZpZXdSZWYpLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnBvcHVwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5jb250YWluZXIgJiYgdGhpcy5hdXRvWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5jb250YWluZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVPdmVybGF5QXBwZW5kKCk7XG4gICAgICAgICAgICB0aGlzLm9uT3ZlcmxheUhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhc1N1Yk1lbnUoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpdGVtIG9mIHRoaXMubW9kZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFJpcHBsZU1vZHVsZSwgVG9vbHRpcE1vZHVsZV0sXG4gICAgZXhwb3J0czogW01lbnUsIFJvdXRlck1vZHVsZSwgVG9vbHRpcE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbTWVudSwgTWVudUl0ZW1Db250ZW50XVxufSlcbmV4cG9ydCBjbGFzcyBNZW51TW9kdWxlIHsgfVxuIl19
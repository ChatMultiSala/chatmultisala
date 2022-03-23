import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/tooltip";
import * as i3 from "primeng/ripple";
import * as i4 from "@angular/router";
export class MegaMenu {
    constructor(el, renderer, cd) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.orientation = 'horizontal';
        this.autoZIndex = true;
        this.baseZIndex = 0;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'start':
                    this.startTemplate = item.template;
                    break;
                case 'end':
                    this.endTemplate = item.template;
                    break;
            }
        });
    }
    onCategoryMouseEnter(event, menuitem) {
        if (menuitem.disabled) {
            event.preventDefault();
            return;
        }
        if (this.activeItem) {
            this.activeItem = menuitem;
        }
    }
    onCategoryClick(event, item) {
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
        if (item.items) {
            if (this.activeItem && this.activeItem === item) {
                this.activeItem = null;
                this.unbindDocumentClickListener();
            }
            else {
                this.activeItem = item;
                this.bindDocumentClickListener();
            }
        }
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
        this.activeItem = null;
    }
    getColumnClass(menuitem) {
        let length = menuitem.items ? menuitem.items.length : 0;
        let columnClass;
        switch (length) {
            case 2:
                columnClass = 'p-megamenu-col-6';
                break;
            case 3:
                columnClass = 'p-megamenu-col-4';
                break;
            case 4:
                columnClass = 'p-megamenu-col-3';
                break;
            case 6:
                columnClass = 'p-megamenu-col-2';
                break;
            default:
                columnClass = 'p-megamenu-col-12';
                break;
        }
        return columnClass;
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = (event) => {
                if (this.el && !this.el.nativeElement.contains(event.target)) {
                    this.activeItem = null;
                    this.unbindDocumentClickListener();
                    this.cd.markForCheck();
                }
            };
            document.addEventListener('click', this.documentClickListener);
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
            this.documentClickListener = null;
        }
    }
}
MegaMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MegaMenu, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
MegaMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.6", type: MegaMenu, selector: "p-megaMenu", inputs: { model: "model", style: "style", styleClass: "styleClass", orientation: "orientation", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [class]="styleClass" [ngStyle]="style"
            [ngClass]="{'p-megamenu p-component':true,'p-megamenu-horizontal': orientation == 'horizontal','p-megamenu-vertical': orientation == 'vertical'}">
            <div class="p-megamenu-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <ul class="p-megamenu-root-list" role="menubar">
                <ng-template ngFor let-category [ngForOf]="model">
                    <li *ngIf="category.separator" class="p-menu-separator" [ngClass]="{'p-hidden': category.visible === false}">
                    <li *ngIf="!category.separator" [ngClass]="{'p-menuitem':true,'p-menuitem-active':category==activeItem, 'p-hidden': category.visible === false}" pTooltip [tooltipOptions]="category.tooltipOptions"
                        (mouseenter)="onCategoryMouseEnter($event, category)">
                        <a *ngIf="!category.routerLink" [href]="category.url||'#'" [target]="category.target" [attr.title]="category.title" [attr.id]="category.id" (click)="onCategoryClick($event, category)" [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [ngClass]="{'p-menuitem-link':true,'p-disabled':category.disabled}" [ngStyle]="category.style" [class]="category.styleClass" pRipple>
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlLabel">{{category.label}}</span>
                            <ng-template #categoryHtmlLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span *ngIf="category.items" class="p-submenu-icon pi" [ngClass]="{'pi-angle-down':orientation=='horizontal','pi-angle-right':orientation=='vertical'}"></span>
                        </a>
                        <a *ngIf="category.routerLink" [routerLink]="category.routerLink" [queryParams]="category.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [routerLinkActiveOptions]="category.routerLinkActiveOptions||{exact:false}" [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [target]="category.target" [attr.title]="category.title" [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)" [ngClass]="{'p-menuitem-link':true,'p-disabled':category.disabled}" [ngStyle]="category.style" [class]="category.styleClass"
                            [fragment]="category.fragment" [queryParamsHandling]="category.queryParamsHandling" [preserveFragment]="category.preserveFragment" [skipLocationChange]="category.skipLocationChange" [replaceUrl]="category.replaceUrl" [state]="category.state" pRipple>
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlRouteLabel">{{category.label}}</span>
                            <ng-template #categoryHtmlRouteLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                        </a>
                        <div class="p-megamenu-panel" *ngIf="category.items">
                            <div class="p-megamenu-grid">
                                <ng-template ngFor let-column [ngForOf]="category.items">
                                    <div [class]="getColumnClass(category)">
                                        <ng-template ngFor let-submenu [ngForOf]="column">
                                            <ul class="p-megamenu-submenu" role="menu">
                                                <li class="p-megamenu-submenu-header">
                                                    <span *ngIf="submenu.escape !== false; else submenuHtmlLabel">{{submenu.label}}</span>
                                                    <ng-template #submenuHtmlLabel><span [innerHTML]="submenu.label"></span></ng-template>
                                                </li>
                                                <ng-template ngFor let-item [ngForOf]="submenu.items">
                                                    <li *ngIf="item.separator" class="p-menu-separator" [ngClass]="{'p-hidden': item.visible === false}" role="separator">
                                                    <li *ngIf="!item.separator" class="p-menuitem" [ngClass]="{'p-hidden': item.visible === false}" role="none" pTooltip [tooltipOptions]="item.tooltipOptions">
                                                        <a *ngIf="!item.routerLink" role="menuitem" [href]="item.url||'#'" class="p-menuitem-link" [target]="item.target" [attr.title]="item.title" [attr.id]="item.id" [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [ngClass]="{'p-disabled':item.disabled}" (click)="itemClick($event, item)" pRipple>
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{item.label}}</span>
                                                            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                        </a>
                                                        <a *ngIf="item.routerLink" role="menuitem" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" class="p-menuitem-link"
                                                             [target]="item.target" [attr.title]="item.title" [attr.id]="item.id"
                                                            [ngClass]="{'p-disabled':item.disabled}" (click)="itemClick($event, item)"
                                                            [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state" pRipple>
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{item.label}}</span>
                                                            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                        </a>
                                                    </li>
                                                </ng-template>
                                            </ul>
                                        </ng-template>
                                    </div>
                                </ng-template>
                            </div>
                        </div>
                    </li>
                </ng-template>
                <div class="p-megamenu-end" *ngIf="endTemplate; else legacy">
                    <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
                </div>
                <ng-template #legacy>
                    <div class="p-megamenu-end">
                        <ng-content></ng-content>
                    </div>
                </ng-template>
            </ul>
        </div>
    `, isInline: true, styles: [".p-megamenu-root-list{margin:0;padding:0;list-style:none}.p-megamenu-root-list>.p-menuitem{position:relative}.p-megamenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-megamenu .p-menuitem-text{line-height:1}.p-megamenu-panel{display:none;position:absolute;width:auto;z-index:1}.p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{display:block}.p-megamenu-submenu{margin:0;padding:0;list-style:none}.p-megamenu-horizontal .p-megamenu-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-megamenu-vertical .p-megamenu-root-list{flex-direction:column}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{left:100%;top:0}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem>.p-menuitem-link>.p-submenu-icon{margin-left:auto}.p-megamenu-grid{display:flex}.p-megamenu-col-2,.p-megamenu-col-3,.p-megamenu-col-4,.p-megamenu-col-6,.p-megamenu-col-12{flex:0 0 auto;padding:.5rem}.p-megamenu-col-2{width:16.6667%}.p-megamenu-col-3{width:25%}.p-megamenu-col-4{width:33.3333%}.p-megamenu-col-6{width:50%}.p-megamenu-col-12{width:100%}\n"], directives: [{ type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { type: i3.Ripple, selector: "[pRipple]" }, { type: i4.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "relativeTo", "routerLink"] }, { type: i4.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MegaMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-megaMenu', template: `
        <div [class]="styleClass" [ngStyle]="style"
            [ngClass]="{'p-megamenu p-component':true,'p-megamenu-horizontal': orientation == 'horizontal','p-megamenu-vertical': orientation == 'vertical'}">
            <div class="p-megamenu-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <ul class="p-megamenu-root-list" role="menubar">
                <ng-template ngFor let-category [ngForOf]="model">
                    <li *ngIf="category.separator" class="p-menu-separator" [ngClass]="{'p-hidden': category.visible === false}">
                    <li *ngIf="!category.separator" [ngClass]="{'p-menuitem':true,'p-menuitem-active':category==activeItem, 'p-hidden': category.visible === false}" pTooltip [tooltipOptions]="category.tooltipOptions"
                        (mouseenter)="onCategoryMouseEnter($event, category)">
                        <a *ngIf="!category.routerLink" [href]="category.url||'#'" [target]="category.target" [attr.title]="category.title" [attr.id]="category.id" (click)="onCategoryClick($event, category)" [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [ngClass]="{'p-menuitem-link':true,'p-disabled':category.disabled}" [ngStyle]="category.style" [class]="category.styleClass" pRipple>
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlLabel">{{category.label}}</span>
                            <ng-template #categoryHtmlLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                            <span *ngIf="category.items" class="p-submenu-icon pi" [ngClass]="{'pi-angle-down':orientation=='horizontal','pi-angle-right':orientation=='vertical'}"></span>
                        </a>
                        <a *ngIf="category.routerLink" [routerLink]="category.routerLink" [queryParams]="category.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [routerLinkActiveOptions]="category.routerLinkActiveOptions||{exact:false}" [attr.tabindex]="category.tabindex ? category.tabindex : '0'"
                            [target]="category.target" [attr.title]="category.title" [attr.id]="category.id"
                            (click)="onCategoryClick($event, category)" [ngClass]="{'p-menuitem-link':true,'p-disabled':category.disabled}" [ngStyle]="category.style" [class]="category.styleClass"
                            [fragment]="category.fragment" [queryParamsHandling]="category.queryParamsHandling" [preserveFragment]="category.preserveFragment" [skipLocationChange]="category.skipLocationChange" [replaceUrl]="category.replaceUrl" [state]="category.state" pRipple>
                            <span class="p-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="p-menuitem-text" *ngIf="category.escape !== false; else categoryHtmlRouteLabel">{{category.label}}</span>
                            <ng-template #categoryHtmlRouteLabel><span class="p-menuitem-text" [innerHTML]="category.label"></span></ng-template>
                        </a>
                        <div class="p-megamenu-panel" *ngIf="category.items">
                            <div class="p-megamenu-grid">
                                <ng-template ngFor let-column [ngForOf]="category.items">
                                    <div [class]="getColumnClass(category)">
                                        <ng-template ngFor let-submenu [ngForOf]="column">
                                            <ul class="p-megamenu-submenu" role="menu">
                                                <li class="p-megamenu-submenu-header">
                                                    <span *ngIf="submenu.escape !== false; else submenuHtmlLabel">{{submenu.label}}</span>
                                                    <ng-template #submenuHtmlLabel><span [innerHTML]="submenu.label"></span></ng-template>
                                                </li>
                                                <ng-template ngFor let-item [ngForOf]="submenu.items">
                                                    <li *ngIf="item.separator" class="p-menu-separator" [ngClass]="{'p-hidden': item.visible === false}" role="separator">
                                                    <li *ngIf="!item.separator" class="p-menuitem" [ngClass]="{'p-hidden': item.visible === false}" role="none" pTooltip [tooltipOptions]="item.tooltipOptions">
                                                        <a *ngIf="!item.routerLink" role="menuitem" [href]="item.url||'#'" class="p-menuitem-link" [target]="item.target" [attr.title]="item.title" [attr.id]="item.id" [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [ngClass]="{'p-disabled':item.disabled}" (click)="itemClick($event, item)" pRipple>
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlLabel">{{item.label}}</span>
                                                            <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                        </a>
                                                        <a *ngIf="item.routerLink" role="menuitem" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'p-menuitem-link-active'" [attr.tabindex]="item.tabindex ? item.tabindex : '0'"
                                                            [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" class="p-menuitem-link"
                                                             [target]="item.target" [attr.title]="item.title" [attr.id]="item.id"
                                                            [ngClass]="{'p-disabled':item.disabled}" (click)="itemClick($event, item)"
                                                            [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state" pRipple>
                                                            <span class="p-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                                                            <span class="p-menuitem-text" *ngIf="item.escape !== false; else htmlRouteLabel">{{item.label}}</span>
                                                            <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="item.label"></span></ng-template>
                                                        </a>
                                                    </li>
                                                </ng-template>
                                            </ul>
                                        </ng-template>
                                    </div>
                                </ng-template>
                            </div>
                        </div>
                    </li>
                </ng-template>
                <div class="p-megamenu-end" *ngIf="endTemplate; else legacy">
                    <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
                </div>
                <ng-template #legacy>
                    <div class="p-megamenu-end">
                        <ng-content></ng-content>
                    </div>
                </ng-template>
            </ul>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-megamenu-root-list{margin:0;padding:0;list-style:none}.p-megamenu-root-list>.p-menuitem{position:relative}.p-megamenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-megamenu .p-menuitem-text{line-height:1}.p-megamenu-panel{display:none;position:absolute;width:auto;z-index:1}.p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{display:block}.p-megamenu-submenu{margin:0;padding:0;list-style:none}.p-megamenu-horizontal .p-megamenu-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-megamenu-vertical .p-megamenu-root-list{flex-direction:column}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem-active>.p-megamenu-panel{left:100%;top:0}.p-megamenu-vertical .p-megamenu-root-list>.p-menuitem>.p-menuitem-link>.p-submenu-icon{margin-left:auto}.p-megamenu-grid{display:flex}.p-megamenu-col-2,.p-megamenu-col-3,.p-megamenu-col-4,.p-megamenu-col-6,.p-megamenu-col-12{flex:0 0 auto;padding:.5rem}.p-megamenu-col-2{width:16.6667%}.p-megamenu-col-3{width:25%}.p-megamenu-col-4{width:33.3333%}.p-megamenu-col-6{width:50%}.p-megamenu-col-12{width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { model: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], orientation: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class MegaMenuModule {
}
MegaMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MegaMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MegaMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MegaMenuModule, declarations: [MegaMenu], imports: [CommonModule, RouterModule, RippleModule, TooltipModule], exports: [MegaMenu, RouterModule, TooltipModule] });
MegaMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MegaMenuModule, imports: [[CommonModule, RouterModule, RippleModule, TooltipModule], RouterModule, TooltipModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: MegaMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
                    exports: [MegaMenu, RouterModule, TooltipModule],
                    declarations: [MegaMenu]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVnYW1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvbWVnYW1lbnUvbWVnYW1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQVksS0FBSyxFQUFXLHVCQUF1QixFQUFFLGlCQUFpQixFQUF1QyxlQUFlLEVBQXlCLE1BQU0sZUFBZSxDQUFDO0FBQ3JNLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQXdCLGFBQWEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNqRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7O0FBc0Y5QyxNQUFNLE9BQU8sUUFBUTtJQXdCakIsWUFBbUIsRUFBYyxFQUFTLFFBQW1CLEVBQVMsRUFBcUI7UUFBeEUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQWhCbEYsZ0JBQVcsR0FBVyxZQUFZLENBQUM7UUFFbkMsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUzQixlQUFVLEdBQVcsQ0FBQyxDQUFDO0lBWThELENBQUM7SUFFL0Ysa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDbkIsS0FBSyxPQUFPO29CQUNSLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDdkMsTUFBTTtnQkFFTixLQUFLLEtBQUs7b0JBQ04sSUFBSSxDQUFDLFdBQVcsR0FB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QkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUUwQixTQUFTO3NCQUF4QyxlQUFlO3VCQUFDLGFBQWE7O0FBNklsQyxNQUFNLE9BQU8sY0FBYzs7MkdBQWQsY0FBYzs0R0FBZCxjQUFjLGlCQTNKZCxRQUFRLGFBdUpQLFlBQVksRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLGFBQWEsYUF2SnJELFFBQVEsRUF3SkUsWUFBWSxFQUFDLGFBQWE7NEdBR3BDLGNBQWMsWUFKZCxDQUFDLFlBQVksRUFBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLGFBQWEsQ0FBQyxFQUM1QyxZQUFZLEVBQUMsYUFBYTsyRkFHcEMsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxhQUFhLENBQUM7b0JBQy9ELE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBQyxZQUFZLEVBQUMsYUFBYSxDQUFDO29CQUM5QyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsRWxlbWVudFJlZixJbnB1dCxSZW5kZXJlcjIsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBDaGFuZ2VEZXRlY3RvclJlZiwgQWZ0ZXJDb250ZW50SW5pdCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNZWdhTWVudUl0ZW0sTWVudUl0ZW0sIFByaW1lVGVtcGxhdGV9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7Um91dGVyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtSaXBwbGVNb2R1bGV9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7VG9vbHRpcE1vZHVsZX0gZnJvbSAncHJpbWVuZy90b29sdGlwJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLW1lZ2FNZW51JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtjbGFzc109XCJzdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLW1lZ2FtZW51IHAtY29tcG9uZW50Jzp0cnVlLCdwLW1lZ2FtZW51LWhvcml6b250YWwnOiBvcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcsJ3AtbWVnYW1lbnUtdmVydGljYWwnOiBvcmllbnRhdGlvbiA9PSAndmVydGljYWwnfVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVnYW1lbnUtc3RhcnRcIiAqbmdJZj1cInN0YXJ0VGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic3RhcnRUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJwLW1lZ2FtZW51LXJvb3QtbGlzdFwiIHJvbGU9XCJtZW51YmFyXCI+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1jYXRlZ29yeSBbbmdGb3JPZl09XCJtb2RlbFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgKm5nSWY9XCJjYXRlZ29yeS5zZXBhcmF0b3JcIiBjbGFzcz1cInAtbWVudS1zZXBhcmF0b3JcIiBbbmdDbGFzc109XCJ7J3AtaGlkZGVuJzogY2F0ZWdvcnkudmlzaWJsZSA9PT0gZmFsc2V9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSAqbmdJZj1cIiFjYXRlZ29yeS5zZXBhcmF0b3JcIiBbbmdDbGFzc109XCJ7J3AtbWVudWl0ZW0nOnRydWUsJ3AtbWVudWl0ZW0tYWN0aXZlJzpjYXRlZ29yeT09YWN0aXZlSXRlbSwgJ3AtaGlkZGVuJzogY2F0ZWdvcnkudmlzaWJsZSA9PT0gZmFsc2V9XCIgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cImNhdGVnb3J5LnRvb2x0aXBPcHRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChtb3VzZWVudGVyKT1cIm9uQ2F0ZWdvcnlNb3VzZUVudGVyKCRldmVudCwgY2F0ZWdvcnkpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YSAqbmdJZj1cIiFjYXRlZ29yeS5yb3V0ZXJMaW5rXCIgW2hyZWZdPVwiY2F0ZWdvcnkudXJsfHwnIydcIiBbdGFyZ2V0XT1cImNhdGVnb3J5LnRhcmdldFwiIFthdHRyLnRpdGxlXT1cImNhdGVnb3J5LnRpdGxlXCIgW2F0dHIuaWRdPVwiY2F0ZWdvcnkuaWRcIiAoY2xpY2spPVwib25DYXRlZ29yeUNsaWNrKCRldmVudCwgY2F0ZWdvcnkpXCIgW2F0dHIudGFiaW5kZXhdPVwiY2F0ZWdvcnkudGFiaW5kZXggPyBjYXRlZ29yeS50YWJpbmRleCA6ICcwJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLW1lbnVpdGVtLWxpbmsnOnRydWUsJ3AtZGlzYWJsZWQnOmNhdGVnb3J5LmRpc2FibGVkfVwiIFtuZ1N0eWxlXT1cImNhdGVnb3J5LnN0eWxlXCIgW2NsYXNzXT1cImNhdGVnb3J5LnN0eWxlQ2xhc3NcIiBwUmlwcGxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1pY29uXCIgKm5nSWY9XCJjYXRlZ29yeS5pY29uXCIgW25nQ2xhc3NdPVwiY2F0ZWdvcnkuaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiY2F0ZWdvcnkuZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBjYXRlZ29yeUh0bWxMYWJlbFwiPnt7Y2F0ZWdvcnkubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2NhdGVnb3J5SHRtbExhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJjYXRlZ29yeS5sYWJlbFwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiY2F0ZWdvcnkuaXRlbXNcIiBjbGFzcz1cInAtc3VibWVudS1pY29uIHBpXCIgW25nQ2xhc3NdPVwieydwaS1hbmdsZS1kb3duJzpvcmllbnRhdGlvbj09J2hvcml6b250YWwnLCdwaS1hbmdsZS1yaWdodCc6b3JpZW50YXRpb249PSd2ZXJ0aWNhbCd9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgKm5nSWY9XCJjYXRlZ29yeS5yb3V0ZXJMaW5rXCIgW3JvdXRlckxpbmtdPVwiY2F0ZWdvcnkucm91dGVyTGlua1wiIFtxdWVyeVBhcmFtc109XCJjYXRlZ29yeS5xdWVyeVBhcmFtc1wiIFtyb3V0ZXJMaW5rQWN0aXZlXT1cIidwLW1lbnVpdGVtLWxpbmstYWN0aXZlJ1wiIFtyb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc109XCJjYXRlZ29yeS5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc3x8e2V4YWN0OmZhbHNlfVwiIFthdHRyLnRhYmluZGV4XT1cImNhdGVnb3J5LnRhYmluZGV4ID8gY2F0ZWdvcnkudGFiaW5kZXggOiAnMCdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0YXJnZXRdPVwiY2F0ZWdvcnkudGFyZ2V0XCIgW2F0dHIudGl0bGVdPVwiY2F0ZWdvcnkudGl0bGVcIiBbYXR0ci5pZF09XCJjYXRlZ29yeS5pZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uQ2F0ZWdvcnlDbGljaygkZXZlbnQsIGNhdGVnb3J5KVwiIFtuZ0NsYXNzXT1cInsncC1tZW51aXRlbS1saW5rJzp0cnVlLCdwLWRpc2FibGVkJzpjYXRlZ29yeS5kaXNhYmxlZH1cIiBbbmdTdHlsZV09XCJjYXRlZ29yeS5zdHlsZVwiIFtjbGFzc109XCJjYXRlZ29yeS5zdHlsZUNsYXNzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJhZ21lbnRdPVwiY2F0ZWdvcnkuZnJhZ21lbnRcIiBbcXVlcnlQYXJhbXNIYW5kbGluZ109XCJjYXRlZ29yeS5xdWVyeVBhcmFtc0hhbmRsaW5nXCIgW3ByZXNlcnZlRnJhZ21lbnRdPVwiY2F0ZWdvcnkucHJlc2VydmVGcmFnbWVudFwiIFtza2lwTG9jYXRpb25DaGFuZ2VdPVwiY2F0ZWdvcnkuc2tpcExvY2F0aW9uQ2hhbmdlXCIgW3JlcGxhY2VVcmxdPVwiY2F0ZWdvcnkucmVwbGFjZVVybFwiIFtzdGF0ZV09XCJjYXRlZ29yeS5zdGF0ZVwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWljb25cIiAqbmdJZj1cImNhdGVnb3J5Lmljb25cIiBbbmdDbGFzc109XCJjYXRlZ29yeS5pY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgKm5nSWY9XCJjYXRlZ29yeS5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGNhdGVnb3J5SHRtbFJvdXRlTGFiZWxcIj57e2NhdGVnb3J5LmxhYmVsfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNjYXRlZ29yeUh0bWxSb3V0ZUxhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJjYXRlZ29yeS5sYWJlbFwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVnYW1lbnUtcGFuZWxcIiAqbmdJZj1cImNhdGVnb3J5Lml0ZW1zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVnYW1lbnUtZ3JpZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LWNvbHVtbiBbbmdGb3JPZl09XCJjYXRlZ29yeS5pdGVtc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBbY2xhc3NdPVwiZ2V0Q29sdW1uQ2xhc3MoY2F0ZWdvcnkpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1zdWJtZW51IFtuZ0Zvck9mXT1cImNvbHVtblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJwLW1lZ2FtZW51LXN1Ym1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwicC1tZWdhbWVudS1zdWJtZW51LWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwic3VibWVudS5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIHN1Ym1lbnVIdG1sTGFiZWxcIj57e3N1Ym1lbnUubGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI3N1Ym1lbnVIdG1sTGFiZWw+PHNwYW4gW2lubmVySFRNTF09XCJzdWJtZW51LmxhYmVsXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1pdGVtIFtuZ0Zvck9mXT1cInN1Ym1lbnUuaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgKm5nSWY9XCJpdGVtLnNlcGFyYXRvclwiIGNsYXNzPVwicC1tZW51LXNlcGFyYXRvclwiIFtuZ0NsYXNzXT1cInsncC1oaWRkZW4nOiBpdGVtLnZpc2libGUgPT09IGZhbHNlfVwiIHJvbGU9XCJzZXBhcmF0b3JcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgKm5nSWY9XCIhaXRlbS5zZXBhcmF0b3JcIiBjbGFzcz1cInAtbWVudWl0ZW1cIiBbbmdDbGFzc109XCJ7J3AtaGlkZGVuJzogaXRlbS52aXNpYmxlID09PSBmYWxzZX1cIiByb2xlPVwibm9uZVwiIHBUb29sdGlwIFt0b29sdGlwT3B0aW9uc109XCJpdGVtLnRvb2x0aXBPcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiIWl0ZW0ucm91dGVyTGlua1wiIHJvbGU9XCJtZW51aXRlbVwiIFtocmVmXT1cIml0ZW0udXJsfHwnIydcIiBjbGFzcz1cInAtbWVudWl0ZW0tbGlua1wiIFt0YXJnZXRdPVwiaXRlbS50YXJnZXRcIiBbYXR0ci50aXRsZV09XCJpdGVtLnRpdGxlXCIgW2F0dHIuaWRdPVwiaXRlbS5pZFwiIFthdHRyLnRhYmluZGV4XT1cIml0ZW0udGFiaW5kZXggPyBpdGVtLnRhYmluZGV4IDogJzAnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsncC1kaXNhYmxlZCc6aXRlbS5kaXNhYmxlZH1cIiAoY2xpY2spPVwiaXRlbUNsaWNrKCRldmVudCwgaXRlbSlcIiBwUmlwcGxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWljb25cIiAqbmdJZj1cIml0ZW0uaWNvblwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgKm5nSWY9XCJpdGVtLmVzY2FwZSAhPT0gZmFsc2U7IGVsc2UgaHRtbExhYmVsXCI+e3tpdGVtLmxhYmVsfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2h0bWxMYWJlbD48c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiIFtpbm5lckhUTUxdPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiaXRlbS5yb3V0ZXJMaW5rXCIgcm9sZT1cIm1lbnVpdGVtXCIgW3JvdXRlckxpbmtdPVwiaXRlbS5yb3V0ZXJMaW5rXCIgW3F1ZXJ5UGFyYW1zXT1cIml0ZW0ucXVlcnlQYXJhbXNcIiBbcm91dGVyTGlua0FjdGl2ZV09XCIncC1tZW51aXRlbS1saW5rLWFjdGl2ZSdcIiBbYXR0ci50YWJpbmRleF09XCJpdGVtLnRhYmluZGV4ID8gaXRlbS50YWJpbmRleCA6ICcwJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwiaXRlbS5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc3x8e2V4YWN0OmZhbHNlfVwiIGNsYXNzPVwicC1tZW51aXRlbS1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCIgW2F0dHIudGl0bGVdPVwiaXRlbS50aXRsZVwiIFthdHRyLmlkXT1cIml0ZW0uaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLWRpc2FibGVkJzppdGVtLmRpc2FibGVkfVwiIChjbGljayk9XCJpdGVtQ2xpY2soJGV2ZW50LCBpdGVtKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZnJhZ21lbnRdPVwiaXRlbS5mcmFnbWVudFwiIFtxdWVyeVBhcmFtc0hhbmRsaW5nXT1cIml0ZW0ucXVlcnlQYXJhbXNIYW5kbGluZ1wiIFtwcmVzZXJ2ZUZyYWdtZW50XT1cIml0ZW0ucHJlc2VydmVGcmFnbWVudFwiIFtza2lwTG9jYXRpb25DaGFuZ2VdPVwiaXRlbS5za2lwTG9jYXRpb25DaGFuZ2VcIiBbcmVwbGFjZVVybF09XCJpdGVtLnJlcGxhY2VVcmxcIiBbc3RhdGVdPVwiaXRlbS5zdGF0ZVwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiICpuZ0lmPVwiaXRlbS5pY29uXCIgW25nQ2xhc3NdPVwiaXRlbS5pY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiAqbmdJZj1cIml0ZW0uZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBodG1sUm91dGVMYWJlbFwiPnt7aXRlbS5sYWJlbH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNodG1sUm91dGVMYWJlbD48c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiIFtpbm5lckhUTUxdPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1tZWdhbWVudS1lbmRcIiAqbmdJZj1cImVuZFRlbXBsYXRlOyBlbHNlIGxlZ2FjeVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZW5kVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2xlZ2FjeT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVnYW1lbnUtZW5kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vbWVnYW1lbnUuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgTWVnYU1lbnUgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcblxuICAgIEBJbnB1dCgpIG1vZGVsOiBNZWdhTWVudUl0ZW1bXTtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBvcmllbnRhdGlvbjogc3RyaW5nID0gJ2hvcml6b250YWwnO1xuXG4gICAgQElucHV0KCkgYXV0b1pJbmRleDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBiYXNlWkluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgYWN0aXZlSXRlbTogYW55O1xuXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBhbnk7XG5cbiAgICBzdGFydFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZW5kVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2goaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzdGFydCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25DYXRlZ29yeU1vdXNlRW50ZXIoZXZlbnQsIG1lbnVpdGVtOiBNZWdhTWVudUl0ZW0pIHtcbiAgICAgICAgaWYgKG1lbnVpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gbWVudWl0ZW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkNhdGVnb3J5Q2xpY2soZXZlbnQsIGl0ZW06IE1lbnVJdGVtIHwgTWVnYU1lbnVJdGVtKSB7XG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpdGVtLnVybCAmJiAhaXRlbS5yb3V0ZXJMaW5rKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uY29tbWFuZCkge1xuICAgICAgICAgICAgaXRlbS5jb21tYW5kKHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLml0ZW1zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVJdGVtICYmIHRoaXMuYWN0aXZlSXRlbSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpdGVtQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQsIGl0ZW06IE1lbnVJdGVtIHwgTWVnYU1lbnVJdGVtKcKge1xuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXRlbS51cmwgJiYgIWl0ZW0ucm91dGVyTGluaykge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLmNvbW1hbmQpIHtcbiAgICAgICAgICAgIGl0ZW0uY29tbWFuZCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBudWxsO1xuICAgIH1cblxuICAgIGdldENvbHVtbkNsYXNzKG1lbnVpdGVtOiBNZWdhTWVudUl0ZW0pIHtcbiAgICAgICAgbGV0IGxlbmd0aCA9IG1lbnVpdGVtLml0ZW1zID8gbWVudWl0ZW0uaXRlbXMubGVuZ3RoOiAwO1xuICAgICAgICBsZXQgY29sdW1uQ2xhc3M7XG4gICAgICAgIHN3aXRjaChsZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBjb2x1bW5DbGFzcz0gJ3AtbWVnYW1lbnUtY29sLTYnO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICBjb2x1bW5DbGFzcz0gJ3AtbWVnYW1lbnUtY29sLTQnO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBjb2x1bW5DbGFzcz0gJ3AtbWVnYW1lbnUtY29sLTMnO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICBjb2x1bW5DbGFzcz0gJ3AtbWVnYW1lbnUtY29sLTInO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29sdW1uQ2xhc3M9ICdwLW1lZ2FtZW51LWNvbC0xMic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2x1bW5DbGFzcztcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVsICYmICF0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsUm91dGVyTW9kdWxlLFJpcHBsZU1vZHVsZSxUb29sdGlwTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbTWVnYU1lbnUsUm91dGVyTW9kdWxlLFRvb2x0aXBNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW01lZ2FNZW51XVxufSlcbmV4cG9ydCBjbGFzcyBNZWdhTWVudU1vZHVsZSB7IH1cbiJdfQ==
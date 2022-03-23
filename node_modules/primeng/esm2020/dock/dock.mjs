import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
export class Dock {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.model = null;
        this.position = "bottom";
        this.currentIndex = -3;
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
    }
    onListMouseLeave() {
        this.currentIndex = -3;
        this.cd.markForCheck();
    }
    onItemMouseEnter(index) {
        this.currentIndex = index;
        if (index === 1) {
        }
        this.cd.markForCheck();
    }
    onItemClick(e, item) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }
    }
    get containerClass() {
        return {
            ['p-dock p-component ' + ` p-dock-${this.position}`]: true
        };
    }
    isClickableRouterLink(item) {
        return item.routerLink && !item.disabled;
    }
    itemClass(index) {
        return {
            'p-dock-item': true,
            'p-dock-item-second-prev': (this.currentIndex - 2) === index,
            'p-dock-item-prev': (this.currentIndex - 1) === index,
            'p-dock-item-current': this.currentIndex === index,
            'p-dock-item-next': (this.currentIndex + 1) === index,
            'p-dock-item-second-next': (this.currentIndex + 2) === index
        };
    }
}
Dock.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: Dock, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Dock.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.6", type: Dock, selector: "p-dock", inputs: { id: "id", style: "style", styleClass: "styleClass", model: "model", position: "position" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [attr.id]="id" [ngClass]="containerClass" [ngStyle]="style" [class]="styleClass">
            <div class="p-dock-list-container">
                <ul #list class="p-dock-list" role="menu" (mouseleave)="onListMouseLeave()">
                    <li *ngFor="let item of model; let i = index" [ngClass]="itemClass(i)" (mouseenter)="onItemMouseEnter(i)">
                        <a *ngIf="isClickableRouterLink(item); else elseBlock" pRipple [routerLink]="item.routerLink" [queryParams]="item.queryParams"
                            [ngClass]="{'p-disabled':item.disabled}" class="p-dock-action"  role="menuitem" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" (click)="onItemClick($event, item)" (keydown.enter)="onItemClick($event, item, i)"
                            [target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled || readonly ? null : (item.tabindex ? item.tabindex : '0')"  pTooltip [tooltipOptions]="item.tooltipOptions"
                            [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state">
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                        </a>
                        <ng-template #elseBlock>
                            <a [tooltipPosition]="item.tooltipPosition" [attr.href]="item.url||null" class="p-dock-action"  role="menuitem" pRipple (click)="onItemClick($event, item)"  pTooltip [tooltipOptions]="item.tooltipOptions"
                                [ngClass]="{'p-disabled':item.disabled}" (keydown.enter)="onItemClick($event, item, i)" [target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled||(i !== activeIndex && readonly) ? null : (item.tabindex ? item.tabindex : '0')">
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                            </a>
                        </ng-template>
                    </li>
                </ul>
            </div>
        </div>
    `, isInline: true, styles: [".p-dock{position:absolute;z-index:1;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dock-list-container{display:flex;pointer-events:auto}.p-dock-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center}.p-dock-item{transition:all .2s cubic-bezier(.4,0,.2,1);will-change:transform}.p-dock-action{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:default}.p-dock-item-second-prev,.p-dock-item-second-next{transform:scale(1.2)}.p-dock-item-prev,.p-dock-item-next{transform:scale(1.4)}.p-dock-item-current{transform:scale(1.6);z-index:1}.p-dock-top{left:0;top:0;width:100%}.p-dock-top .p-dock-item{transform-origin:center top}.p-dock-bottom{left:0;bottom:0;width:100%}.p-dock-bottom .p-dock-item{transform-origin:center bottom}.p-dock-right{right:0;top:0;height:100%}.p-dock-right .p-dock-item{transform-origin:center right}.p-dock-right .p-dock-list{flex-direction:column}.p-dock-left{left:0;top:0;height:100%}.p-dock-left .p-dock-item{transform-origin:center left}.p-dock-left .p-dock-list{flex-direction:column}\n"], directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "relativeTo", "routerLink"] }, { type: i3.Ripple, selector: "[pRipple]" }, { type: i4.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: Dock, decorators: [{
            type: Component,
            args: [{ selector: 'p-dock', template: `
        <div [attr.id]="id" [ngClass]="containerClass" [ngStyle]="style" [class]="styleClass">
            <div class="p-dock-list-container">
                <ul #list class="p-dock-list" role="menu" (mouseleave)="onListMouseLeave()">
                    <li *ngFor="let item of model; let i = index" [ngClass]="itemClass(i)" (mouseenter)="onItemMouseEnter(i)">
                        <a *ngIf="isClickableRouterLink(item); else elseBlock" pRipple [routerLink]="item.routerLink" [queryParams]="item.queryParams"
                            [ngClass]="{'p-disabled':item.disabled}" class="p-dock-action"  role="menuitem" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" (click)="onItemClick($event, item)" (keydown.enter)="onItemClick($event, item, i)"
                            [target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled || readonly ? null : (item.tabindex ? item.tabindex : '0')"  pTooltip [tooltipOptions]="item.tooltipOptions"
                            [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state">
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                        </a>
                        <ng-template #elseBlock>
                            <a [tooltipPosition]="item.tooltipPosition" [attr.href]="item.url||null" class="p-dock-action"  role="menuitem" pRipple (click)="onItemClick($event, item)"  pTooltip [tooltipOptions]="item.tooltipOptions"
                                [ngClass]="{'p-disabled':item.disabled}" (keydown.enter)="onItemClick($event, item, i)" [target]="item.target" [attr.id]="item.id" [attr.tabindex]="item.disabled||(i !== activeIndex && readonly) ? null : (item.tabindex ? item.tabindex : '0')">
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item}"></ng-container>
                            </a>
                        </ng-template>
                    </li>
                </ul>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'p-element'
                    }, styles: [".p-dock{position:absolute;z-index:1;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dock-list-container{display:flex;pointer-events:auto}.p-dock-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center}.p-dock-item{transition:all .2s cubic-bezier(.4,0,.2,1);will-change:transform}.p-dock-action{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:default}.p-dock-item-second-prev,.p-dock-item-second-next{transform:scale(1.2)}.p-dock-item-prev,.p-dock-item-next{transform:scale(1.4)}.p-dock-item-current{transform:scale(1.6);z-index:1}.p-dock-top{left:0;top:0;width:100%}.p-dock-top .p-dock-item{transform-origin:center top}.p-dock-bottom{left:0;bottom:0;width:100%}.p-dock-bottom .p-dock-item{transform-origin:center bottom}.p-dock-right{right:0;top:0;height:100%}.p-dock-right .p-dock-item{transform-origin:center right}.p-dock-right .p-dock-list{flex-direction:column}.p-dock-left{left:0;top:0;height:100%}.p-dock-left .p-dock-item{transform-origin:center left}.p-dock-left .p-dock-list{flex-direction:column}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { id: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], model: [{
                type: Input
            }], position: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class DockModule {
}
DockModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: DockModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DockModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: DockModule, declarations: [Dock], imports: [CommonModule, RouterModule, RippleModule, TooltipModule], exports: [Dock, SharedModule, TooltipModule, RouterModule] });
DockModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: DockModule, imports: [[CommonModule, RouterModule, RippleModule, TooltipModule], SharedModule, TooltipModule, RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.6", ngImport: i0, type: DockModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
                    exports: [Dock, SharedModule, TooltipModule, RouterModule],
                    declarations: [Dock]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9kb2NrL2RvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUE0Qix1QkFBdUIsRUFBRSxpQkFBaUIsRUFBaUMsZUFBZSxFQUFnQyxNQUFNLGVBQWUsQ0FBQztBQUMvTSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7OztBQW1DaEQsTUFBTSxPQUFPLElBQUk7SUFrQmIsWUFBb0IsRUFBYyxFQUFTLEVBQXFCO1FBQTVDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVZ2RCxVQUFLLEdBQVUsSUFBSSxDQUFDO1FBRXBCLGFBQVEsR0FBVyxRQUFRLENBQUM7UUFTakMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDbkIsS0FBSyxNQUFNO29CQUNQLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDdEMsTUFBTTtnQkFFTjtvQkFDSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3RDLE1BQU07YUFD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bnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgSW5wdXQsIEVsZW1lbnRSZWYsIENvbnRlbnRDaGlsZCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBUZW1wbGF0ZVJlZiwgQWZ0ZXJDb250ZW50SW5pdCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IFRvb2x0aXBNb2R1bGUgfSBmcm9tICdwcmltZW5nL3Rvb2x0aXAnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZG9jaycsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbYXR0ci5pZF09XCJpZFwiIFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZG9jay1saXN0LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDx1bCAjbGlzdCBjbGFzcz1cInAtZG9jay1saXN0XCIgcm9sZT1cIm1lbnVcIiAobW91c2VsZWF2ZSk9XCJvbkxpc3RNb3VzZUxlYXZlKClcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpICpuZ0Zvcj1cImxldCBpdGVtIG9mIG1vZGVsOyBsZXQgaSA9IGluZGV4XCIgW25nQ2xhc3NdPVwiaXRlbUNsYXNzKGkpXCIgKG1vdXNlZW50ZXIpPVwib25JdGVtTW91c2VFbnRlcihpKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgKm5nSWY9XCJpc0NsaWNrYWJsZVJvdXRlckxpbmsoaXRlbSk7IGVsc2UgZWxzZUJsb2NrXCIgcFJpcHBsZSBbcm91dGVyTGlua109XCJpdGVtLnJvdXRlckxpbmtcIiBbcXVlcnlQYXJhbXNdPVwiaXRlbS5xdWVyeVBhcmFtc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieydwLWRpc2FibGVkJzppdGVtLmRpc2FibGVkfVwiIGNsYXNzPVwicC1kb2NrLWFjdGlvblwiICByb2xlPVwibWVudWl0ZW1cIiBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwiaXRlbS5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc3x8e2V4YWN0OmZhbHNlfVwiIChjbGljayk9XCJvbkl0ZW1DbGljaygkZXZlbnQsIGl0ZW0pXCIgKGtleWRvd24uZW50ZXIpPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtLCBpKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3RhcmdldF09XCJpdGVtLnRhcmdldFwiIFthdHRyLmlkXT1cIml0ZW0uaWRcIiBbYXR0ci50YWJpbmRleF09XCJpdGVtLmRpc2FibGVkIHx8IHJlYWRvbmx5ID8gbnVsbCA6IChpdGVtLnRhYmluZGV4ID8gaXRlbS50YWJpbmRleCA6ICcwJylcIiAgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cIml0ZW0udG9vbHRpcE9wdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmcmFnbWVudF09XCJpdGVtLmZyYWdtZW50XCIgW3F1ZXJ5UGFyYW1zSGFuZGxpbmddPVwiaXRlbS5xdWVyeVBhcmFtc0hhbmRsaW5nXCIgW3ByZXNlcnZlRnJhZ21lbnRdPVwiaXRlbS5wcmVzZXJ2ZUZyYWdtZW50XCIgW3NraXBMb2NhdGlvbkNoYW5nZV09XCJpdGVtLnNraXBMb2NhdGlvbkNoYW5nZVwiIFtyZXBsYWNlVXJsXT1cIml0ZW0ucmVwbGFjZVVybFwiIFtzdGF0ZV09XCJpdGVtLnN0YXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1kb2NrLWFjdGlvbi1pY29uXCIgKm5nSWY9XCJpdGVtLmljb24gJiYgIWl0ZW1UZW1wbGF0ZVwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogaXRlbX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZWxzZUJsb2NrPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIFt0b29sdGlwUG9zaXRpb25dPVwiaXRlbS50b29sdGlwUG9zaXRpb25cIiBbYXR0ci5ocmVmXT1cIml0ZW0udXJsfHxudWxsXCIgY2xhc3M9XCJwLWRvY2stYWN0aW9uXCIgIHJvbGU9XCJtZW51aXRlbVwiIHBSaXBwbGUgKGNsaWNrKT1cIm9uSXRlbUNsaWNrKCRldmVudCwgaXRlbSlcIiAgcFRvb2x0aXAgW3Rvb2x0aXBPcHRpb25zXT1cIml0ZW0udG9vbHRpcE9wdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7J3AtZGlzYWJsZWQnOml0ZW0uZGlzYWJsZWR9XCIgKGtleWRvd24uZW50ZXIpPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtLCBpKVwiIFt0YXJnZXRdPVwiaXRlbS50YXJnZXRcIiBbYXR0ci5pZF09XCJpdGVtLmlkXCIgW2F0dHIudGFiaW5kZXhdPVwiaXRlbS5kaXNhYmxlZHx8KGkgIT09IGFjdGl2ZUluZGV4ICYmIHJlYWRvbmx5KSA/IG51bGwgOiAoaXRlbS50YWJpbmRleCA/IGl0ZW0udGFiaW5kZXggOiAnMCcpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1kb2NrLWFjdGlvbi1pY29uXCIgKm5nSWY9XCJpdGVtLmljb24gJiYgIWl0ZW1UZW1wbGF0ZVwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogaXRlbX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL2RvY2suY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICAnY2xhc3MnOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgRG9jayBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuXG4gICAgQElucHV0KCkgaWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBtb2RlbDogYW55W10gPSBudWxsO1xuXG4gICAgQElucHV0KCkgcG9zaXRpb246IHN0cmluZyA9IFwiYm90dG9tXCI7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBjdXJyZW50SW5kZXg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAtMztcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2l0ZW0nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uTGlzdE1vdXNlTGVhdmUoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gLTM7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgb25JdGVtTW91c2VFbnRlcihpbmRleCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IGluZGV4O1xuXG4gICAgICAgIGlmIChpbmRleCA9PT0gMSkge1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIG9uSXRlbUNsaWNrKGUsIGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0uY29tbWFuZCkge1xuICAgICAgICAgICAgaXRlbS5jb21tYW5kKHsgb3JpZ2luYWxFdmVudDogZSwgaXRlbSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjb250YWluZXJDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFsncC1kb2NrIHAtY29tcG9uZW50ICcgKyBgIHAtZG9jay0ke3RoaXMucG9zaXRpb259YF06IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpc0NsaWNrYWJsZVJvdXRlckxpbmsoaXRlbTogYW55KSB7XG4gICAgICAgIHJldHVybiBpdGVtLnJvdXRlckxpbmsgJiYgIWl0ZW0uZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgaXRlbUNsYXNzKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncC1kb2NrLWl0ZW0nOiB0cnVlLFxuICAgICAgICAgICAgJ3AtZG9jay1pdGVtLXNlY29uZC1wcmV2JzogKHRoaXMuY3VycmVudEluZGV4IC0gMikgPT09IGluZGV4LFxuICAgICAgICAgICAgJ3AtZG9jay1pdGVtLXByZXYnOiAodGhpcy5jdXJyZW50SW5kZXggLSAxKSA9PT0gaW5kZXgsXG4gICAgICAgICAgICAncC1kb2NrLWl0ZW0tY3VycmVudCc6IHRoaXMuY3VycmVudEluZGV4ID09PSBpbmRleCxcbiAgICAgICAgICAgICdwLWRvY2staXRlbS1uZXh0JzogKHRoaXMuY3VycmVudEluZGV4ICsgMSkgPT09IGluZGV4LFxuICAgICAgICAgICAgJ3AtZG9jay1pdGVtLXNlY29uZC1uZXh0JzogKHRoaXMuY3VycmVudEluZGV4ICsgMikgPT09IGluZGV4XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFJpcHBsZU1vZHVsZSwgVG9vbHRpcE1vZHVsZV0sXG4gICAgZXhwb3J0czogW0RvY2ssIFNoYXJlZE1vZHVsZSwgVG9vbHRpcE1vZHVsZSwgUm91dGVyTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtEb2NrXVxufSlcbmV4cG9ydCBjbGFzcyBEb2NrTW9kdWxlIHsgfVxuIl19